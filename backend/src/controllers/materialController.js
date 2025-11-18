const Material = require('../models/materialModel');
const { supabase } = require('../config/supabase');
const fs = require('fs');
const path = require('path');

// Dynamic import for uuid to avoid ES Module warning
let uuidv4;
const initUuid = async () => {
  const { v4 } = await import('uuid');
  uuidv4 = v4;
};

exports.uploadMaterial = async (req, res) => {
  try {
    // Initialize uuid if not already done
    if (!uuidv4) {
      await initUuid();
    }
    
    const { class_id, title } = req.body;
    const organization_id = req.user.organization_id;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    if (!class_id || !title) return res.status(400).json({ message: 'Missing required fields' });

    const fileExt = path.extname(file.originalname); // lấy phần .pdf, .docx..
    const fileName = `${uuidv4()}${fileExt}`;
    
    // Upload trực tiếp từ buffer lên Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('materials')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Lấy URL công khai
    const { data: { publicUrl } } = supabase.storage
      .from('materials')
      .getPublicUrl(fileName);

    // Lưu vào MongoDB
    const material = await Material.create({
      class_id,
      title,
      file_url: publicUrl,
      file_type: file.mimetype,
      file_size: file.buffer.length,
      uploaded_by: req.user.id,
      organization_id,
    });

    res.status(201).json(material);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách tài liệu theo lớp học
exports.getMaterialsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const organization_id = req.user.organization_id;

    const materials = await Material.find({
      class_id: classId,
      organization_id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách tài liệu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
