const Question = require('../models/questionModel');

// [POST] Tạo câu hỏi mới — thuộc tổ chức
exports.createQuestion = async (req, res) => {
  try {
    const { exam_id, content, question_type, choices, answer, points, order_index } = req.body;
    const organization_id = req.user.organization_id;

    if (!exam_id || !content || !points) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const question = await Question.create({
      exam_id,
      content,
      question_type,
      choices,
      answer,
      points,
      order_index,
      organization_id,
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] Lấy danh sách câu hỏi theo exam — thuộc tổ chức
exports.getQuestionsByExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const organization_id = req.user.organization_id;

    const questions = await Question.find({
      exam_id: examId,
      organization_id,
    }).sort({ order_index: 1 });

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] Lấy chi tiết 1 câu hỏi — thuộc tổ chức
exports.getQuestionById = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const question = await Question.findOne({
      _id: req.params.id,
      organization_id,
    });

    if (!question) return res.status(404).json({ message: 'Question not found in your organization' });

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [PUT] Cập nhật câu hỏi — thuộc tổ chức
exports.updateQuestion = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const updated = await Question.findOneAndUpdate(
      { _id: req.params.id, organization_id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Question not found in your organization' });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [DELETE] Xóa câu hỏi — thuộc tổ chức
exports.deleteQuestion = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const deleted = await Question.findOneAndDelete({
      _id: req.params.id,
      organization_id,
    });

    if (!deleted) return res.status(404).json({ message: 'Question not found in your organization' });

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

