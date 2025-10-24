const { createClient } = require('redis');

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

redisClient.connect()
  .then(() => console.log('Redis connected to Cloud'))
  .catch(err => console.error('Redis connection error:', err.message));

module.exports = redisClient;
