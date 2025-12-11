const Class = require('../models/classModel');
const Student = require('../models/studentModel');
const Attendance = require('../models/attendanceModel');
const Teacher = require('../models/teacherModel');
const redisClient = require('../config/redis');

// Helper function to recalculate class enrollment
const recalculateClassEnrollment = async (class_id, organization_id) => {
  try {
    const uniqueStudents = await Attendance.distinct('student_id', {
      class_id,
      organization_id
    });
    
    await Class.findByIdAndUpdate(class_id, {
      current_enrollment: uniqueStudents.length
    });
    
    return uniqueStudents.length;
  } catch (error) {
    console.error('Error recalculating class enrollment:', error);
    return 0;
  }
};

// [GET] /api/classes - Danh sách lớp học phần theo tổ chức
exports.getAllClasses = async (req, res) => {
  try {
    const organization_id = req.user?.organization_id || req.body.organization_id || req.query.organization_id;

    if (!organization_id) {
      return res.status(400).json({ message: 'organization_id is required' });
    }

    const cacheKey = `classes:all:${organization_id}`;
    if (redisClient) {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }
    }

    const classes = await Class.find({ organization_id })
      .populate('course_id', 'title code')
      .populate('department_id', 'name')
      .populate({
        path: 'lecturer_id',
        populate: {
          path: 'user_id',
          select: 'full_name'
        }
      });

    if (redisClient) {
      await redisClient.setEx(cacheKey, 600, JSON.stringify(classes));
    }
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

    if (redisClient) {
      await redisClient.del(`classes:all:${organization_id}`);
    }
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
      .populate('department_id', 'name')
      .populate({
        path: 'lecturer_id',
        populate: {
          path: 'user_id',
          select: 'full_name'
        }
      });

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

    if (redisClient) {
      await redisClient.del(`classes:all:${organization_id}`);
    }
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

    if (redisClient) {
      await redisClient.del(`classes:all:${organization_id}`);
    }
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [POST] /api/classes/:id/recalculate-enrollment - Recalculate enrollment for a specific class
exports.recalculateEnrollment = async (req, res) => {
  try {
    const organization_id = req.user?.organization_id || req.body.organization_id || req.query.organization_id;
    
    if (!organization_id) {
      return res.status(400).json({ message: 'organization_id is required' });
    }

    const classItem = await Class.findOne({
      _id: req.params.id,
      organization_id,
    });

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found in your organization' });
    }

    const newEnrollment = await recalculateClassEnrollment(req.params.id, organization_id);

    res.status(200).json({
      message: 'Enrollment recalculated successfully',
      class_id: req.params.id,
      new_enrollment: newEnrollment,
      max_capacity: classItem.max_capacity
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getStudentsInClass = async (req, res) => {
  try {
    const organization_id = req.user?.organization_id || req.query.organization_id;
    const userRole = req.user?.role;
    const userId = req.user?.id;

    if (!organization_id) {
      return res.status(400).json({ message: 'organization_id is required' });
    }

    // Kiểm tra lớp học có tồn tại không
    const classItem = await Class.findOne({
      _id: req.params.id,
      organization_id
    });

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found in your organization' });
    }

    // Nếu là teacher, kiểm tra xem họ có phải là lecturer của lớp này không
    if (userRole === 'teacher') {
      // Tìm teacher từ user_id
      const teacher = await Teacher.findOne({
        user_id: userId,
        organization_id
      });

      if (!teacher) {
        return res.status(403).json({ message: 'Teacher not found' });
      }

      // Kiểm tra xem teacher có phải là lecturer của lớp này không
      if (classItem.lecturer_id.toString() !== teacher._id.toString()) {
        return res.status(403).json({ 
          message: 'Bạn không có quyền xem danh sách sinh viên của lớp học này' 
        });
      }
    }
    // Nếu là admin, cho phép xem tất cả

    const cacheKey = `class:${req.params.id}:students:${organization_id}`;
    if (redisClient) {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }
    }

    const userIds = await Attendance.distinct('student_id', {
      class_id: req.params.id,
      organization_id
    });

    const students = await Student.find({
      user_id: { $in: userIds },
      organization_id,
    })
      .populate('user_id', 'full_name email')
      .populate('faculty_id', 'name')
      .populate('department_id', 'name')
      .select('student_code user_id faculty_id department_id status')
      .sort({ student_code: 1 });

    if (redisClient) {
      await redisClient.setEx(cacheKey, 300, JSON.stringify(students));
    }
    res.status(200).json(students);
  } catch (err) {
    console.error('Error fetching students in class:', err);
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/classes/teacher/my-classes - Lấy danh sách lớp học của teacher hiện tại
exports.getMyClasses = async (req, res) => {
  try {
    const organization_id = req.user?.organization_id;
    const userId = req.user?.id;

    if (!organization_id || !userId) {
      return res.status(400).json({ message: 'Missing required information' });
    }

    // Tìm teacher từ user_id
    const teacher = await Teacher.findOne({ 
      user_id: userId,
      organization_id 
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const cacheKey = `classes:teacher:${teacher._id}:${organization_id}`;
    if (redisClient) {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }
    }

    // Lấy tất cả classes mà teacher này là lecturer
    const classes = await Class.find({
      lecturer_id: teacher._id,
      organization_id
    })
      .populate('course_id', 'title code credits')
      .populate('department_id', 'name')
      .sort({ year: -1, semester: -1, created_at: -1 });

    const result = {
      success: true,
      count: classes.length,
      data: classes
    };

    if (redisClient) {
      await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
    }

    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching teacher classes:', err);
    res.status(500).json({ message: err.message });
  }
};