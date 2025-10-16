const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  createAssignment,
  getAssignmentsByClass,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} = require('../controllers/assignmentController');

const router = express.Router();

// CRUD routes
router.post('/', protect, createAssignment);
router.get('/class/:classId', protect, getAssignmentsByClass);
router.get('/:id', protect, getAssignmentById);
router.put('/:id', protect, updateAssignment);
router.delete('/:id', protect, deleteAssignment);

module.exports = router;
