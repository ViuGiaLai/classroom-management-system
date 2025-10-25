const Student = require('../models/studentModel');
const Faculty = require('../models/facultyModel');
const Department = require('../models/departmentModel');
const Teacher = require('../models/teacherModel');

// [POST] /api/students
exports.createStudent = async (req, res) => {
  try {
    const { user_id,
      student_code,
      administrative_class,
      faculty_id,
      department_id,
      status,
      year_of_admission,
      academic_year,
      advisor_id,
    } = req.body;

    if (!user_id || !student_code) {
      return res.status(400).json({ message: 'user_id và student_code là bắt buộc' });
    }

    // Kiểm tra xem student_code có trùng không
    const existing = await Student.findOne({ student_code });
    if (existing) {
      return res.status(400).json({ message: 'student_code đã tồn tại' });
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
    });

    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find()
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

// [GET] /api/students/:id
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user_id', 'full_name email role')
      .populate('faculty_id', 'name')
      .populate('department_id', 'name')
      .populate('advisor_id', 'teacher_code position degree specialization');

    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] /api/students/:id
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [DELETE] /api/students/:id
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
