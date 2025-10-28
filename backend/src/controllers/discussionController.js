const Discussion = require('../models/discussionModel');

// [POST] Tạo bài thảo luận — thuộc tổ chức
exports.createDiscussion = async (req, res) => {
  try {
    const { class_id, author_id, title, content } = req.body;
    const organization_id = req.user.organization_id;

    if (!class_id || !author_id || !title || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const discussion = await Discussion.create({
      class_id,
      author_id,
      title,
      content,
      organization_id,
    });

    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] Lấy danh sách thảo luận trong lớp — thuộc tổ chức
exports.getDiscussionsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const organization_id = req.user.organization_id;

    const discussions = await Discussion.find({
      class_id: classId,
      organization_id,
    })
      .populate('author_id', 'full_name email')
      .sort({ created_at: -1 });

    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] Lấy 1 bài thảo luận — thuộc tổ chức
exports.getDiscussionById = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const discussion = await Discussion.findOne({
      _id: req.params.id,
      organization_id,
    }).populate('author_id', 'full_name email');

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found in your organization' });
    }

    res.status(200).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [PUT] Cập nhật bài thảo luận — thuộc tổ chức
exports.updateDiscussion = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const updated = await Discussion.findOneAndUpdate(
      { _id: req.params.id, organization_id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Discussion not found in your organization' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [PATCH] Đánh dấu đã giải quyết — thuộc tổ chức
exports.markAsResolved = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const updated = await Discussion.findOneAndUpdate(
      { _id: req.params.id, organization_id },
      { status: 'resolved' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Discussion not found in your organization' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [DELETE] Xóa bài thảo luận — thuộc tổ chức
exports.deleteDiscussion = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const deleted = await Discussion.findOneAndDelete({
      _id: req.params.id,
      organization_id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Discussion not found in your organization' });
    }

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

