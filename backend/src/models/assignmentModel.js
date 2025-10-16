const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  due_date: {
    type: Date,
    required: true,
  },
  max_points: {
    type: Number,
    required: true,
    min: 0,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
});

// Indexes (tối ưu tìm kiếm)
assignmentSchema.index({ class_id: 1 });
assignmentSchema.index({ due_date: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
