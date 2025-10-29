const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    // Liên kết với người dùng
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // Liên kết với tổ chức
    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
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

teacherSchema.index({ faculty_id: 1 });
teacherSchema.index({ department_id: 1 });
teacherSchema.index({ organization_id: 1 });

module.exports = mongoose.model('Teacher', teacherSchema);