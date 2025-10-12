const Faculty = require('../models/facultyModel');

// [POST] /api/faculties
exports.createFaculty = async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Faculty.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Faculty already exists' });

    const faculty = await Faculty.create({ name });
    res.status(201).json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/faculties
exports.getFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find().sort({ created_at: -1 });
    res.json(faculties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/faculties/:id
exports.getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] /api/faculties/:id
exports.updateFaculty = async (req, res) => {
  try {
    const { name } = req.body;
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [DELETE] /api/faculties/:id
exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json({ message: 'Faculty deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
