const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  // Liên kết với lớp học
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },

  // Tiêu đề tài liệu
  title: {
    type: String,
    required: true,
  },

  // Đường dẫn file
  file_url: {
    type: String,
    required: true,
  },

  // Loại file (PDF, DOCX, MP4, ...)
  file_type: {
    type: String,
  },

  // Kích thước file (bytes)
  file_size: {
    type: Number,
  },

  // Người upload
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Liên kết với tổ chức
  organization_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },

  uploaded_at: {
    type: Date,
    default: Date.now,
  },
});

// Index để tối ưu truy vấn
materialSchema.index({ class_id: 1 });
materialSchema.index({ organization_id: 1 });

module.exports = mongoose.model('Material', materialSchema);

