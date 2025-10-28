const jwt = require('jsonwebtoken');
const { getSession } = require('../utils/sessionStore');
const User = require('../models/userModel'); 

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra token trong Redis
    const storedToken = await getSession(decoded.id);
    if (!storedToken || storedToken !== token) {
      return res.status(401).json({ message: 'Session expired or invalid' });
    }

    //  Lấy lại thông tin user đầy đủ từ DB
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Gắn đầy đủ user info (bao gồm organization_id)
    req.user = {
      id: user._id,
      role: user.role,
      organization_id: user.organization_id,
      email: user.email,
      full_name: user.full_name,
    };

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware phân quyền
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { protect, authorize };
