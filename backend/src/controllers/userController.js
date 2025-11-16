const User = require('../models/userModel');
const Organization = require('../models/organizationModel');
const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');
const bcrypt = require('bcrypt');

// [POST] /api/users - Tạo người dùng mới (chỉ trong tổ chức của admin)
exports.createUser = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      role,
      gender,
      date_of_birth,
      phone,
      address,
      avatar_url,
    } = req.body;

    // Tự động sử dụng organization_id của admin đang đăng nhập
    const organization_id = req.user.organization_id;

    // Kiểm tra email trùng
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
      role: role || 'student',
      gender,
      date_of_birth,
      phone,
      address,
      avatar_url,
      organization_id,
    });

    // Tự động tạo bản ghi tương ứng trong Student hoặc Teacher collection
    if (user.role === 'student') {
      try {
        // Tạo mã học sinh tự động từ email hoặc timestamp
        const student_code = email.split('@')[0].toUpperCase() + Date.now().toString().slice(-6);

        await Student.create({
          user_id: user._id,
          student_code,
          organization_id,
          status: 'active',
          year_of_admission: new Date().getFullYear(),
          academic_year: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
        });
        console.log(`Student record created for user ${user._id}`);
      } catch (studentErr) {
        console.error('Error creating student record:', studentErr.message);
        // Không rollback user creation, chỉ log lỗi
      }
    } else if (user.role === 'teacher') {
      try {
        // Tạo mã giảng viên tự động từ email hoặc timestamp
        const teacher_code = 'TC' + email.split('@')[0].toUpperCase() + Date.now().toString().slice(-4);

        await Teacher.create({
          user_id: user._id,
          teacher_code,
          organization_id,
          position: 'Giảng viên',
        });
        console.log(`Teacher record created for user ${user._id}`);
      } catch (teacherErr) {
        console.error('Error creating teacher record:', teacherErr.message);
        // Không rollback user creation, chỉ log lỗi
      }
    }

    res.status(201).json({
      message: 'User created successfully',
      user: { ...user.toObject(), password_hash: undefined },
    });
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ message: 'Server error while creating user' });
  }
};

// [GET] /api/users - Lấy danh sách tất cả người dùng (chỉ theo tổ chức của admin)
exports.getAllUsers = async (req, res) => {
  try {
    // Chỉ lấy người dùng thuộc tổ chức của admin đang đăng nhập
    const filter = { organization_id: req.user.organization_id };

    const users = await User.find(filter)
      .select('-password_hash')
      .populate('organization_id');

    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// [PUT] /api/users/:id - Cập nhật thông tin người dùng (chỉ trong tổ chức của admin)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      full_name,
      password,
      gender,
      date_of_birth,
      phone,
      address,
      avatar_url,
      role,
      is_active,
      organization_id,
    } = req.body;

    // Chỉ cập nhật người dùng thuộc tổ chức của admin đang đăng nhập
    const user = await User.findOne({
      _id: id,
      organization_id: req.user.organization_id
    });

    if (!user) return res.status(404).json({ message: 'User not found in your organization' });

    // Nếu có tổ chức mới, kiểm tra hợp lệ
    if (organization_id && organization_id !== user.organization_id.toString()) {
      const organization = await Organization.findById(organization_id);
      if (!organization) {
        return res.status(400).json({ message: 'Invalid organization ID' });
      }
      user.organization_id = organization_id;
    }

    if (full_name) user.full_name = full_name;
    if (password) user.password_hash = await bcrypt.hash(password, 10);
    if (gender) user.gender = gender;
    if (date_of_birth) user.date_of_birth = date_of_birth;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (avatar_url) user.avatar_url = avatar_url;
    if (role) {
      const oldRole = user.role;
      user.role = role;

      // Xử lý chuyển đổi role giữa student/teacher
      if (oldRole !== role) {
        try {
          // Nếu chuyển từ student/teacher sang role khác, xóa bản ghi tương ứng
          if (oldRole === 'student') {
            await Student.findOneAndDelete({ user_id: user._id, organization_id: req.user.organization_id });
            console.log(`Student record deleted for user ${user._id}`);
          } else if (oldRole === 'teacher') {
            await Teacher.findOneAndDelete({ user_id: user._id, organization_id: req.user.organization_id });
            console.log(`Teacher record deleted for user ${user._id}`);
          }

          // Nếu chuyển sang student/teacher, tạo bản ghi mới
          if (role === 'student') {
            const student_code = user.email.split('@')[0].toUpperCase() + Date.now().toString().slice(-6);
            await Student.create({
              user_id: user._id,
              student_code,
              organization_id: req.user.organization_id,
              status: 'active',
              year_of_admission: new Date().getFullYear(),
              academic_year: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
            });
            console.log(`Student record created for user ${user._id}`);
          } else if (role === 'teacher') {
            const teacher_code = 'TC' + user.email.split('@')[0].toUpperCase() + Date.now().toString().slice(-4);
            await Teacher.create({
              user_id: user._id,
              teacher_code,
              organization_id: req.user.organization_id,
              position: 'Giảng viên',
            });
            console.log(`Teacher record created for user ${user._id}`);
          }
        } catch (syncErr) {
          console.error('Error syncing role change:', syncErr.message);
        }
      }
    }
    if (typeof is_active === 'boolean') user.is_active = is_active;

    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: { ...user.toObject(), password_hash: undefined },
    });
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// [DELETE] /api/users/:id - Xóa người dùng (chỉ trong tổ chức của admin)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin user trước khi xóa để xử lý xóa bản ghi tương ứng
    const userToDelete = await User.findOne({
      _id: id,
      organization_id: req.user.organization_id
    });

    if (!userToDelete) return res.status(404).json({ message: 'User not found in your organization' });

    // Xóa bản ghi tương ứng trong Student/Teacher collections
    try {
      if (userToDelete.role === 'student') {
        await Student.findOneAndDelete({ user_id: userToDelete._id, organization_id: req.user.organization_id });
        console.log(`Student record deleted for user ${userToDelete._id}`);
      } else if (userToDelete.role === 'teacher') {
        await Teacher.findOneAndDelete({ user_id: userToDelete._id, organization_id: req.user.organization_id });
        console.log(`Teacher record deleted for user ${userToDelete._id}`);
      }
    } catch (syncErr) {
      console.error('Error deleting related records:', syncErr.message);
    }

    // Xóa user
    await User.findOneAndDelete({
      _id: id,
      organization_id: req.user.organization_id
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};