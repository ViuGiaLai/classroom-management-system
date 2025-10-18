const mongoose = require('mongoose');

const discussionCommentSchema = new mongoose.Schema({
  discussion_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discussion',
    required: true,
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

discussionCommentSchema.index({ discussion_id: 1 });

module.exports = mongoose.model('DiscussionComment', discussionCommentSchema);
