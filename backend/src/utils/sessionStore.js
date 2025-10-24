// Đây là nơi thao tác với Redis để lưu / kiểm tra / xóa token.

const redisClient = require('../config/redis');

const SESSION_EXPIRE = 60 * 60 * 2; // 2 hours Redis tự xoá → người dùng phải đăng nhập lại.

exports.saveSession = async (userId, token) => {
  await redisClient.setEx(`session:${userId}`, SESSION_EXPIRE, token);
};

exports.getSession = async (userId) => {
  return await redisClient.get(`session:${userId}`);
};

exports.deleteSession = async (userId) => {
  await redisClient.del(`session:${userId}`);
};
