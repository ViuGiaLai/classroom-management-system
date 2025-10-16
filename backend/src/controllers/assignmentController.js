const Assignment = require('../models/assignmentModel');

// CREATE
exports.createAssignment = async (req, res) => {
  try {
    const { class_id, title, description, due_date, max_points } = req.body;

    const newAssignment = await Assignment.create({
      class_id,
      title,
      description,
      due_date,
      max_points,
      created_by: req.user.id,
    });

    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ - Lấy tất cả bài tập của 1 lớp
exports.getAssignmentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const assignments = await Assignment.find({ class_id: classId })
      .populate('created_by', 'full_name email role')
      .sort({ due_date: 1 });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ - Lấy 1 bài tập cụ thể
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateAssignment = async (req, res) => {
  try {
    const { title, description, due_date, max_points } = req.body;

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { title, description, due_date, max_points },
      { new: true, runValidators: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteAssignment = async (req, res) => {
  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!deletedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
