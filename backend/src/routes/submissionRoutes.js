const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { protect } = require('../middlewares/authMiddleware');
const {
  createSubmission,
  getSubmissionsByAssignment,
  gradeSubmission,
  deleteSubmission,
} = require('../controllers/submissionController');

const router = express.Router();

// CRUD routes
router.post('/', protect, upload.single('file'), createSubmission);
router.get('/assignment/:assignmentId', protect, getSubmissionsByAssignment);
router.put('/:id/grade', protect, gradeSubmission);
router.delete('/:id', protect, deleteSubmission);

module.exports = router;
