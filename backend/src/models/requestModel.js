const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  type: {
    type: String,
    enum: ['certificate', 'leave', 'financial_aid', 'other'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },

  // Mô tả chi tiết
  description: {
    type: String,
  },

  // Trạng thái xử lý
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },

  // Người xử lý
  processed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  // Phản hồi từ người xử lý
  response: {
    type: String,
  },

  // Thời điểm xử lý
  processed_at: {
    type: Date,
  },

  // Liên kết với tổ chức
  organization_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },

  // Thời điểm tạo yêu cầu
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Index để tối ưu truy vấn
requestSchema.index({ student_id: 1 });
requestSchema.index({ status: 1 });
requestSchema.index({ organization_id: 1 });

module.exports = mongoose.model('Request', requestSchema);

