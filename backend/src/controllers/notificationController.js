const Notification = require('../models/notificationModel');

// [POST] Tạo thông báo — thuộc tổ chức
exports.createNotification = async (req, res) => {
  try {
    const { title, content, target } = req.body;
    const organization_id = req.user.organization_id;
    const sender_id = req.user && (req.user._id || req.user.id);

    if (!sender_id || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let recipient_id = null;
    let class_id = null;

    if (target && target.type === 'class') {
      class_id = target.classId || target.class_id || null;
    }
    // Với type 'role' hoặc 'all' hiện tại broadcast cho tất cả (recipient_id = null)

    const notification = await Notification.create({
      sender_id,
      recipient_id,
      class_id,
      content,
      organization_id,
    });

    // Gửi realtime notification
    const io = req.app.locals.io;

    if (io) {
      if (class_id) {
        // Gửi thông báo cho tất cả thành viên trong lớp
        console.log(`Sending notification to class ${class_id}`);
        io.to(`class_${class_id}`).emit('receiveNotification', notification);
      } else if (recipient_id) {
        // Gửi cho người nhận cụ thể
        console.log(`Sending notification to user ${recipient_id}`);
        io.to(recipient_id.toString()).emit('receiveNotification', notification);
      } else {
        // Gửi cho tất cả mọi người 
        console.log('Broadcasting notification to all users');
        io.emit('receiveNotification', notification);
      }
    } else {
      console.warn(' Socket.IO not initialized');
    }

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] Lấy tất cả thông báo trong tổ chức
exports.getNotificationsByUser = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const notifications = await Notification.find({
      organization_id,
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

