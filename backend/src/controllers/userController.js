const User = require('../models/userModel');
const Organization = require('../models/organizationModel');
const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');
const bcrypt = require('bcrypt');

// [POST] /api/users - Tạo người dùng mới (bao gồm student full info)
exports.createUser = async (req, res) => {
  const session = await User.startSession(); // Dùng transaction nếu MongoDB hỗ trợ
  session.startTransaction();

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

      // Thông tin student nếu role = student
      administrative_class,
      faculty_id,
      department_id,
      advisor_id,
      status,
      year_of_admission,
      academic_year,
    } = req.body;

    const organization_id = req.user.organization_id;

    // Kiểm tra email trùng
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create(
      [
        {
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
        }
      ],
      { session }
    );

    const createdUser = user[0]; // do create trả về array

    // Nếu role là student → tạo student record full
    if (createdUser.role === 'student') {
      const student_code = email.split('@')[0].toUpperCase() + Date.now().toString().slice(-6);

      await Student.create(
        [
          {
            user_id: createdUser._id,
            student_code,
            organization_id,
            status: status || 'active',
            year_of_admission: year_of_admission || new Date().getFullYear(),
            academic_year: academic_year || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
            administrative_class: administrative_class || '',
            faculty_id: faculty_id || null,
            department_id: department_id || null,
            advisor_id: advisor_id || null,
          }
        ],
        { session }
      );
    }

    // Nếu role là teacher → tạo teacher record
    if (createdUser.role === 'teacher') {
      const teacher_code = 'TC' + email.split('@')[0].toUpperCase() + Date.now().toString().slice(-4);
      await Teacher.create(
        [
          {
            user_id: createdUser._id,
            teacher_code,
            organization_id,
            position: 'Giảng viên',
          }
        ],
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'User created successfully',
      user: { ...createdUser.toObject(), password_hash: undefined },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Server error while creating user', error: err.message });
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