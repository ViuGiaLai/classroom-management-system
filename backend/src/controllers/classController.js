const Class = require('../models/classModel');
const Student = require('../models/studentModel'); // dùng để lấy danh sách sinh viên trong lớp

// [GET] /api/classes - Danh sách lớp học phần
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('course_id', 'title code')
      .populate('lecturer_id', 'full_name');
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [POST] /api/classes - Tạo lớp học phần
exports.createClass = async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/classes/:id - Chi tiết lớp học phần
exports.getClassById = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id)
      .populate('course_id', 'title code')
      .populate('lecturer_id', 'full_name');
    if (!classItem) return res.status(404).json({ message: 'Class not found' });
    res.status(200).json(classItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] /api/classes/:id - Cập nhật lớp học phần
exports.updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedClass) return res.status(404).json({ message: 'Class not found' });
    res.status(200).json(updatedClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [DELETE] /api/classes/:id - Xóa lớp học phần
exports.deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Class not found' });
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/classes/:id/students - Lấy sinh viên trong lớp
exports.getStudentsInClass = async (req, res) => {
  try {
    const students = await Student.find({ class_id: req.params.id }).select(
      'student_code full_name faculty_id department_id'
    );
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
