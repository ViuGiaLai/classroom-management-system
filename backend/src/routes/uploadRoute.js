const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');

// Handle file upload thông thường
router.post('/', uploadController.uploadFile);

// Upload và cập nhật ảnh đại diện
// POST /api/upload/avatar
router.post('/avatar', protect, uploadController.uploadAvatar);

module.exports = router;
