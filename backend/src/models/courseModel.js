const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  credits: {
    type: Number,
    required: true,
    min: 1
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Index tương đương SQL
courseSchema.index({ code: 1 });
courseSchema.index({ department_id: 1 });

module.exports = mongoose.model('Course', courseSchema);
