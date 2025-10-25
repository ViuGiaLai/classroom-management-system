const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },

    //Thông tin cá nhân 
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    date_of_birth: { type: Date },
    phone: { type: String },
    address: { type: String },
    avatar_url: { type: String },

    role: {
      type: String,
      enum: ['admin', 'teacher', 'student'],
      default: 'student',
    },
    is_active: { type: Boolean, default: true },
  },
  {
    timestamps: true, // Tự tạo createdAt & updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);
