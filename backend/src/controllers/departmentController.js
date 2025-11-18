const Department = require('../models/departmentModel');
const Faculty = require('../models/facultyModel');
const Class = require('../models/classModel');
const mongoose = require('mongoose');
let Student;
let Attendance;

try {
  Student = require('../models/studentModel');
} catch (err) {
  console.error('Error importing Student model:', err);
  Student = null;
}

try {
  Attendance = require('../models/attendanceModel');
} catch (err) {
  console.error('Error importing Attendance model:', err);
  Attendance = null;
}

// [POST] Tạo mới department thuộc tổ chức
exports.createDepartment = async (req, res) => {
  try {
    const { name, faculty_id } = req.body;
    const organization_id = req.user.organization_id;

    console.log('Creating department:', { name, faculty_id, organization_id });
    console.log('Request body:', req.body);
    console.log('User from token:', req.user);

    if (!name || !faculty_id) {
      console.log('Missing required fields:', { name: !!name, faculty_id: !!faculty_id });
      return res.status(400).json({ message: 'Name and faculty_id are required' });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(faculty_id)) {
      console.log('Invalid faculty_id format:', faculty_id);
      return res.status(400).json({ message: 'Invalid faculty_id format' });
    }

    const faculty = await Faculty.findOne({ _id: faculty_id, organization_id });
    if (!faculty) {
      console.log('Faculty not found:', { faculty_id, organization_id });
      return res.status(404).json({ message: 'Faculty not found in your organization' });
    }

    const existing = await Department.findOne({ name, faculty_id, organization_id });
    if (existing) {
      console.log('Department already exists:', { name, faculty_id, organization_id });
      return res.status(400).json({ message: 'Department already exists in this faculty' });
    }

    const department = await Department.create({ name, faculty_id, organization_id });
    console.log('Department created successfully:', department);
    
    res.status(201).json(department);
  } catch (err) {
    console.error('Error in createDepartment:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ message: err.message });
  }
};

// [GET] Lấy tất cả department thuộc tổ chức
exports.getDepartments = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const departments = await Department.find({ organization_id })
      .populate('faculty_id', 'name')
      .lean()
      .sort({ created_at: -1 });

    const departmentsWithStudentCount = [];
    for (const dept of departments) {
      let studentCount = 0;
      
      if (Student) {
        try {
          studentCount = await Student.countDocuments({
            department_id: dept._id,
            organization_id
          });
        } catch (err) {
          console.error('Error counting students for department:', dept._id, err);
          studentCount = 0;
        }
      }
      
      departmentsWithStudentCount.push({
        ...dept,
        student_count: studentCount
      });
    }

    res.json(departmentsWithStudentCount);
  } catch (err) {
    console.error('Error in getDepartments:', err);
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

// [PUT] Cập nhật thông tin department thuộc tổ chức
exports.updateDepartment = async (req, res) => {
  try {
    const { name, faculty_id } = req.body;
    const departmentId = req.params.id;
    const organization_id = req.user.organization_id;

    console.log('Updating department:', { departmentId, name, faculty_id, organization_id });
    console.log('Request body:', req.body);
    console.log('User from token:', req.user);

    if (!name || !faculty_id) {
      console.log('Missing required fields:', { name: !!name, faculty_id: !!faculty_id });
      return res.status(400).json({ message: 'Name and faculty_id are required' });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(faculty_id)) {
      console.log('Invalid faculty_id format:', faculty_id);
      return res.status(400).json({ message: 'Invalid faculty_id format' });
    }

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      console.log('Invalid departmentId format:', departmentId);
      return res.status(400).json({ message: 'Invalid department ID format' });
    }

    // Verify faculty exists and belongs to organization
    const faculty = await Faculty.findOne({ _id: faculty_id, organization_id });
    if (!faculty) {
      console.log('Faculty not found:', { faculty_id, organization_id });
      return res.status(404).json({ message: 'Faculty not found in your organization' });
    }

    // Check for duplicate department name in the same faculty (excluding current department)
    const existing = await Department.findOne({ 
      name, 
      faculty_id, 
      organization_id,
      _id: { $ne: departmentId }
    });
    if (existing) {
      console.log('Department name already exists in faculty:', { name, faculty_id, organization_id });
      return res.status(400).json({ message: 'Department name already exists in this faculty' });
    }

    const department = await Department.findOneAndUpdate(
      { _id: departmentId, organization_id },
      { name, faculty_id },
      { new: true }
    );

    if (!department) {
      console.log('Department not found:', { departmentId, organization_id });
      return res.status(404).json({ message: 'Department not found in your organization' });
    }

    console.log('Department updated successfully:', department);
    res.json(department);
  } catch (err) {
    console.error('Error in updateDepartment:', err);
    console.error('Error stack:', err.stack);
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

// [GET] /api/departments/:id/classes - Get classes assigned to a department
exports.getDepartmentClasses = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;
    const departmentId = req.params.id;

    // Verify department exists and belongs to organization
    const department = await Department.findOne({
      _id: departmentId,
      organization_id,
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found in your organization' });
    }

    const classes = await Class.find({
      department_id: departmentId,
      organization_id,
    })
      .populate('course_id', 'title code')
      .populate({
        path: 'lecturer_id',
        populate: {
          path: 'user_id',
          select: 'full_name'
        }
      })
      .sort({ created_at: -1 });

    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [POST] /api/departments/:id/classes - Assign a class to a department
exports.assignClassToDepartment = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;
    const departmentId = req.params.id;
    const { class_id } = req.body;

    if (!class_id) {
      return res.status(400).json({ message: 'Class ID is required' });
    }

    // Verify department exists and belongs to organization
    const department = await Department.findOne({
      _id: departmentId,
      organization_id,
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found in your organization' });
    }

    // Verify class exists and belongs to organization
    const classItem = await Class.findOne({
      _id: class_id,
      organization_id,
    });

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found in your organization' });
    }

    // Get all students in this department
    const departmentStudents = await Student.find({
      department_id: departmentId,
      organization_id
    });

    // Create attendance records for all students in the department
    if (Attendance && departmentStudents.length > 0) {
      const attendanceRecords = departmentStudents.map(student => ({
        class_id,
        student_id: student._id,
        date: new Date().toISOString().split('T')[0], // Today's date
        status: 'present', // Default status
        organization_id
      }));

      try {
        // Bulk insert attendance records
        await Attendance.insertMany(attendanceRecords, { ordered: false });
        console.log(`Created ${attendanceRecords.length} attendance records for class ${class_id}`);
      } catch (attendanceError) {
        console.error('Error creating attendance records:', attendanceError);
        // Continue with class assignment even if attendance creation fails
      }
    }

    // Count unique students assigned to this class via attendance records
    let currentEnrollment = 0;
    if (Attendance) {
      try {
        currentEnrollment = await Attendance.distinct('student_id', {
          class_id: class_id,
          organization_id
        }).then(students => students.length);
      } catch (err) {
        console.error('Error counting students in class:', class_id, err);
        currentEnrollment = 0;
      }
    }

    // Update class to assign it to department and update enrollment count
    const updatedClass = await Class.findByIdAndUpdate(
      class_id,
      { 
        department_id: departmentId,
        current_enrollment: currentEnrollment
      },
      { new: true }
    )
      .populate('course_id', 'title code')
      .populate('department_id', 'name')
      .populate({
        path: 'lecturer_id',
        populate: {
          path: 'user_id',
          select: 'full_name'
        }
      });

    res.status(200).json({
      message: 'Class assigned to department successfully',
      class: updatedClass,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [DELETE] /api/departments/:id/classes/:classId - Remove a class from a department
exports.removeClassFromDepartment = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;
    const departmentId = req.params.id;
    const classId = req.params.classId;

    // Verify department exists and belongs to organization
    const department = await Department.findOne({
      _id: departmentId,
      organization_id,
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found in your organization' });
    }

    // Verify class exists, belongs to organization, and is assigned to this department
    const classItem = await Class.findOne({
      _id: classId,
      organization_id,
      department_id: departmentId,
    });

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found or not assigned to this department' });
    }

    // Get all students in this department
    const departmentStudents = await Student.find({
      department_id: departmentId,
      organization_id
    });

    // Remove attendance records for all students in this department
    if (Attendance && departmentStudents.length > 0) {
      const studentIds = departmentStudents.map(student => student._id);
      try {
        const deleteResult = await Attendance.deleteMany({
          class_id: classId,
          student_id: { $in: studentIds },
          organization_id
        });
        console.log(`Removed ${deleteResult.deletedCount} attendance records for class ${classId} from department ${departmentId}`);
      } catch (attendanceError) {
        console.error('Error removing attendance records:', attendanceError);
        // Continue with class removal even if attendance deletion fails
      }
    }

    // Update class to remove department assignment
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { department_id: null },
      { new: true }
    )
      .populate('course_id', 'title code')
      .populate({
        path: 'lecturer_id',
        populate: {
          path: 'user_id',
          select: 'full_name'
        }
      });

    // Update enrollment count for the class
    if (Attendance) {
      try {
        const remainingStudents = await Attendance.distinct('student_id', {
          class_id: classId,
          organization_id
        });
        
        await Class.findByIdAndUpdate(classId, {
          current_enrollment: remainingStudents.length
        });
      } catch (err) {
        console.error('Error updating enrollment count after department removal:', err);
      }
    }

    res.status(200).json({
      message: 'Class removed from department successfully',
      class: updatedClass,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

