// src/routes/materialRoutes.js
const express = require('express');
const multer = require('multer');
const { 
    uploadMaterial,
    getMaterialsByClass,
    getAllMaterials,
    deleteMaterial 
} = require('../controllers/materialController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Lấy tất cả tài liệu
router.get('/', protect, getAllMaterials);
// Tải lên tài liệu mới
router.post('/upload', protect, upload.single('file'), uploadMaterial);

// Lấy danh sách tài liệu theo lớp học
router.get('/class/:classId', protect, getMaterialsByClass);

// Xóa tài liệu
router.delete('/:id', protect, deleteMaterial);

module.exports = router;
