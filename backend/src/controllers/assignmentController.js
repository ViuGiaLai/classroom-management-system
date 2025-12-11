const Assignment = require('../models/assignmentModel');

// CREATE - Tạo bài tập mới
exports.createAssignment = async (req, res) => {
  try {
    const {
      class_id,
      title,
      description,
      due_date,
      max_points,
      type = 'essay',
      questions = []
    } = req.body;

    const newAssignment = await Assignment.create({
      class_id,
      title,
      description,
      due_date,
      max_points,
      type,
      questions,
      created_by: req.user.id,
      organization_id: req.user.organization_id,
    });

    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// READ - Lấy tất cả bài tập của 1 lớp
exports.getAssignmentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const assignments = await Assignment.find({
      class_id: classId,
      organization_id: req.user.organization_id,
    })
      .populate('created_by', 'full_name email role')
      .populate('class_id', 'name')
      .sort({ due_date: 1 });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi tải danh sách bài tập',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// READ - Lấy 1 bài tập cụ thể
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      organization_id: req.user.organization_id,
    })
      .populate('created_by', 'full_name email role')
      .populate('class_id', 'name students');

    if (!assignment) {
      return res.status(404).json({
        message: 'Không tìm thấy bài tập trong tổ chức của bạn'
      });
    }

    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi tải thông tin bài tập',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// UPDATE - Cập nhật bài tập
exports.updateAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      due_date,
      max_points,
      type,
      questions
    } = req.body;

    const updateData = {
      title,
      description,
      due_date,
      max_points,
      type,
      questions,
      updated_at: Date.now()
    };

    const updatedAssignment = await Assignment.findOneAndUpdate(
      {
        _id: req.params.id,
        organization_id: req.user.organization_id
      },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('class_id', 'name');

    if (!updatedAssignment) {
      return res.status(404).json({
        message: 'Không tìm thấy bài tập trong tổ chức của bạn'
      });
    }

    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi cập nhật bài tập',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// DELETE - Xóa bài tập
exports.deleteAssignment = async (req, res) => {
  try {
    const deletedAssignment = await Assignment.findOneAndDelete({
      _id: req.params.id,
      organization_id: req.user.organization_id,
    });

    if (!deletedAssignment) {
      return res.status(404).json({
        message: 'Không tìm thấy bài tập trong tổ chức của bạn'
      });
    }

    // TODO: Xóa tất cả bài nộp liên quan
    // await Submission.deleteMany({ assignment_id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Đã xóa bài tập thành công'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi xóa bài tập',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Lấy danh sách bài tập của giáo viên
exports.getTeacherAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      created_by: req.user.id,
      organization_id: req.user.organization_id,
    })
      .populate('class_id', 'name')
      .sort({ created_at: -1 });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi tải danh sách bài tập',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};