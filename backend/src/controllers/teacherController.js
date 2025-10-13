const Teacher = require('../models/teacherModel');

// [POST] /api/teachers
exports.createTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate('user_id', 'email role')
      .populate('faculty_id', 'name')
      .populate('department_id', 'name');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/teachers/:id
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('user_id', 'email role')
      .populate('faculty_id', 'name')
      .populate('department_id', 'name');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] /api/teachers/:id
exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [DELETE] /api/teachers/:id
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
