const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  createComment,
  getCommentsByDiscussion,
  updateComment,
  deleteComment,
} = require('../controllers/discussionCommentController');

const router = express.Router();

// CRUD
router.post('/', protect, createComment);
router.get('/discussion/:discussionId', protect, getCommentsByDiscussion);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
