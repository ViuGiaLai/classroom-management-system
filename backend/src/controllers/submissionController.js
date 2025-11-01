const Submission = require('../models/submissionModel');
const { supabase } = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// [POST] Upload file bài nộp
exports.createSubmission = async (req, res) => {
  try {
    const { assignment_id } = req.body;
    const file = req.file;
    const organization_id = req.user.organization_id;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    if (!assignment_id) return res.status(400).json({ message: 'Missing assignment_id' });

    // Tạo tên file và upload trực tiếp từ buffer
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    
    // Upload trực tiếp từ buffer lên Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('submissions')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Lấy URL công khai
    const { data: { publicUrl } } = supabase.storage
      .from('submissions')
      .getPublicUrl(fileName);

    const fileURL = publicUrl;

    // Lưu thông tin vào MongoDB
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
    console.error('Upload error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// [GET] Lấy danh sách bài nộp
exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const organization_id = req.user.organization_id;

    const submissions = await Submission.find({
      assignment_id: assignmentId,
      organization_id,
    })
      .populate('student_id', 'full_name email')  //Thay student_id (ObjectId) thành full_name và email
      .sort({ submitted_at: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [PATCH] Cập nhật điểm & nhận xét
exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, feedback } = req.body;
    const organization_id = req.user.organization_id;

  // Submission.findOneAndUpdate() là câu lệnh tìm và cập nhật một bài nộp.
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

    if (!updated) return res.status(404).json({ message: 'Submission not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [DELETE] Xóa bài nộp (và file trên Supabase)
exports.deleteSubmission = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const deleted = await Submission.findOneAndDelete({
      _id: req.params.id,
      organization_id,
    });

    if (!deleted) return res.status(404).json({ message: 'Submission not found' });

    // Xóa file khỏi Supabase Storage
    const filePath = deleted.file_url.split('/').pop(); // lấy tên file từ URL
    const { error: deleteError } = await supabase.storage
      .from('submissions')
      .remove([filePath]);

    if (deleteError) console.error('Error deleting file from Supabase:', deleteError.message);

    res.status(200).json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
