// Đây là nơi thao tác với Redis để lưu / kiểm tra / xóa token.

const redisClient = require('../config/redis');

const SESSION_EXPIRE = 60 * 60 * 2; // 2 hours Redis tự xoá → người dùng phải đăng nhập lại.

exports.saveSession = async (userId, token) => {
  if (!redisClient) return; // Skip if Redis is disabled
  await redisClient.setEx(`session:${userId}`, SESSION_EXPIRE, token);
};

exports.getSession = async (userId) => {
  if (!redisClient) return null; // Skip if Redis is disabled
  return await redisClient.get(`session:${userId}`);
};

exports.deleteSession = async (userId) => {
  if (!redisClient) return; // Skip if Redis is disabled
  await redisClient.del(`session:${userId}`);
};
