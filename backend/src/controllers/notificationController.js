const Notification = require('../models/notificationModel');

// Tạo thông báo
exports.createNotification = async (req, res) => {
  try {
    const { sender_id, recipient_id, class_id, content } = req.body;

    if (!sender_id || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const notification = await Notification.create({
      sender_id,
      recipient_id,
      class_id,
      content,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả thông báo của user
exports.getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({
      $or: [{ recipient_id: userId }, { recipient_id: null }],
    })
      .populate('sender_id', 'full_name email')
      .populate('class_id', 'class_name')
      .sort({ created_at: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đánh dấu đã đọc
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Notification.findByIdAndUpdate(id, { is_read: true }, { new: true });

    if (!updated) return res.status(404).json({ message: 'Notification not found' });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa thông báo
exports.deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Notification not found' });

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
