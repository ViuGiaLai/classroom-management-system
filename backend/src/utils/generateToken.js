const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  // Tạo token mới từ dữ liệu người dùng
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token hết hạn sau 7 ngày
  );
};

module.exports = generateToken;
