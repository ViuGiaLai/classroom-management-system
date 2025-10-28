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

  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

// Index tương đương SQL
courseSchema.index({ code: 1 });
courseSchema.index({ department_id: 1 });
courseSchema.index({ organization_id: 1 });

module.exports = mongoose.model('Course', courseSchema);