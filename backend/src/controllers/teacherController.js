const Teacher = require('../models/teacherModel');
const User = require('../models/userModel');

// [POST] /api/teachers - Tạo giảng viên mới
exports.createTeacher = async (req, res) => {
  try {
    const { user_id, teacher_code, faculty_id, department_id, position, degree, specialization } = req.body;

    // Kiểm tra user_id có tồn tại
    const existingUser = await User.findById(user_id);
    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid user_id: User not found' });
    }

    // Kiểm tra mã giảng viên trùng
    const existingTeacher = await Teacher.findOne({ teacher_code });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Teacher code already exists' });
    }

    const teacher = await Teacher.create({
      user_id, teacher_code, faculty_id, department_id, position, degree, specialization,
    });

    res.status(201).json({
      message: 'Teacher created successfully',
      teacher,
    });
  } catch (err) {
    console.error('Error creating teacher:', err.message);
    res.status(500).json({ message: 'Server error while creating teacher' });
  }
};

// [GET] /api/teachers - Lấy danh sách giảng viên
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate('user_id', 'full_name email role')
      .populate('faculty_id', 'name')
      .populate('department_id', 'name')
      .sort({ created_at: -1 });

    res.status(200).json(teachers);
  } catch (err) {
    console.error('Error fetching teachers:', err.message);
    res.status(500).json({ message: 'Failed to fetch teachers' });
  }
};

// [GET] /api/teachers/:id - Lấy thông tin một giảng viên
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('user_id', 'full_name email role')
      .populate('faculty_id', 'name')
      .populate('department_id', 'name');

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    res.status(200).json(teacher);
  } catch (err) {
    console.error('Error fetching teacher:', err.message);
    res.status(500).json({ message: 'Failed to fetch teacher' });
  }
};

// [PUT] /api/teachers/:id - Cập nhật thông tin giảng viên
exports.updateTeacher = async (req, res) => {
  try {
    const {
      teacher_code,
      faculty_id,
      department_id,
      position,
      degree,
      specialization,
    } = req.body;

    // Nếu có cập nhật teacher_code, cần kiểm tra trùng
    if (teacher_code) {
      const existingTeacher = await Teacher.findOne({
        teacher_code,
        _id: { $ne: req.params.id },
      });
      if (existingTeacher) {
        return res.status(400).json({ message: 'Teacher code already exists' });
      }
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      {
        teacher_code,
        faculty_id,
        department_id,
        position,
        degree,
        specialization,
      },
      { new: true, runValidators: true }
    );

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    res.status(200).json({
      message: 'Teacher updated successfully',
      teacher,
    });
  } catch (err) {
    console.error('Error updating teacher:', err.message);
    res.status(500).json({ message: 'Failed to update teacher' });
  }
};

// [DELETE] /api/teachers/:id - Xóa giảng viên
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    console.error('Error deleting teacher:', err.message);
    res.status(500).json({ message: 'Failed to delete teacher' });
  }
};
