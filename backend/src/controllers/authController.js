const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { saveSession } = require('../utils/sessionStore');

// [POST] /api/auth/register - Đăng ký tài khoản
exports.register = async (req, res) => {
  try {
    const {
      full_name = 'New User',
      email,
      password,
      confirm_password, 
      role = 'student',
      gender,
      date_of_birth,
      phone,
      address,
      avatar_url,
    } = req.body;

    // Kiểm tra đầu vào
    if (!email || !password || !confirm_password) {
      return res.status(400).json({ message: 'Email, password, and confirm password are required' });
    }

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirm_password) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Kiểm tra email trùng
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const user = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
      role,
      gender,
      date_of_birth,
      phone,
      address,
      avatar_url,
    });

    // Tạo token JWT
    const token = generateToken(user._id, user.role);

    // Lưu session vào Redis (tùy chọn)
    await saveSession(user._id.toString(), token);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// [POST] /api/auth/login - Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(user._id, user.role);

    // Lưu token vào Redis để quản lý session đăng nhập
    await saveSession(user._id.toString(), token);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        avatar_url: user.avatar_url,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// [GET] /api/auth/me - Lấy thông tin người dùng hiện tại
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('GetMe error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
