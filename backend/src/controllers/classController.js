const Class = require('../models/classModel');
const Student = require('../models/studentModel');
const redisClient = require('../config/redis');

// [GET] /api/classes - Danh sách lớp học phần theo tổ chức
exports.getAllClasses = async (req, res) => {
  try {
    const organization_id = req.user?.organization_id || req.body.organization_id || req.query.organization_id;

    if (!organization_id) {
      return res.status(400).json({ message: 'organization_id is required' });
    }

    const cacheKey = `classes:all:${organization_id}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const classes = await Class.find({ organization_id })
      .populate('course_id', 'title code')
      .populate('lecturer_id', 'full_name');

    await redisClient.setEx(cacheKey, 600, JSON.stringify(classes));
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [POST] /api/classes - Tạo lớp học phần thuộc tổ chức
exports.createClass = async (req, res) => {
  try {
    const organization_id = req.user?.organization_id || req.body.organization_id;

    if (!organization_id) {
      return res.status(400).json({ message: 'organization_id is required' });
    }

    const newClass = await Class.create({
      ...req.body,
      organization_id,
    });

    await redisClient.del(`classes:all:${organization_id}`);
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/classes/:id - Chi tiết lớp học phần thuộc tổ chức
exports.getClassById = async (req, res) => {
  try {
    const organization_id = req.user?.organization_id || req.query.organization_id;

    if (!organization_id) {
      return res.status(400).json({ message: 'organization_id is required' });
    }

    const classItem = await Class.findOne({
      _id: req.params.id,
      organization_id,
    })
      .populate('course_id', 'title code')
      .populate('lecturer_id', 'full_name');

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found in your organization' });
    }

    res.status(200).json(classItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] /api/classes/:id - Cập nhật lớp học phần thuộc tổ chức
exports.updateClass = async (req, res) => {
  try {
    const organization_id = req.user?.organization_id || req.body.organization_id;

    if (!organization_id) {
      return res.status(400).json({ message: 'organization_id is required' });
    }

    const updatedClass = await Class.findOneAndUpdate(
      { _id: req.params.id, organization_id },
      req.body,
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found in your organization' });
    }

    await redisClient.del(`classes:all:${organization_id}`);
    res.status(200).json(updatedClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [DELETE] /api/classes/:id - Xóa lớp học phần thuộc tổ chức
exports.deleteClass = async (req, res) => {
  try {
    const organization_id = req.user?.organization_id || req.query.organization_id;

    if (!organization_id) {
      return res.status(400).json({ message: 'organization_id is required' });
    }

    const deleted = await Class.findOneAndDelete({
      _id: req.params.id,
      organization_id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Class not found in your organization' });
    }

    await redisClient.del(`classes:all:${organization_id}`);
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/classes/:id/students - Lấy sinh viên trong lớp thuộc tổ chức
exports.getStudentsInClass = async (req, res) => {
  try {
    const organization_id = req.user?.organization_id || req.query.organization_id;

    if (!organization_id) {
      return res.status(400).json({ message: 'organization_id is required' });
    }

    const cacheKey = `class:${req.params.id}:students:${organization_id}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const students = await Student.find({
      class_id: req.params.id,
      organization_id,
    }).select('student_code full_name faculty_id department_id');

    await redisClient.setEx(cacheKey, 300, JSON.stringify(students));
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
