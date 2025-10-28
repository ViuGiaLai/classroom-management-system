const Department = require('../models/departmentModel');
const Faculty = require('../models/facultyModel');

// [POST] Tạo mới department thuộc tổ chức
exports.createDepartment = async (req, res) => {
  try {
    const { name, faculty_id } = req.body;
    const organization_id = req.user.organization_id;

    const faculty = await Faculty.findOne({ _id: faculty_id, organization_id });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found in your organization' });

    const existing = await Department.findOne({ name, faculty_id, organization_id });
    if (existing) return res.status(400).json({ message: 'Department already exists in this faculty' });

    const department = await Department.create({ name, faculty_id, organization_id });
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] Lấy tất cả department thuộc tổ chức
exports.getDepartments = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const departments = await Department.find({ organization_id })
      .populate('faculty_id', 'name')
      .sort({ created_at: -1 });

    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] Lấy 1 department theo id thuộc tổ chức
exports.getDepartmentById = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const department = await Department.findOne({
      _id: req.params.id,
      organization_id,
    }).populate('faculty_id', 'name');

    if (!department) return res.status(404).json({ message: 'Department not found in your organization' });

    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] Cập nhật department thuộc tổ chức
exports.updateDepartment = async (req, res) => {
  try {
    const { name, faculty_id } = req.body;
    const organization_id = req.user.organization_id;

    const department = await Department.findOneAndUpdate(
      { _id: req.params.id, organization_id },
      { name, faculty_id },
      { new: true }
    );

    if (!department) return res.status(404).json({ message: 'Department not found in your organization' });

    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [DELETE] Xóa department thuộc tổ chức
exports.deleteDepartment = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const department = await Department.findOneAndDelete({
      _id: req.params.id,
      organization_id,
    });

    if (!department) return res.status(404).json({ message: 'Department not found in your organization' });

    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

