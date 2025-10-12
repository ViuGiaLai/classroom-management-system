const express = require('express');
const { getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
