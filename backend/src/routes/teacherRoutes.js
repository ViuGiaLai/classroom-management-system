const express = require('express');
const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('admin'), createTeacher);
router.get('/', protect, getTeachers);
router.get('/:id', protect, getTeacherById);
router.put('/:id', protect, authorize('admin'), updateTeacher);
router.delete('/:id', protect, authorize('admin'), deleteTeacher);

module.exports = router;
