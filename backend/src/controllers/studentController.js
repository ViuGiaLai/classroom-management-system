const Student = require('../models/studentModel');
const User = require('../models/userModel');
const Faculty = require('../models/facultyModel');
const Department = require('../models/departmentModel');
const Teacher = require('../models/teacherModel');

// [POST] /api/students - Tạo học viên mới
exports.createStudent = async (req, res) => {
  try {
    const {
      user_id,
      student_code,
      administrative_class,
      faculty_id,
      department_id,
      status,
      year_of_admission,
      academic_year,
      advisor_id,
    } = req.body;

    const organization_id = req.user.organization_id;

    if (!user_id || !student_code) {
      return res.status(400).json({ message: 'user_id và student_code là bắt buộc' });
    }

    // Kiểm tra user có tồn tại và thuộc tổ chức
    const existingUser = await User.findOne({ _id: user_id, organization_id });
    if (!existingUser) {
      return res.status(400).json({ message: 'User không tồn tại hoặc không thuộc tổ chức của bạn' });
    }

    // Kiểm tra mã học viên trùng trong tổ chức
    const existing = await Student.findOne({ student_code, organization_id });
    if (existing) {
      return res.status(400).json({ message: 'student_code đã tồn tại trong tổ chức của bạn' });
    }

    // Tạo student mới
    const student = await Student.create({
      user_id,
      student_code,
      administrative_class,
      faculty_id,
      department_id,
      status,
      year_of_admission,
      academic_year,
      advisor_id,
      organization_id,
    });

    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/students - Lấy danh sách học viên theo tổ chức
exports.getStudents = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const students = await Student.find({ organization_id })
      .populate('user_id', 'full_name email role')
      .populate('faculty_id', 'name')
      .populate('department_id', 'name')
      .populate('advisor_id', 'teacher_code position degree specialization')
      .sort({ created_at: -1 });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/students/:id - Lấy thông tin học viên theo tổ chức
exports.getStudentById = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const student = await Student.findOne({ _id: req.params.id, organization_id })
      .populate('user_id', 'full_name email role')
      .populate('faculty_id', 'name')
      .populate('department_id', 'name')
      .populate('advisor_id', 'teacher_code position degree specialization');

    if (!student) return res.status(404).json({ message: 'Student not found in your organization' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] /api/students/:id - Cập nhật học viên theo tổ chức
exports.updateStudent = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, organization_id },
      req.body,
      { new: true }
    );

    if (!student) return res.status(404).json({ message: 'Student not found in your organization' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [DELETE] /api/students/:id - Xóa học viên theo tổ chức
exports.deleteStudent = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const student = await Student.findOneAndDelete({ _id: req.params.id, organization_id });
    if (!student) return res.status(404).json({ message: 'Student not found in your organization' });

    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};