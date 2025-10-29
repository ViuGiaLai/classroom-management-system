const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  // Liên kết với bài tập
  assignment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },

  // Sinh viên nộp bài
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Thời điểm nộp bài
  submitted_at: {
    type: Date,
    default: Date.now,
  },

  // Thông tin file nộp
  file_name: String,
  file_url: String,
  file_size: Number,

  // Trạng thái chấm điểm
  status: {
    type: String,
    enum: ['pending', 'graded', 'late'],
    default: 'pending',
  },

  // Điểm số và phản hồi
  score: Number,
  feedback: String,
  graded_at: Date,

  // Người chấm điểm
  graded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  // Liên kết với tổ chức
  organization_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
});

// Index để tối ưu truy vấn
submissionSchema.index({ assignment_id: 1 });
submissionSchema.index({ student_id: 1 });
submissionSchema.index({ assignment_id: 1, student_id: 1 }, { unique: true });
submissionSchema.index({ organization_id: 1 });

module.exports = mongoose.model('Submission', submissionSchema);

