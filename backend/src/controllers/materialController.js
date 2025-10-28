const Material = require('../models/materialModel');
const bucket = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

exports.uploadMaterial = async (req, res) => {
  try {
    const { class_id, title } = req.body;
    const organization_id = req.user.organization_id;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    if (!class_id || !title) return res.status(400).json({ message: 'Missing required fields' });

    // Tạo tên file ngẫu nhiên
    const fileName = `materials/${uuidv4()}-${file.originalname}`;
    const filePath = file.path;

    // Upload file lên Firebase Storage
    await bucket.upload(filePath, {
      destination: fileName,
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
    });

    // Lấy URL công khai
    const file_url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;

    // Lưu thông tin vào MongoDB
    const material = await Material.create({
      class_id,
      title,
      file_url,
      file_type: file.mimetype,
      file_size: file.size,
      uploaded_by: req.user.id,
      organization_id,
    });

    // Xoá file local sau khi upload xong
    fs.unlinkSync(filePath);

    res.status(201).json(material);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

