const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  createNotification,
  getNotificationsByUser,
  markAsRead,
  deleteNotification,
} = require('../controllers/notificationController');

const router = express.Router();

router.post('/', protect, createNotification); // Tạo thông báo
router.get('/user/:userId', protect, getNotificationsByUser); // Lấy thông báo theo user
router.put('/:id/read', protect, markAsRead); // Đánh dấu đã đọc
router.delete('/:id', protect, deleteNotification); // Xóa thông báo

module.exports = router;
