const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  // Liên kết với lớp học
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
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
  },

  start_time: {
    type: Date,
    required: true,
  },

  duration_minutes: {
    type: Number,
    required: true,
  },

  total_points: {
    type: Number,
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Index để tối ưu truy vấn
examSchema.index({ class_id: 1 });
examSchema.index({ organization_id: 1 });

module.exports = mongoose.model('Exam', examSchema);

