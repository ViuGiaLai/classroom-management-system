const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    lecturer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
      index: true,
    },
    semester: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    schedule: String,
    max_capacity: {
      type: Number,
      default: 40,
    },
    current_enrollment: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

classSchema.index({ semester: 1, year: 1 });

const Class = mongoose.model('Class', classSchema);
module.exports = Class;
