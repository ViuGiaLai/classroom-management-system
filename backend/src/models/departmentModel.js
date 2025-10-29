const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  faculty_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  // Liên kết với tổ chức
  organization_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Index để tìm nhanh theo faculty và tổ chức
departmentSchema.index({ faculty_id: 1 });
departmentSchema.index({ organization_id: 1 });

module.exports = mongoose.model('Department', departmentSchema);