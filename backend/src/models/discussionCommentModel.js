const mongoose = require('mongoose');

const discussionCommentSchema = new mongoose.Schema({
  // Liên kết với chủ đề thảo luận
  discussion_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discussion',
    required: true,
  },

  // Người viết bình luận
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Nội dung bình luận
  content: {
    type: String,
    required: true,
  },

  // Liên kết với tổ chức
  organization_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Index để tối ưu truy vấn
discussionCommentSchema.index({ discussion_id: 1 });
discussionCommentSchema.index({ organization_id: 1 });

module.exports = mongoose.model('DiscussionComment', discussionCommentSchema);

