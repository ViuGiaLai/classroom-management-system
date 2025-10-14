require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db'); // import file db.js

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const facultyRoutes = require('./src/routes/facultyRoutes');
const departmentRoutes = require('./src/routes/departmentRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const teacherRoutes = require('./src/routes/teacherRoutes');
const courseRoutes = require('./src/routes/courseRoutes');

const app = express();
app.use(cors());  // cho phép tất cả các nguồn truy cập API giữa backend và frontend
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// khoa
app.use('/api/faculties', facultyRoutes);
// chuyên ngành
app.use('/api/departments', departmentRoutes);
// danh sách sinh viên
app.use('/api/students', studentRoutes);
// danh sách giảng viên
app.use('/api/teachers', teacherRoutes);
// danh sách khóa học
app.use('/api/courses', courseRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('LMS API is running...');
});

// Kết nối MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
