const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  student_code: {
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
  administrative_class: String,
  faculty_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  status: {
    type: String,
    enum: ['studying', 'reserved', 'leave', 'graduated'],
    default: 'studying'
  },
  year_of_admission: Number,
  academic_year: String,
  advisor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Tạo index tương đương với SQL
studentSchema.index({ user_id: 1 });
studentSchema.index({ student_code: 1 });

module.exports = mongoose.model('Student', studentSchema);
