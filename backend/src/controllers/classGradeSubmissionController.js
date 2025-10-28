const ClassGradeSubmission = require('../models/classGradeSubmissionModel');

// Tạo bản nộp điểm — thuộc tổ chức
exports.createSubmission = async (req, res) => {
  try {
    const { class_id, teacher_id, grades } = req.body;
    const organization_id = req.user.organization_id;

    if (!grades || Object.keys(grades).length === 0) {
      return res.status(400).json({ message: 'Grades cannot be empty' });
    }

    const submission = await ClassGradeSubmission.create({
      class_id,
      teacher_id,
      grades,
      status: 'draft',
      organization_id,
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách bản nộp điểm — lọc theo tổ chức + lớp + giảng viên + trạng thái
exports.getSubmissions = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;
    const filter = { organization_id };

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

// Gửi bản điểm để chờ duyệt — kiểm tra tổ chức
exports.submitForApproval = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const submission = await ClassGradeSubmission.findOneAndUpdate(
      { _id: req.params.id, organization_id },
      { status: 'pending_approval', submitted_at: new Date() },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found in your organization' });
    }

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Duyệt điểm — kiểm tra tổ chức
exports.approveSubmission = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;
    const { approved_by } = req.body;

    const updated = await ClassGradeSubmission.findOneAndUpdate(
      { _id: req.params.id, organization_id },
      {
        status: 'approved',
        approved_by,
        approved_at: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Submission not found in your organization' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Từ chối duyệt điểm — kiểm tra tổ chức
exports.rejectSubmission = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;
    const { rejected_by, rejection_reason } = req.body;

    const updated = await ClassGradeSubmission.findOneAndUpdate(
      { _id: req.params.id, organization_id },
      {
        status: 'rejected',
        rejected_by,
        rejected_at: new Date(),
        rejection_reason,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Submission not found in your organization' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa bản ghi — kiểm tra tổ chức
exports.deleteSubmission = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const deleted = await ClassGradeSubmission.findOneAndDelete({
      _id: req.params.id,
      organization_id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Submission not found in your organization' });
    }

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};