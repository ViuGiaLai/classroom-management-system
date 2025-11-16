const express = require('express');
const { protect, authorize } = require('../middlewares/authMiddleware');
const classController = require('../controllers/classController');

const router = express.Router();

router.get('/', protect, classController.getAllClasses);
router.post('/', protect, authorize('admin', 'teacher'), classController.createClass);
router.get('/:id', protect, classController.getClassById);
router.put('/:id', protect, authorize('admin', 'teacher'), classController.updateClass);
router.delete('/:id', protect, authorize('admin'), classController.deleteClass);
router.get('/:id/students', protect, classController.getStudentsInClass);

module.exports = router;
