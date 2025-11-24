const User = require('../models/userModel');
const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');
const bcrypt = require('bcrypt');

// [POST] /api/users - Tạo người dùng mới (đơn giản hóa)
exports.createUser = async (req, res) => {
  const session = await User.startSession();
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

      // Student fields (chỉ giữ những trường quan trọng)
      administrative_class,
      faculty_id,
      department_id,
      advisor_id,
      status,

      // Teacher fields (chỉ giữ những trường quan trọng)
      position,
      degree,
      specialization,
    } = req.body;

    const organization_id = req.user.organization_id;

    // Kiểm tra email trùng
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user
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
          organization_id,
        }
      ],
      { session }
    );

    const createdUser = user[0];

    // Nếu role là student
    if (createdUser.role === 'student') {
      const student_code = email.split('@')[0].toUpperCase() + Date.now().toString().slice(-6);

      await Student.create(
        [
          {
            user_id: createdUser._id,
            student_code,
            organization_id,
            status: status || 'active',
            administrative_class: administrative_class || '',
            faculty_id: faculty_id || null,
            department_id: department_id || null,
            advisor_id: advisor_id || null,
          }
        ],
        { session }
      );
    }

    // Nếu role là teacher
    if (createdUser.role === 'teacher') {
      const teacher_code = 'TC' + email.split('@')[0].toUpperCase() + Date.now().toString().slice(-4);
      
      await Teacher.create(
        [
          {
            user_id: createdUser._id,
            teacher_code,
            organization_id,
            position: position || 'Giảng viên',
            degree: degree || '',
            specialization: specialization || '',
            faculty_id: faculty_id || null,
            department_id: department_id || null,
          }
        ],
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'Tạo người dùng thành công',
      user: { ...createdUser.toObject(), password_hash: undefined },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Lỗi tạo user:', err);
    res.status(500).json({ 
      message: 'Lỗi server khi tạo người dùng', 
      error: err.message 
    });
  }
};

// [PUT] /api/users/:id - Cập nhật thông tin người dùng (đơn giản hóa)
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
      role,

      // Student fields
      administrative_class,
      faculty_id,
      department_id,
      advisor_id,
      status,

      // Teacher fields
      position,
      degree,
      specialization,
    } = req.body;

    const user = await User.findOne({
      _id: id,
      organization_id: req.user.organization_id
    });

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Cập nhật thông tin cơ bản
    if (full_name) user.full_name = full_name;
    if (password) user.password_hash = await bcrypt.hash(password, 10);
    if (gender) user.gender = gender;
    if (date_of_birth) user.date_of_birth = date_of_birth;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    // Xử lý thay đổi role
    if (role && role !== user.role) {
      const oldRole = user.role;
      user.role = role;

      // Xóa record cũ
      if (oldRole === 'student') {
        await Student.findOneAndDelete({ user_id: user._id });
      } else if (oldRole === 'teacher') {
        await Teacher.findOneAndDelete({ user_id: user._id });
      }

      // Tạo record mới
      if (role === 'student') {
        const student_code = user.email.split('@')[0].toUpperCase() + Date.now().toString().slice(-6);
        await Student.create({
          user_id: user._id,
          student_code,
          organization_id: req.user.organization_id,
          status: status || 'active',
          administrative_class: administrative_class || '',
          faculty_id: faculty_id || null,
          department_id: department_id || null,
          advisor_id: advisor_id || null,
        });
      } else if (role === 'teacher') {
        const teacher_code = 'TC' + user.email.split('@')[0].toUpperCase() + Date.now().toString().slice(-4);
        await Teacher.create({
          user_id: user._id,
          teacher_code,
          organization_id: req.user.organization_id,
          position: position || 'Giảng viên',
          degree: degree || '',
          specialization: specialization || '',
          faculty_id: faculty_id || null,
          department_id: department_id || null,
        });
      }
    }

    await user.save();

    // Cập nhật role-specific records
    if (user.role === 'student') {
      const studentUpdate = {};
      if (administrative_class !== undefined) studentUpdate.administrative_class = administrative_class;
      if (faculty_id !== undefined) studentUpdate.faculty_id = faculty_id;
      if (department_id !== undefined) studentUpdate.department_id = department_id;
      if (advisor_id !== undefined) studentUpdate.advisor_id = advisor_id;
      if (status !== undefined) studentUpdate.status = status;

      if (Object.keys(studentUpdate).length > 0) {
        await Student.findOneAndUpdate(
          { user_id: user._id },
          studentUpdate,
          { new: true }
        );
      }
    } else if (user.role === 'teacher') {
      const teacherUpdate = {};
      if (position !== undefined) teacherUpdate.position = position;
      if (degree !== undefined) teacherUpdate.degree = degree;
      if (specialization !== undefined) teacherUpdate.specialization = specialization;
      if (faculty_id !== undefined) teacherUpdate.faculty_id = faculty_id;
      if (department_id !== undefined) teacherUpdate.department_id = department_id;

      if (Object.keys(teacherUpdate).length > 0) {
        await Teacher.findOneAndUpdate(
          { user_id: user._id },
          teacherUpdate,
          { new: true }
        );
      }
    }

    res.status(200).json({
      message: 'Cập nhật người dùng thành công',
      user: { ...user.toObject(), password_hash: undefined },
    });
  } catch (err) {
    console.error('Lỗi cập nhật user:', err);
    res.status(500).json({ 
      message: 'Lỗi server khi cập nhật', 
      error: err.message 
    });
  }
};

// [PUT] /api/users/profile - Cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
  const session = await User.startSession();
  session.startTransaction();

  try {
    const {
      full_name,
      phone,
      address,
      gender,
      date_of_birth,
      avatar
    } = req.body;

    const user = await User.findById(req.user.id).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Cập nhật thông tin cơ bản
    if (full_name) user.full_name = full_name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (gender) user.gender = gender;
    if (date_of_birth) user.date_of_birth = date_of_birth;
    if (avatar) user.avatar = avatar;

    await user.save({ session });
    await session.commitTransaction();
    session.endSession();

    // Lấy thông tin user mới nhất
    const updatedUser = await User.findById(user._id).select('-password_hash');
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user: updatedUser
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Lỗi cập nhật thông tin cá nhân:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật thông tin',
      error: error.message
    });
  }
};

// [GET] và [DELETE] giữ nguyên như cũ
exports.getAllUsers = async (req, res) => {
  try {
    const filter = { organization_id: req.user.organization_id };
    const users = await User.find(filter)
      .select('-password_hash')
      .populate('organization_id');

    res.status(200).json(users);
  } catch (err) {
    console.error('Lỗi lấy danh sách user:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userToDelete = await User.findOne({
      _id: id,
      organization_id: req.user.organization_id
    });

    if (!userToDelete) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Xóa bản ghi liên quan
    if (userToDelete.role === 'student') {
      await Student.findOneAndDelete({ user_id: userToDelete._id });
    } else if (userToDelete.role === 'teacher') {
      await Teacher.findOneAndDelete({ user_id: userToDelete._id });
    }

    await User.findOneAndDelete({
      _id: id,
      organization_id: req.user.organization_id
    });

    res.status(200).json({ message: 'Xóa người dùng thành công' });
  } catch (err) {
    console.error('Lỗi xóa user:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};