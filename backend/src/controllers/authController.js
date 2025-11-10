const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Organization = require('../models/organizationModel');
const generateToken = require('../utils/generateToken');
const { saveSession } = require('../utils/sessionStore');

// [POST] /api/auth/register - Tạo tổ chức và tài khoản admin
exports.registerOrganization = async (req, res) => {
  try {
    const {
      org_name,
      org_email,
      org_phone,
      org_address,
      description,
      admin_name,
      admin_email,
      admin_password,
    } = req.body;

    if (!org_email || !admin_email || !admin_password) {
      return res.status(400).json({ message: 'Email và mật khẩu không được để trống' });
    }

    // Chuẩn hóa email
    const orgEmailNormalized = org_email.trim().toLowerCase();
    const adminEmailNormalized = admin_email.trim().toLowerCase();

    // Kiểm tra email tổ chức trùng
    const existingOrg = await Organization.findOne({ email: orgEmailNormalized });
    if (existingOrg) {
      return res.status(400).json({ message: 'Email tổ chức đã tồn tại' });
    }

    // Tạo tổ chức
    const organization = new Organization({
      name: org_name,
      email: orgEmailNormalized,
      phone: org_phone,
      address: org_address,
      description,
    });
    await organization.save();

    // Mã hóa mật khẩu admin
    const hashedPassword = await bcrypt.hash(admin_password, 10);

    // Tạo tài khoản admin
    const adminUser = new User({
      full_name: admin_name,
      email: adminEmailNormalized,
      password_hash: hashedPassword,
      role: 'admin',
      organization_id: organization._id,
    });
    await adminUser.save();

    // Tạo token JWT
    const token = generateToken(adminUser._id, adminUser.role, organization._id);

    // Lưu session vào Redis (tùy chọn)
    await saveSession(adminUser._id.toString(), token);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: adminUser._id,
        full_name: adminUser.full_name,
        email: adminUser.email,
        role: adminUser.role,
        organization_id: organization._id,
      },
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(400).json({ error: err.message });
  }
};

// [POST] /api/auth/login - Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email và mật khẩu không được để trống' });
    }

    const emailNormalized = email.trim().toLowerCase();

    const user = await User.findOne({ email: emailNormalized });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(user._id, user.role, user.organization_id);

    await saveSession(user._id.toString(), token);

    // Lưu token vào cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        organization_id: user.organization_id,
      },
      token,
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
