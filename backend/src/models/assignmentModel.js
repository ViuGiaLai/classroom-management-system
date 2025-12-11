const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['essay', 'multiple_choice'],
    default: 'essay',
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['essay', 'multiple_choice'],
      required: true
    },
    options: [String],
    correctAnswer: Number,
    points: {
      type: Number,
      default: 1,
      min: 0
    }
  }],
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
assignmentSchema.index({ organization_id: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
