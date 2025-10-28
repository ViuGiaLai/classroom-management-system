const Faculty = require('../models/facultyModel');

// [POST] /api/faculties — Tạo khoa thuộc tổ chức
exports.createFaculty = async (req, res) => {
  try {
    const { name, code } = req.body;
    const organization_id = req.user.organization_id;

    if (!organization_id) {
      return res.status(401).json({ message: 'Unauthorized: organization_id missing from user context' });
    }

    if (!name || !code) {
      return res.status(400).json({ message: 'Name and code are required' });
    }

    // Kiểm tra trùng trong cùng một tổ chức
    const existing = await Faculty.findOne({ 
      $or: [{ name }, { code }], 
      organization_id 
    });

    if (existing) {
      return res.status(400).json({ message: 'Faculty with the same name or code already exists in your organization' });
    }

    const faculty = await Faculty.create({ name, code, organization_id });
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
    const faculty = await Faculty.findOne({ _id: req.params.id, organization_id });

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found in your organization' });
    }

    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] /api/faculties/:id — Cập nhật khoa thuộc tổ chức
exports.updateFaculty = async (req, res) => {
  try {
    const { name, code } = req.body;
    const organization_id = req.user.organization_id;

    const updateData = {};
    if (name) updateData.name = name;
    if (code) updateData.code = code;

    const faculty = await Faculty.findOneAndUpdate(
      { _id: req.params.id, organization_id },
      updateData,
      { new: true }
    );

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found in your organization' });
    }

    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [DELETE] /api/faculties/:id — Xóa khoa thuộc tổ chức
exports.deleteFaculty = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;
    const faculty = await Faculty.findOneAndDelete({ _id: req.params.id, organization_id });

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found in your organization' });
    }

    res.json({ message: 'Faculty deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
