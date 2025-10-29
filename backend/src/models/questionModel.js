const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  // Liên kết với bài thi
  exam_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },

  // Nội dung câu hỏi
  content: {
    type: String,
    required: true,
  },

  // Loại câu hỏi
  question_type: {
    type: String,
    enum: ['mcq', 'essay'],
    default: 'mcq',
  },

  // Các lựa chọn cho câu hỏi trắc nghiệm
  choices: {
    type: [String],
    default: [],
  },

  // Đáp án đúng hoặc mẫu trả lời
  answer: {
    type: String,
  },

  // Số điểm cho câu hỏi
  points: {
    type: Number,
    required: true,
  },

  // Thứ tự câu hỏi trong bài thi
  order_index: {
    type: Number,
    default: 0,
  },

  // Liên kết với tổ chức
  organization_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
});

// Index để tối ưu truy vấn
questionSchema.index({ exam_id: 1 });
questionSchema.index({ organization_id: 1 });

module.exports = mongoose.model('Question', questionSchema);

