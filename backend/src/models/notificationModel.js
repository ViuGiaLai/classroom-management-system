const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
  },
  content: {
    type: String,
    required: true,
  },
  is_read: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

notificationSchema.index({ recipient_id: 1 });
notificationSchema.index({ class_id: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
