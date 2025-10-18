require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');             // ⚡ Thêm
const { Server } = require('socket.io');  // ⚡ Thêm
const connectDB = require('./src/config/db');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const facultyRoutes = require('./src/routes/facultyRoutes');
const departmentRoutes = require('./src/routes/departmentRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const teacherRoutes = require('./src/routes/teacherRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const classRoutes = require('./src/routes/classRoutes');
const materialRoutes = require('./src/routes/materialRoutes');
const assignmentRoutes = require('./src/routes/assignmentRoutes');
const submissionRoutes = require('./src/routes/submissionRoutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const classGradeSubmissionRoutes = require('./src/routes/classGradeSubmissionRoutes');
const examRoutes = require('./src/routes/examRoutes');
const questionRoutes = require('./src/routes/questionRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const discussionRoutes = require('./src/routes/discussionRoutes');
const discussionCommentRoutes = require('./src/routes/discussionCommentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Tạo HTTP server riêng để dùng với Socket.IO
const server = http.createServer(app);

//  Khởi tạo Socket.IO server
const io = new Server(server, {
  cors: { origin: '*' },
});

// Lưu `io` vào app.locals để controller có thể dùng
app.locals.io = io;

// Khi client kết nối socket
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Khi client join vào 1 room discussion
  socket.on('joinDiscussion', (discussionId) => {
    socket.join(discussionId);
    console.log(`Client ${socket.id} joined discussion ${discussionId}`);
  });

  socket.on('disconnect', () => {
    console.log(' Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/faculties', facultyRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/class-grade-submissions', classGradeSubmissionRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/discussion-comments', discussionCommentRoutes);

app.get('/', (req, res) => {
  res.send('LMS API is running...');
});

module.exports = app;

// --- chỉ chạy server thật khi KHÔNG ở chế độ test ---
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  connectDB().then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}
