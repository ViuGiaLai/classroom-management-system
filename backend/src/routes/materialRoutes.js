// src/routes/materialRoutes.js
const express = require('express');
const multer = require('multer');
const { 
    uploadMaterial,
    getMaterialsByClass 
} = require('../controllers/materialController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Tải lên tài liệu mới
router.post('/upload', protect, upload.single('file'), uploadMaterial);

// Lấy danh sách tài liệu theo lớp học
router.get('/class/:classId', protect, getMaterialsByClass);

module.exports = router;
