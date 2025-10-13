const Student = require('../models/studentModel');

// [POST] /api/students
exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user_id', 'email role')
      .populate('faculty_id', 'name')
      .populate('department_id', 'name')
      .populate('advisor_id', 'name');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/students/:id
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user_id', 'email role')
      .populate('faculty_id', 'name')
      .populate('department_id', 'name')
      .populate('advisor_id', 'name');
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
