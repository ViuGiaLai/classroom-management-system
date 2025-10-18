const Discussion = require('../models/discussionModel');

// Tạo bài thảo luận
exports.createDiscussion = async (req, res) => {
  try {
    const { class_id, author_id, title, content } = req.body;

    if (!class_id || !author_id || !title || !content)
      return res.status(400).json({ message: 'Missing required fields' });

    const discussion = await Discussion.create({
      class_id,
      author_id,
      title,
      content,
    });

    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách thảo luận trong lớp
exports.getDiscussionsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const discussions = await Discussion.find({ class_id: classId })
      .populate('author_id', 'full_name email')
      .sort({ created_at: -1 });

    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy 1 bài thảo luận
exports.getDiscussionById = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('author_id', 'full_name email');
    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

    res.status(200).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật (chỉ author hoặc admin)
exports.updateDiscussion = async (req, res) => {
  try {
    const updated = await Discussion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Discussion not found' });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Đánh dấu đã giải quyết
exports.markAsResolved = async (req, res) => {
  try {
    const updated = await Discussion.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Discussion not found' });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa thảo luận
exports.deleteDiscussion = async (req, res) => {
  try {
    const deleted = await Discussion.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Discussion not found' });

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
