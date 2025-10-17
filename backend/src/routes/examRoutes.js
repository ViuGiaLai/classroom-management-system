const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
} = require('../controllers/examController');

const router = express.Router();

router.post('/', protect, createExam);
router.get('/', protect, getExams);
router.get('/:id', protect, getExamById);
router.put('/:id', protect, updateExam);
router.delete('/:id', protect, deleteExam);

module.exports = router;
