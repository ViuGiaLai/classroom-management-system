const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question_type: {
    type: String,
    enum: ['multiple_choice', 'essay'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  options: [{
    id: String, // A, B, C, D
    text: String,
  }],
  correct_answer: String, 
  max_score: {
    type: Number,
    default: 1,
  },
  order: {
    type: Number,
    required: true,
  },
});

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

  questions: [questionSchema],

  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Index để tối ưu truy vấn
examSchema.index({ class_id: 1 });
examSchema.index({ organization_id: 1 });

module.exports = mongoose.model('Exam', examSchema);

