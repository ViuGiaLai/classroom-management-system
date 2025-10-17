const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  createAttendance,
  getAttendanceByClass,
  updateAttendance,
  deleteAttendance,
} = require('../controllers/attendanceController');

const router = express.Router();

// CRUD
router.post('/', protect, createAttendance);
router.get('/class/:classId', protect, getAttendanceByClass);
router.put('/:id', protect, updateAttendance);
router.delete('/:id', protect, deleteAttendance);

module.exports = router;
