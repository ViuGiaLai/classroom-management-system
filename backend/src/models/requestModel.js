const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  type: {
    type: String,
    enum: ['certificate', 'leave', 'financial_aid', 'other'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  processed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  response: String,
  processed_at: Date,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

requestSchema.index({ student_id: 1 });
requestSchema.index({ status: 1 });

module.exports = mongoose.model('Request', requestSchema);
