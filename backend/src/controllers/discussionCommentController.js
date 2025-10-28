const DiscussionComment = require('../models/discussionCommentModel');

// [POST] Thêm bình luận — thuộc tổ chức
exports.createComment = async (req, res) => {
  try {
    const { discussion_id, author_id, content } = req.body;
    const organization_id = req.user.organization_id;

    if (!discussion_id || !author_id || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const comment = await DiscussionComment.create({
      discussion_id,
      author_id,
      content,
      organization_id,
    });

    // Phát sự kiện real-time đến tất cả client trong cùng discussion
    const io = req.app.locals.io;
    io.to(discussion_id.toString()).emit('newComment', comment);

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] Lấy danh sách bình luận theo bài thảo luận — thuộc tổ chức
exports.getCommentsByDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const organization_id = req.user.organization_id;

    const comments = await DiscussionComment.find({
      discussion_id: discussionId,
      organization_id,
    })
      .populate('author_id', 'full_name email')
      .sort({ created_at: 1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [PUT] Cập nhật bình luận — thuộc tổ chức
exports.updateComment = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const updated = await DiscussionComment.findOneAndUpdate(
      { _id: req.params.id, organization_id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Comment not found in your organization' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [DELETE] Xóa bình luận — thuộc tổ chức
exports.deleteComment = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const deleted = await DiscussionComment.findOneAndDelete({
      _id: req.params.id,
      organization_id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Comment not found in your organization' });
    }

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

