const Exam = require('../models/examModel');

//  Tạo bài thi — thuộc tổ chức
exports.createExam = async (req, res) => {
  try {
    const { 
      class_id, 
      title, 
      start_time, 
      duration_minutes, 
      total_points,
      questions = [] 
    } = req.body;
    
    const organization_id = req.user.organization_id;

    if (!class_id || !title || !start_time || !duration_minutes || !total_points) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields' 
      });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one question is required'
      });
    }

    const processedQuestions = questions.map((q, index) => {
      const question = {
        question_type: q.question_type,
        content: q.content,
        order: index + 1,
        max_score: q.max_score || 1
      };

      if (q.question_type === 'multiple_choice') {
        question.options = q.options || [];
        question.correct_answer = q.correct_answer;
      }

      return question;
    });

    // Calculate total points from questions if not provided
    const calculatedTotalPoints = questions.reduce(
      (sum, q) => sum + (q.max_score || 1), 0
    );

    const exam = await Exam.create({
      class_id,
      title,
      start_time: new Date(start_time),
      duration_minutes: Number(duration_minutes),
      total_points: calculatedTotalPoints,
      organization_id,
      questions: processedQuestions
    });

    res.status(201).json({
      success: true,
      data: exam
    });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating exam',
      error: error.message 
    });
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

