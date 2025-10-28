const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  // Tên khoa
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  // mã khoa ex: Khoa CNTT
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  // Liên kết với tổ chức
  organization_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Faculty', facultySchema);