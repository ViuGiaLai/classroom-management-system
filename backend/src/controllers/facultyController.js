const Faculty = require('../models/facultyModel');

// [POST] /api/faculties — Tạo khoa thuộc tổ chức
exports.createFaculty = async (req, res) => {
  try {
    const { name } = req.body;
    const organization_id = req.user.organization_id;

    const existing = await Faculty.findOne({ name, organization_id });
    if (existing) return res.status(400).json({ message: 'Faculty already exists in your organization' });

    const faculty = await Faculty.create({ name, organization_id });
    res.status(201).json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/faculties — Lấy danh sách khoa thuộc tổ chức
exports.getFaculties = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const faculties = await Faculty.find({ organization_id }).sort({ created_at: -1 });
    res.json(faculties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/faculties/:id — Lấy chi tiết khoa thuộc tổ chức
exports.getFacultyById = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const faculty = await Faculty.findOne({
      _id: req.params.id,
      organization_id,
    });

    if (!faculty) return res.status(404).json({ message: 'Faculty not found in your organization' });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] /api/faculties/:id — Cập nhật khoa thuộc tổ chức
exports.updateFaculty = async (req, res) => {
  try {
    const { name } = req.body;
    const organization_id = req.user.organization_id;

    const faculty = await Faculty.findOneAndUpdate(
      { _id: req.params.id, organization_id },
      { name },
      { new: true }
    );

    if (!faculty) return res.status(404).json({ message: 'Faculty not found in your organization' });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [DELETE] /api/faculties/:id — Xóa khoa thuộc tổ chức
exports.deleteFaculty = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const faculty = await Faculty.findOneAndDelete({
      _id: req.params.id,
      organization_id,
    });

    if (!faculty) return res.status(404).json({ message: 'Faculty not found in your organization' });
    res.json({ message: 'Faculty deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

