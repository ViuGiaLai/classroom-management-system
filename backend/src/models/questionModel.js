const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  exam_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  question_type: {
    type: String,
    enum: ['mcq', 'essay'], // mcq = multiple choice, essay = tự luận
    default: 'mcq',
  },
  choices: {
    type: [String], // Mảng lựa chọn cho câu hỏi trắc nghiệm
    default: [],
  },
  answer: {
    type: String, // Đáp án đúng (hoặc mẫu cho tự luận)
  },
  points: {
    type: Number,
    required: true,
  },
  order_index: {
    type: Number, // Thứ tự câu hỏi trong bài thi
    default: 0,
  },
});

questionSchema.index({ exam_id: 1 });

module.exports = mongoose.model('Question', questionSchema);
