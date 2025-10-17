const ClassGradeSubmission = require('../models/classGradeSubmissionModel');

// Tạo bản nộp điểm
exports.createSubmission = async (req, res) => {
  try {
    const { class_id, teacher_id, grades } = req.body;

    if (!grades || Object.keys(grades).length === 0)
      return res.status(400).json({ message: 'Grades cannot be empty' });

    const submission = await ClassGradeSubmission.create({
      class_id,
      teacher_id,
      grades,
      status: 'draft',
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách bản nộp điểm (lọc theo lớp, giảng viên, trạng thái)
exports.getSubmissions = async (req, res) => {
  try {
    const filter = {};
    const { classId, teacherId, status } = req.query;

    if (classId) filter.class_id = classId;
    if (teacherId) filter.teacher_id = teacherId;
    if (status) filter.status = status;

    const submissions = await ClassGradeSubmission.find(filter)
      .populate('teacher_id', 'full_name')
      .populate('approved_by', 'full_name')
      .populate('rejected_by', 'full_name')
      .sort({ submitted_at: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Gửi bản điểm để chờ duyệt
exports.submitForApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await ClassGradeSubmission.findByIdAndUpdate(
      id,
      { status: 'pending_approval', submitted_at: new Date() },
      { new: true }
    );
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Duyệt điểm
exports.approveSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved_by } = req.body;

    const updated = await ClassGradeSubmission.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        approved_by,
        approved_at: new Date(),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Submission not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Từ chối duyệt điểm
exports.rejectSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejected_by, rejection_reason } = req.body;

    const updated = await ClassGradeSubmission.findByIdAndUpdate(
      id,
      {
        status: 'rejected',
        rejected_by,
        rejected_at: new Date(),
        rejection_reason,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Submission not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa bản ghi
exports.deleteSubmission = async (req, res) => {
  try {
    const deleted = await ClassGradeSubmission.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Submission not found' });

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
