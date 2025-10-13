const express = require('express');
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Admin & teacher có thể tạo course
router.post('/', protect, authorize('admin', 'teacher'), createCourse);
router.get('/', protect, getCourses);
router.get('/:id', protect, getCourseById);
router.put('/:id', protect, authorize('admin', 'teacher'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

module.exports = router;
