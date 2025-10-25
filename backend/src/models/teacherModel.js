const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    teacher_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Thông tin nghề nghiệp
    faculty_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },

    position: {
      type: String,
      trim: true, // Giảng viên, Phó giáo sư, Giáo sư
    },
    degree: {
      type: String,
      trim: true, // Thạc sĩ, Tiến sĩ
    },
    specialization: {
      type: String,
      trim: true, // Chuyên môn chính
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

teacherSchema.index({ user_id: 1 });
teacherSchema.index({ teacher_code: 1 });
teacherSchema.index({ faculty_id: 1 });
teacherSchema.index({ department_id: 1 });

module.exports = mongoose.model('Teacher', teacherSchema);
