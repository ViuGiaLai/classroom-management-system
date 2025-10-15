const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  file_url: {
    type: String,
    required: true,
  },
  file_type: String,
  file_size: Number,
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploaded_at: {
    type: Date,
    default: Date.now,
  },
});

materialSchema.index({ class_id: 1 });
module.exports = mongoose.model('Material', materialSchema);
