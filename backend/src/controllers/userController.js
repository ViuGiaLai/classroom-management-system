const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// [POST] /api/users - Tạo người dùng mới
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
    });

    res.status(201).json({
      message: 'User created successfully',
      user: { ...user.toObject(), password_hash: undefined },
    });
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ message: 'Server error while creating user' });
  }
};

// [GET] /api/users - Lấy danh sách tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password_hash');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// [PUT] /api/users/:id - Cập nhật thông tin người dùng
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
    } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Cập nhật các trường nếu có
    if (full_name) user.full_name = full_name;
    if (password) user.password_hash = await bcrypt.hash(password, 10);
    if (gender) user.gender = gender;
    if (date_of_birth) user.date_of_birth = date_of_birth;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (avatar_url) user.avatar_url = avatar_url;
    if (role) user.role = role;
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

// [DELETE] /api/users/:id - Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
