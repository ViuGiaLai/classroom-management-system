const Notification = require('../models/notificationModel');

// [POST] Tạo thông báo — thuộc tổ chức
exports.createNotification = async (req, res) => {
  try {
    const { sender_id, recipient_id, class_id, content } = req.body;
    const organization_id = req.user.organization_id;

    if (!sender_id || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const notification = await Notification.create({
      sender_id,
      recipient_id,
      class_id,
      content,
      organization_id,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] Lấy tất cả thông báo của user — thuộc tổ chức
exports.getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const organization_id = req.user.organization_id;

    const notifications = await Notification.find({
      organization_id,
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

// [PATCH] Đánh dấu đã đọc — thuộc tổ chức
exports.markAsRead = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const updated = await Notification.findOneAndUpdate(
      { _id: req.params.id, organization_id },
      { is_read: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Notification not found in your organization' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [DELETE] Xóa thông báo — thuộc tổ chức
exports.deleteNotification = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const deleted = await Notification.findOneAndDelete({
      _id: req.params.id,
      organization_id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found in your organization' });
    }

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

