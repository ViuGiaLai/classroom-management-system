const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  createQuestion,
  getQuestionsByExam,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');

const router = express.Router();

router.post('/', protect, createQuestion);
router.get('/exam/:examId', protect, getQuestionsByExam);
router.get('/:id', protect, getQuestionById);
router.put('/:id', protect, updateQuestion);
router.delete('/:id', protect, deleteQuestion);

module.exports = router;
