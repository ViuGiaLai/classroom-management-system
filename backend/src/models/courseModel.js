const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
  },

  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },

  credits: {
    type: Number,
    required: true,
    min: 1,
  },

  theory_hours: {
    type: Number,
    default: 0,
    min: 0,
  },

  lab_hours: {
    type: Number,
    default: 0,
    min: 0,
  },

  semester: {
    type: Number,
    min: 1,
    max: 8,
  },

  status: {
    type: String,
    enum: ['Đang hoạt động', 'Tạm dừng'],
    default: 'Đang hoạt động',
  },

  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  // Liên kết với tổ chức
  organization_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
}, { timestamps: true });

// Index tương đương SQL
courseSchema.index({ department_id: 1 });
courseSchema.index({ organization_id: 1 });

module.exports = mongoose.model('Course', courseSchema);