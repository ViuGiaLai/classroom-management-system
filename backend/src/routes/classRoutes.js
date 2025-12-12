const express = require('express');
const { protect, authorize } = require('../middlewares/authMiddleware');
const classController = require('../controllers/classController');

const router = express.Router();

router.get('/', protect, classController.getAllClasses);
router.get('/teacher/my-classes', protect, authorize('teacher'), classController.getMyClasses);
router.get('/teacher/my-students', protect, authorize('teacher'), classController.getMyStudents); // ← THÊM DÒNG NÀY
router.post('/', protect, authorize('admin', 'teacher'), classController.createClass);
router.get('/:id', protect, classController.getClassById);
router.put('/:id', protect, authorize('admin', 'teacher'), classController.updateClass);
router.delete('/:id', protect, authorize('admin'), classController.deleteClass);
router.get('/:id/students', protect, classController.getStudentsInClass);
router.post('/:id/recalculate-enrollment', protect, authorize('admin', 'teacher'), classController.recalculateEnrollment);

module.exports = router;