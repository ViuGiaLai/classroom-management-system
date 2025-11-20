const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Thống kê người dùng
router.get('/users', reportController.getUserStats);
router.get('/users/export', reportController.generateUserReport);

// Thống kê học phần
router.get('/courses', reportController.getCourseStats);
router.get('/courses/export', reportController.generateCourseReport);

// Thống kê kết quả học tập
router.get('/academic', reportController.getAcademicStats);
router.get('/academic/export', reportController.generateAcademicReport);

// Báo cáo tổng hợp
router.get('/comprehensive', reportController.getComprehensiveReport);
router.get('/comprehensive/export', reportController.generateComprehensiveReport);

// Thống kê dashboard
router.get('/dashboard', reportController.getDashboardStats);

module.exports = router;
