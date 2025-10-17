const mongoose = require('mongoose');

const classGradeSubmissionSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  submitted_at: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'approved', 'rejected'],
    default: 'draft',
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approved_at: Date,
  rejected_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rejected_at: Date,
  rejection_reason: String,
  grades: {
    type: Object, // chứa JSON điểm sinh viên
    required: true,
  },
});

classGradeSubmissionSchema.index({ class_id: 1 });
classGradeSubmissionSchema.index({ status: 1 });

module.exports = mongoose.model('ClassGradeSubmission', classGradeSubmissionSchema);
