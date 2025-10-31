require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');            
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser'); 
const connectDB = require('./src/config/db');
require('./src/config/redis'); // redis

const cron = require('node-cron'); 
const backupMongo = require('./src/utils/backupMongo');

// Security middleware
const helmet = require('helmet');

// chống tấn công NoSQL Injection, phổ biến nhắm vào MongoDB.
const sanitize = require('mongo-sanitize');

const rateLimit = require('express-rate-limit');

// Routes
const organizationRoutes = require('./src/routes/organizationRoutes');
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
const requestRoutes = require('./src/routes/requestsRoutes');

const app = express();

// Giới hạn lượng request
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 phút
  max: 100,                  // Tối đa 100 request
  message: 'Too many requests, please try again later.',
});

// CORS configuration bảo mật, cookie và frontend giao tiếp với backend.
const corsOptions = {
  origin: true, 
  credentials: true,  // gửi cookie và token.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// frontend http://localhost:3000 và backend http://localhost:5000
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(generalLimiter);  
  
app.use(helmet());

// backupMongo chạy vào 23:00 tối Chủ Nhật, mỗi 2 tuần
cron.schedule('0 23 * * 0', () => {
  const currentWeek = Math.floor((new Date()).getDate() / 7);
  // tự động sao lưu dữ liệu (backupMongo) 2 lần mỗi tháng
  if (currentWeek % 2 === 1) {
    console.log('Tự động backup MongoDB (2 tuần/lần)...');
    backupMongo();
  } else {
    console.log(' Tuần này bỏ qua backup (lịch 2 tuần/lần)');
  }
});

// Tự động làm sạch dữ liệu độc hại
app.use((req, res, next) => {
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
});

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
// tổ chức
app.use('/api/organizations', organizationRoutes);
app.use('/api/auth', authRoutes);
// người dùng
app.use('/api/users', userRoutes);
// khoa
app.use('/api/faculties', facultyRoutes);
// bộ môn
app.use('/api/departments', departmentRoutes);
// sinh viên
app.use('/api/students', studentRoutes);
// giáo viên
app.use('/api/teachers', teacherRoutes);
// khóa học
app.use('/api/courses', courseRoutes);
// lớp học
app.use('/api/classes', classRoutes);
// tài liệu học tập
app.use('/api/materials', materialRoutes);
// bài tập
app.use('/api/assignments', assignmentRoutes);
// nộp bài tập
app.use('/api/submissions', submissionRoutes);
// điểm danh
app.use('/api/attendance', attendanceRoutes);
// bản nộp điểm lớp học phần
app.use('/api/class-grade-submissions', classGradeSubmissionRoutes);
// bài thi
app.use('/api/exams', examRoutes);
// câu hỏi
app.use('/api/questions', questionRoutes);
// thông báo
app.use('/api/notifications', notificationRoutes);
// thảo luận
app.use('/api/discussions', discussionRoutes);
// bình luận thảo luận
app.use('/api/discussion-comments', discussionCommentRoutes);
// yêu cầu
app.use('/api/requests', requestRoutes);

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
