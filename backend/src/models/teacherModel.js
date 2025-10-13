const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  teacher_code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other'
  },
  date_of_birth: Date,
  phone: String,
  address: String,
  faculty_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  position: String,        // Giảng viên, Phó giáo sư, Giáo sư
  degree: String,          // Thạc sĩ, Tiến sĩ
  specialization: String,  // Chuyên ngành
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Index như SQL
teacherSchema.index({ user_id: 1 });
teacherSchema.index({ teacher_code: 1 });

module.exports = mongoose.model('Teacher', teacherSchema);
