const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  createDiscussion,
  getDiscussionsByClass,
  getDiscussionById,
  updateDiscussion,
  markAsResolved,
  deleteDiscussion,
} = require('../controllers/discussionController');

const router = express.Router();

router.post('/', protect, createDiscussion);
router.get('/class/:classId', protect, getDiscussionsByClass);
router.get('/:id', protect, getDiscussionById);
router.put('/:id', protect, updateDiscussion);
router.put('/:id/resolve', protect, markAsResolved);
router.delete('/:id', protect, deleteDiscussion);

module.exports = router;
