const Department = require('../models/departmentModel');
const Faculty = require('../models/facultyModel');

// Tạo mới department
exports.createDepartment = async (req, res) => {
  try {
    const { name, faculty_id } = req.body;

    const faculty = await Faculty.findById(faculty_id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    const existing = await Department.findOne({ name, faculty_id });
    if (existing) return res.status(400).json({ message: 'Department already exists in this faculty' });

    const department = await Department.create({ name, faculty_id });
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy tất cả department
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('faculty_id', 'name')
      .sort({ created_at: -1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy 1 department theo id
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('faculty_id', 'name');
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật department
exports.updateDepartment = async (req, res) => {
  try {
    const { name, faculty_id } = req.body;
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name, faculty_id },
      { new: true }
    );
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa department
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
