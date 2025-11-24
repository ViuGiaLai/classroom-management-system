const express = require('express');
const { 
  getAllUsers, 
  updateUser, 
  deleteUser, 
  createUser, 
  updateProfile 
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('admin'), createUser);
router.get('/', protect, authorize('admin'), getAllUsers);
// - tự cập nhật thông tin cá nhân
// Update user profile (for current user)
router.put('/profile', protect, updateProfile);

// Update user (admin or self)
router.put('/:id', protect, authorize('admin', 'teacher', 'student'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
