const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  submitted_at: {
    type: Date,
    default: Date.now,
  },
  file_name: String,
  file_url: String,
  file_size: Number,
  status: {
    type: String,
    enum: ['pending', 'graded', 'late'],
    default: 'pending',
  },
  score: Number,
  feedback: String,
  graded_at: Date,
  graded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

submissionSchema.index({ assignment_id: 1 });
submissionSchema.index({ student_id: 1 });
submissionSchema.index({ assignment_id: 1, student_id: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
