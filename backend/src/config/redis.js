const { createClient } = require('redis');

let redisClient;

try {
  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      connectTimeout: 60000,
      lazyConnect: true,
    },
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
  });

  redisClient.connect()
    .then(() => console.log('Redis connected to Cloud'))
    .catch(err => {
      console.error('Redis connection error:', err.message);
      console.log('⚠️  Redis disabled - app will run without caching');
      redisClient = null;
    });
} catch (error) {
  console.error('Redis initialization failed:', error.message);
  console.log('⚠️  Redis disabled - app will run without caching');
  redisClient = null;
}

module.exports = redisClient;
