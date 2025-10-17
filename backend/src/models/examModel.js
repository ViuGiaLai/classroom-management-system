const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
  },
  duration_minutes: {
    type: Number,
    required: true,
  },
  total_points: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

examSchema.index({ class_id: 1 });

module.exports = mongoose.model('Exam', examSchema);
