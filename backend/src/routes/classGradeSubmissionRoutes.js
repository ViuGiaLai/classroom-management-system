const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  createSubmission,
  getSubmissions,
  submitForApproval,
  approveSubmission,
  rejectSubmission,
  deleteSubmission,
} = require('../controllers/classGradeSubmissionController');

const router = express.Router();

// CRUD
router.post('/', protect, createSubmission);
router.get('/', protect, getSubmissions);
router.put('/:id/submit', protect, submitForApproval);
router.put('/:id/approve', protect, approveSubmission);
router.put('/:id/reject', protect, rejectSubmission);
router.delete('/:id', protect, deleteSubmission);

module.exports = router;
