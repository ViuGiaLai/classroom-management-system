const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Organization = require('../models/organizationModel');
const generateToken = require('../utils/generateToken');
const { saveSession, deleteSession } = require('../utils/sessionStore');

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

    const existingOrg = await Organization.findOne({ email: org_email });
    if (existingOrg) {
      return res.status(400).json({ message: 'Email tổ chức đã tồn tại' });
    }

    const existingAdmin = await User.findOne({ email: admin_email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email admin đã tồn tại' });
    }

    const organization = new Organization({
      name: org_name,
      email: org_email,
      phone: org_phone,
      address: org_address,
      description,
    });
    await organization.save();

    try {
      const hashedPassword = await bcrypt.hash(admin_password, 10);

      const adminUser = new User({
        full_name: admin_name,
        email: admin_email,
        password_hash: hashedPassword,
        role: 'admin',
        organization_id: organization._id,
      });
      await adminUser.save();

      const token = generateToken(adminUser._id, adminUser.role, organization._id);
      await saveSession(adminUser._id.toString(), token);

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: adminUser._id,
          full_name: adminUser.full_name,
          email: adminUser.email,
          role: adminUser.role,
          organization_id: organization._id,
          phone: adminUser.phone || '',
          address: adminUser.address || '',
          gender: adminUser.gender || 'male',
          date_of_birth: adminUser.date_of_birth || null,
          avatar_url: adminUser.avatar_url || ''
        },
      });
    } catch (adminErr) {
      try {
        await Organization.deleteOne({ _id: organization._id });
        console.warn('Rolled back organization due to admin creation failure:', organization._id);
      } catch (cleanupErr) {
        console.error('Failed to rollback organization after admin creation error:', cleanupErr);
      }
      return res.status(400).json({ message: adminErr.message || 'Lỗi khi tạo tài khoản admin' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
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

    const token = generateToken(user._id, user.role, user.organization_id);
    await saveSession(user._id.toString(), token);

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
        full_name: user.full_name || '',
        email: user.email || '',
        role: user.role || 'student',
        organization_id: user.organization_id || null,
        phone: user.phone || '',
        address: user.address || '',
        gender: user.gender || 'male',
        date_of_birth: user.date_of_birth || null,
        avatar_url: user.avatar_url || ''
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

    res.status(200).json({
      id: user._id,
      full_name: user.full_name || '',
      email: user.email || '',
      role: user.role || 'student',
      organization_id: user.organization_id || null,
      phone: user.phone || '',
      address: user.address || '',
      gender: user.gender || 'male',
      date_of_birth: user.date_of_birth || null,
      avatar_url: user.avatar_url || ''
    });
  } catch (err) {
    console.error('GetMe error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// [POST] /api/auth/logout - Đăng xuất
exports.logout = async (req, res) => {
  try {
    await deleteSession(req.user.id);

    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err.message);
    res.status(500).json({ message: 'Server error during logout' });
  }
};