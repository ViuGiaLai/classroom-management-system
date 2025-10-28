const Exam = require('../models/examModel');

//  Tạo bài thi — thuộc tổ chức
exports.createExam = async (req, res) => {
  try {
    const { class_id, title, start_time, duration_minutes, total_points } = req.body;
    const organization_id = req.user.organization_id;

    if (!class_id || !title || !start_time || !duration_minutes || !total_points) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const exam = await Exam.create({
      class_id,
      title,
      start_time,
      duration_minutes,
      total_points,
      organization_id,
    });

    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách bài thi — lọc theo tổ chức và lớp
exports.getExams = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;
    const { classId } = req.query;

    const filter = { organization_id };
    if (classId) filter.class_id = classId;

    const exams = await Exam.find(filter).sort({ start_time: -1 });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy 1 bài thi — thuộc tổ chức
exports.getExamById = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const exam = await Exam.findOne({
      _id: req.params.id,
      organization_id,
    });

    if (!exam) return res.status(404).json({ message: 'Exam not found in your organization' });

    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật bài thi — thuộc tổ chức
exports.updateExam = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.id, organization_id },
      req.body,
      { new: true }
    );

    if (!exam) return res.status(404).json({ message: 'Exam not found in your organization' });

    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Xóa bài thi — thuộc tổ chức
exports.deleteExam = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const deleted = await Exam.findOneAndDelete({
      _id: req.params.id,
      organization_id,
    });

    if (!deleted) return res.status(404).json({ message: 'Exam not found in your organization' });

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

