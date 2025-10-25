const Class = require('../models/classModel');
const Student = require('../models/studentModel');
const redisClient = require('../config/redis'); 

// [GET] /api/classes - Danh sách lớp học phần 
exports.getAllClasses = async (req, res) => {
  try {
    const cacheKey = 'classes:all';

    // Kiểm tra trong Redis trước
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Nếu không có cache, truy vấn DB
    const classes = await Class.find()
      .populate('course_id', 'title code')
      .populate('lecturer_id', 'full_name');

    // Lưu vào Redis 10 phút (600s)
    await redisClient.setEx(cacheKey, 600, JSON.stringify(classes));

    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [POST] /api/classes - Tạo lớp học phần 
exports.createClass = async (req, res) => {
  try {
    const newClass = await Class.create(req.body);

    //  Xóa cache cũ vì dữ liệu thay đổi
    await redisClient.del('classes:all');

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
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClass) return res.status(404).json({ message: 'Class not found' });

    await redisClient.del('classes:all'); 

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

    await redisClient.del('classes:all'); // Xóa cache sau khi xóa lớp

    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/classes/:id/students - Lấy sinh viên trong lớp 
exports.getStudentsInClass = async (req, res) => {
  try {
    const cacheKey = `class:${req.params.id}:students`;

    // Kiểm tra cache trước
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Nếu chưa có cache, truy vấn DB
    const students = await Student.find({ class_id: req.params.id }).select(
      'student_code full_name faculty_id department_id'
    );

    await redisClient.setEx(cacheKey, 300, JSON.stringify(students));

    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
