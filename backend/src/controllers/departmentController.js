const Department = require('../models/departmentModel');
const Faculty = require('../models/facultyModel');
const mongoose = require('mongoose');
let Student;

try {
  Student = require('../models/studentModel');
} catch (err) {
  console.error('Error importing Student model:', err);
  Student = null;
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

