const Exam = require('../models/examModel');

// ✅ Tạo bài thi
exports.createExam = async (req, res) => {
  try {
    const { class_id, title, start_time, duration_minutes, total_points } = req.body;

    if (!class_id || !title || !start_time || !duration_minutes || !total_points) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const exam = await Exam.create({
      class_id,
      title,
      start_time,
      duration_minutes,
      total_points,
    });

    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Lấy danh sách bài thi
exports.getExams = async (req, res) => {
  try {
    const { classId } = req.query;
    const filter = classId ? { class_id: classId } : {};

    const exams = await Exam.find(filter).sort({ start_time: -1 });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Lấy 1 bài thi
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Cập nhật bài thi
exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Xóa bài thi
exports.deleteExam = async (req, res) => {
  try {
    const deleted = await Exam.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Exam not found' });

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
