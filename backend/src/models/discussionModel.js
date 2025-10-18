const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

discussionSchema.index({ class_id: 1 });

module.exports = mongoose.model('Discussion', discussionSchema);
