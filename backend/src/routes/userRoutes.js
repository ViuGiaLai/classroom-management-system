const express = require('express');
const { getAllUsers, updateUser, deleteUser, createUser } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('admin'), createUser);
router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
