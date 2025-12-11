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

// Lấy tất cả tài liệu
exports.getAllMaterials = async (req, res) => {
  try {
    const filter = { organization_id: req.user.organization_id };
    if (req.user.role === 'teacher') {
      filter.uploaded_by = req.user._id || req.user.id;
    }
    const materials = await Material.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: materials.length, data: materials });
  } catch (error) {
    console.error('Error fetching all materials:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy tất cả tài liệu', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// Lấy danh sách tài liệu theo lớp học
exports.getMaterialsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const organization_id = req.user.organization_id;

    const filter = {
      class_id: classId,
      organization_id
    };
    if (req.user.role === 'teacher') {
      filter.uploaded_by = req.user.id;
    }
    const materials = await Material.find(filter).sort({ createdAt: -1 });

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

// Xóa tài liệu
exports.deleteMaterial = async (req, res) => {
  const session = await Material.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const userId = req.user.id;
    const organization_id = req.user.organization_id;

    // Tìm tài liệu
    const material = await Material.findOne({
      _id: id,
      organization_id
    }).session(session);

    if (!material) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài liệu'
      });
    }

    // Kiểm tra quyền (chỉ người tải lên hoặc admin mới được xóa)
    if (material.uploaded_by.toString() !== userId && req.user.role !== 'admin') {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa tài liệu này'
      });
    }

    // Xóa file từ storage
    const fileName = material.file_url.split('/').pop();
    const { error: deleteError } = await supabase.storage
      .from('materials')
      .remove([fileName]);

    if (deleteError) {
      console.error('Lỗi khi xóa file từ storage:', deleteError);
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa file từ storage'
      });
    }

    // Xóa bản ghi trong database
    await Material.deleteOne({ _id: id }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Đã xóa tài liệu thành công'
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Lỗi khi xóa tài liệu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa tài liệu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
