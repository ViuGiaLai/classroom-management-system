const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  faculty_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty', // liên kết với model Faculty
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Index để tìm nhanh theo faculty_id
departmentSchema.index({ faculty_id: 1 });

module.exports = mongoose.model('Department', departmentSchema);
