const Submission = require('../models/submissionModel');
const { storage } = require('../config/firebase');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

// Sinh file name ngẫu nhiên tránh trùng
const randomName = (original) =>
  `${Date.now()}-${Math.floor(Math.random() * 10000)}-${original}`;

// [POST] Tạo bài nộp — thuộc tổ chức
exports.createSubmission = async (req, res) => {
  try {
    const { assignment_id } = req.body;
    const file = req.file;
    const organization_id = req.user.organization_id;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    if (!assignment_id) return res.status(400).json({ message: 'Missing assignment_id' });

    // Upload lên Firebase Storage
    const fileName = randomName(file.originalname);
    const storageRef = ref(storage, `submissions/${fileName}`);
    await uploadBytes(storageRef, file.buffer);
    const fileURL = await getDownloadURL(storageRef);

    const submission = await Submission.create({
      assignment_id,
      student_id: req.user.id,
      file_name: file.originalname,
      file_url: fileURL,
      file_size: file.size,
      status: 'pending',
      organization_id,
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] Lấy danh sách bài nộp theo assignment — thuộc tổ chức
exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const organization_id = req.user.organization_id;

    const submissions = await Submission.find({
      assignment_id: assignmentId,
      organization_id,
    })
      .populate('student_id', 'full_name email')
      .sort({ submitted_at: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [PATCH] Cập nhật điểm và feedback — thuộc tổ chức
exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, feedback } = req.body;
    const organization_id = req.user.organization_id;

    const updated = await Submission.findOneAndUpdate(
      { _id: id, organization_id },
      {
        score,
        feedback,
        status: 'graded',
        graded_at: new Date(),
        graded_by: req.user.id,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Submission not found in your organization' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [DELETE] Xóa bài nộp — thuộc tổ chức
exports.deleteSubmission = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const deleted = await Submission.findOneAndDelete({
      _id: req.params.id,
      organization_id,
    });

    if (!deleted) return res.status(404).json({ message: 'Submission not found in your organization' });
    res.status(200).json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

