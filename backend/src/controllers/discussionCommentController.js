const DiscussionComment = require('../models/discussionCommentModel');

// Thêm bình luận
exports.createComment = async (req, res) => {
  try {
    const { discussion_id, author_id, content } = req.body;

    if (!discussion_id || !author_id || !content)
      return res.status(400).json({ message: 'Missing required fields' });

    const comment = await DiscussionComment.create({ discussion_id, author_id, content });

    //  Phát sự kiện real-time đến tất cả client trong cùng discussion
    const io = req.app.locals.io;
    io.to(discussion_id.toString()).emit('newComment', comment);

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách bình luận theo bài thảo luận
exports.getCommentsByDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const comments = await DiscussionComment.find({ discussion_id: discussionId })
      .populate('author_id', 'full_name email')
      .sort({ created_at: 1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật bình luận (chỉ tác giả hoặc admin)
exports.updateComment = async (req, res) => {
  try {
    const updated = await DiscussionComment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: 'Comment not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa bình luận
exports.deleteComment = async (req, res) => {
  try {
    const deleted = await DiscussionComment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Comment not found' });

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
