const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  // Liên kết với lớp học
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },

  // Người tạo chủ đề
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Liên kết với tổ chức
  organization_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Index để tối ưu truy vấn
discussionSchema.index({ class_id: 1 });
discussionSchema.index({ organization_id: 1 });

module.exports = mongoose.model('Discussion', discussionSchema);

