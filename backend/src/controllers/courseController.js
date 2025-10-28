const Course = require('../models/courseModel');

// [POST] /api/courses - Tạo khóa học thuộc tổ chức
exports.createCourse = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const course = await Course.create({
      ...req.body,
      organization_id,
    });

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/courses - Lấy danh sách khóa học theo tổ chức
exports.getCourses = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const courses = await Course.find({ organization_id })
      .populate('department_id', 'name')
      .populate('created_by', 'email');

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/courses/:id - Lấy chi tiết khóa học theo tổ chức
exports.getCourseById = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const course = await Course.findOne({
      _id: req.params.id,
      organization_id,
    })
      .populate('department_id', 'name')
      .populate('created_by', 'email');

    if (!course) return res.status(404).json({ message: 'Course not found in your organization' });

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] /api/courses/:id - Cập nhật khóa học theo tổ chức
exports.updateCourse = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, organization_id },
      req.body,
      { new: true }
    );

    if (!course) return res.status(404).json({ message: 'Course not found in your organization' });

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [DELETE] /api/courses/:id - Xóa khóa học theo tổ chức
exports.deleteCourse = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      organization_id,
    });

    if (!course) return res.status(404).json({ message: 'Course not found in your organization' });

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

