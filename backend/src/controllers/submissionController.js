const Submission = require('../models/submissionModel');
const { storage } = require('../config/firebase');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

// Sinh file name ngẫu nhiên tránh trùng
const randomName = (original) =>
  `${Date.now()}-${Math.floor(Math.random() * 10000)}-${original}`;

exports.createSubmission = async (req, res) => {
  try {
    const { assignment_id } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    // upload lên Firebase Storage
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
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách bài nộp theo assignment
exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await Submission.find({ assignment_id: assignmentId })
      .populate('student_id', 'full_name email')
      .sort({ submitted_at: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật điểm và feedback (giáo viên chấm)
exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, feedback } = req.body;

    const updated = await Submission.findByIdAndUpdate(
      id,
      {
        score,
        feedback,
        status: 'graded',
        graded_at: new Date(),
        graded_by: req.user.id,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Submission not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Xóa bài nộp
exports.deleteSubmission = async (req, res) => {
  try {
    const deleted = await Submission.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Submission not found' });
    res.status(200).json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
