const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      family: 4, // force IPv4 to avoid ECONNREFUSED on ::1 (IPv6) in some environments
    };
    // const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/binary-bandits';
    const uri = process.env.MONGO_URI;

    const conn = await mongoose.connect(uri, options);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Failed to connect MongoDB:', error.message);
    process.exit(1); // Dừng server nếu lỗi DB
  }
};

module.exports = connectDB;
