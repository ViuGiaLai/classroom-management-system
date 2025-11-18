const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  // Tên khoa
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // mã khoa ex: Khoa CNTT
  code: {
    type: String,
    required: true,
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

// Compound unique indexes to ensure uniqueness within each organization
facultySchema.index({ organization_id: 1, code: 1 }, { unique: true });
facultySchema.index({ organization_id: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Faculty', facultySchema);