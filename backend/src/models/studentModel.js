const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
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

    student_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    administrative_class: {
      type: String,
      trim: true,
    },

    faculty_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },

    status: {
      type: String,
      enum: ['studying', 'reserved', 'leave', 'graduated'],
      default: 'studying',
    },

    year_of_admission: {
      type: Number,
    },

    academic_year: {
      type: String,
      trim: true,
    },

    advisor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

studentSchema.index({ user_id: 1 });
studentSchema.index({ student_code: 1 });
studentSchema.index({ faculty_id: 1 });
studentSchema.index({ department_id: 1 });
studentSchema.index({ organization_id: 1 });

module.exports = mongoose.model('Student', studentSchema);