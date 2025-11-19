const User = require('../models/userModel');
const Course = require('../models/courseModel');
const CourseClass = require('../models/classModel');
const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');
const Grade = require('../models/classGradeSubmissionModel');
const Faculty = require('../models/facultyModel');
const Department = require('../models/departmentModel');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

// Helper function to get user stats
const getUserStatsData = async () => {
    const totalUsers = await User.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Thá»‘ng kÃª theo khoa
    const facultyStats = await Faculty.aggregate([
        {
            $lookup: {
                from: 'students',
                localField: '_id',
                foreignField: 'faculty_id',
                as: 'students'
            }
        },
        {
            $lookup: {
                from: 'teachers',
                localField: '_id',
                foreignField: 'faculty_id',
                as: 'teachers'
            }
        },
        {
            $project: {
                name: 1,
                studentCount: { $size: '$students' },
                teacherCount: { $size: '$teachers' }
            }
        }
    ]);

    return {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalAdmins,
        facultyStats
    };
};

// Helper function to get course stats
const getCourseStatsData = async () => {
    const totalCourses = await Course.countDocuments();
    const totalClasses = await CourseClass.countDocuments();

    // Tính trung bình sinh viên mỗi lớp
    const classStats = await CourseClass.aggregate([
        {
            $group: {
                _id: null,
                totalStudents: { $sum: '$current_enrollment' },
                avgStudents: { $avg: '$current_enrollment' }
            }
        }
    ]);

    const avgStudentsPerClass = classStats.length > 0 ? Math.round(classStats[0].avgStudents) : 0;

    return {
        totalCourses,
        totalClasses,
        avgStudentsPerClass
    };
};

// Helper function to get academic stats
const getAcademicStatsData = async () => {
    // Tính điểm trung bình chung
    const gradeStats = await Grade.aggregate([
        {
            $group: {
                _id: null,
                avgScore: { $avg: '$score' },
                totalGrades: { $sum: 1 },
                passingCount: {
                    $sum: {
                        $cond: [{ $gte: ['$score', 5] }, 1, 0]
                    }
                }
            }
        }
    ]);

    const avgScore = gradeStats.length > 0 ? gradeStats[0].avgScore.toFixed(2) : 0;
    const totalGrades = gradeStats.length > 0 ? gradeStats[0].totalGrades : 0;
    const passingRate = gradeStats.length > 0 ? ((gradeStats[0].passingCount / gradeStats[0].totalGrades) * 100).toFixed(1) : 0;

    return {
        avgScore,
        totalGrades,
        passingRate
    };
};

// Lấy thống kê người dùng
exports.getUserStats = async (req, res) => {
    try {
        const stats = await getUserStatsData();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thống kê học phần
exports.getCourseStats = async (req, res) => {
    try {
        const stats = await getCourseStatsData();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thống kê kết quả học tập
exports.getAcademicStats = async (req, res) => {
    try {
        const stats = await getAcademicStatsData();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy báo cáo tổng hợp
exports.getComprehensiveReport = async (req, res) => {
    try {
        const userStats = await getUserStatsData();
        const courseStats = await getCourseStatsData();
        const academicStats = await getAcademicStatsData();

        res.json({
            userStats,
            courseStats,
            academicStats,
            generatedAt: new Date()
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo báo cáo người dùng
exports.generateUserReport = async (req, res) => {
    try {
        const { format } = req.query;
        const stats = await getUserStatsData();

        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Báo Cáo Người Dùng');

            worksheet.columns = [
                { header: 'Loại Người Dùng', key: 'type', width: 20 },
                { header: 'Số Lượng', key: 'count', width: 15 }
            ];

            worksheet.addRow({ type: 'Tổng Số Người Dùng', count: stats.totalUsers });
            worksheet.addRow({ type: 'Sinh Viên', count: stats.totalStudents });
            worksheet.addRow({ type: 'Giảng Viên', count: stats.totalTeachers });
            worksheet.addRow({ type: 'Quản Trị Viên', count: stats.totalAdmins });

            // Thống kê theo khoa
            worksheet.addRow({});
            worksheet.addRow({ type: 'THỐNG KÊ THEO KHOA', count: '' });
            stats.facultyStats.forEach(faculty => {
                worksheet.addRow({ type: faculty.name, count: faculty.studentCount + faculty.teacherCount });
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=bao-cao-nguoi-dung.xlsx');

            await workbook.xlsx.write(res);
            res.end();
        } else if (format === 'pdf') {
            const doc = new PDFDocument();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=bao-cao-nguoi-dung.pdf');

            doc.pipe(res);

            doc.fontSize(20).text('Báo Cáo Thống Kê Người Dùng', { align: 'center' });
            doc.moveDown();

            doc.fontSize(14).text(`Tổng Số Người Dùng: ${stats.totalUsers}`);
            doc.text(`Sinh Viên: ${stats.totalStudents}`);
            doc.text(`Giảng Viên: ${stats.totalTeachers}`);
            doc.text(`Quản Trị Viên: ${stats.totalAdmins}`);

            doc.moveDown();
            doc.fontSize(16).text('Thống Kê Theo Khoa:');

            stats.facultyStats.forEach(faculty => {
                doc.fontSize(12).text(`${faculty.name}: ${faculty.studentCount + faculty.teacherCount} người`);
            });

            doc.end();
        } else {
            res.status(400).json({ message: 'Format không hợp lệ' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo báo cáo học phần
exports.generateCourseReport = async (req, res) => {
    try {
        const { format } = req.query;
        const stats = await getCourseStatsData();

        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Báo Cáo Học Phần');

            worksheet.columns = [
                { header: 'Chỉ Số', key: 'indicator', width: 25 },
                { header: 'Giá Trị', key: 'value', width: 15 }
            ];

            worksheet.addRow({ indicator: 'Tổng Số Học Phần', value: stats.totalCourses });
            worksheet.addRow({ indicator: 'Tổng Số Lớp Học', value: stats.totalClasses });
            worksheet.addRow({ indicator: 'Trung Bình Sinh Viên/Lớp', value: stats.avgStudentsPerClass });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=bao-cao-hoc-phan.xlsx');

            await workbook.xlsx.write(res);
            res.end();
        } else if (format === 'pdf') {
            const doc = new PDFDocument();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=bao-cao-hoc-phan.pdf');

            doc.pipe(res);

            doc.fontSize(20).text('Báo Cáo Thống Kê Học Phần', { align: 'center' });
            doc.moveDown();

            doc.fontSize(14).text(`Tổng Số Học Phần: ${stats.totalCourses}`);
            doc.text(`Tổng Số Lớp Học: ${stats.totalClasses}`);
            doc.text(`Trung Bình Sinh Viên/Lớp: ${stats.avgStudentsPerClass}`);

            doc.end();
        } else {
            res.status(400).json({ message: 'Format không hợp lệ' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo báo cáo kết quả học tập
exports.generateAcademicReport = async (req, res) => {
    try {
        const { format } = req.query;
        const stats = await getAcademicStatsData();

        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Báo Cáo Kết Quả Học Tập');

            worksheet.columns = [
                { header: 'Chỉ Số', key: 'indicator', width: 25 },
                { header: 'Giá Trị', key: 'value', width: 15 }
            ];

            worksheet.addRow({ indicator: 'Điểm Trung Bình', value: stats.avgScore });
            worksheet.addRow({ indicator: 'Tổng Số Đánh Giá', value: stats.totalGrades });
            worksheet.addRow({ indicator: 'Tỷ Lệ Qua Môn (%)', value: stats.passingRate });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=bao-cao-ket-qua-hoc-tap.xlsx');

            await workbook.xlsx.write(res);
            res.end();
        } else if (format === 'pdf') {
            const doc = new PDFDocument();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=bao-cao-ket-qua-hoc-tap.pdf');

            doc.pipe(res);

            doc.fontSize(20).text('Báo Cáo Kết Quả Học Tập', { align: 'center' });
            doc.moveDown();

            doc.fontSize(14).text(`Điểm Trung Bình: ${stats.avgScore}`);
            doc.text(`Tổng Số Đánh Giá: ${stats.totalGrades}`);
            doc.text(`Tỷ Lệ Qua Môn: ${stats.passingRate}%`);

            doc.end();
        } else {
            res.status(400).json({ message: 'Format không hợp lệ' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo báo cáo tổng hợp
exports.generateComprehensiveReport = async (req, res) => {
    try {
        const { format } = req.query;
        const userStats = await getUserStatsData();
        const courseStats = await getCourseStatsData();
        const academicStats = await getAcademicStatsData();

        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();

            // Sheet thống kê người dùng
            const userSheet = workbook.addWorksheet('Thống Kê Người Dùng');
            userSheet.columns = [
                { header: 'Loại Người Dùng', key: 'type', width: 20 },
                { header: 'Số Lượng', key: 'count', width: 15 }
            ];
            userSheet.addRow({ type: 'Tổng Số Người Dùng', count: userStats.totalUsers });
            userSheet.addRow({ type: 'Sinh Viên', count: userStats.totalStudents });
            userSheet.addRow({ type: 'Giảng Viên', count: userStats.totalTeachers });
            userSheet.addRow({ type: 'Quản Trị Viên', count: userStats.totalAdmins });

            // Sheet thống kê học phần
            const courseSheet = workbook.addWorksheet('Thống Kê Học Phần');
            courseSheet.columns = [
                { header: 'Chỉ Số', key: 'indicator', width: 25 },
                { header: 'Giá Trị', key: 'value', width: 15 }
            ];
            courseSheet.addRow({ indicator: 'Tổng Số Học Phần', value: courseStats.totalCourses });
            courseSheet.addRow({ indicator: 'Tổng Số Lớp Học', value: courseStats.totalClasses });
            courseSheet.addRow({ indicator: 'Trung Bình Sinh Viên/Lớp', value: courseStats.avgStudentsPerClass });

            // Sheet thống kê kết quả học tập
            const academicSheet = workbook.addWorksheet('Thống Kê Kết Quả Học Tập');
            academicSheet.columns = [
                { header: 'Chỉ Số', key: 'indicator', width: 25 },
                { header: 'Giá Trị', key: 'value', width: 15 }
            ];
            academicSheet.addRow({ indicator: 'Điểm Trung Bình', value: academicStats.avgScore });
            academicSheet.addRow({ indicator: 'Tổng Số Đánh Giá', value: academicStats.totalGrades });
            academicSheet.addRow({ indicator: 'Tỷ Lệ Qua Môn (%)', value: academicStats.passingRate });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=bao-cao-tong-hop.xlsx');

            await workbook.xlsx.write(res);
            res.end();
        } else if (format === 'pdf') {
            const doc = new PDFDocument();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=bao-cao-tong-hop.pdf');

            doc.pipe(res);

            doc.fontSize(20).text('Báo cáo Tổng hợp Hệ thống', { align: 'center' });
            doc.moveDown();

            doc.fontSize(16).text('Thống kê người dùng:');
            doc.fontSize(14).text(`Tổng số người dùng: ${userStats.totalUsers}`);
            doc.text(`Sinh viên: ${userStats.totalStudents}`);
            doc.text(`Giảng viên: ${userStats.totalTeachers}`);
            doc.text(`Quản trị viên: ${userStats.totalAdmins}`);

            doc.moveDown();
            doc.fontSize(16).text('Thống kê học phần:');
            doc.fontSize(14).text(`Tổng số học phần: ${courseStats.totalCourses}`);
            doc.text(`Tổng số lớp học: ${courseStats.totalClasses}`);
            doc.text(`Trung bình sinh viên/lớp: ${courseStats.avgStudentsPerClass}`);

            doc.moveDown();
            doc.fontSize(16).text('Thống kê kết quả học tập:');
            doc.fontSize(14).text(`Điểm trung bình: ${academicStats.avgScore}`);
            doc.text(`Tổng số đánh giá: ${academicStats.totalGrades}`);
            doc.text(`Tỷ lệ qua môn: ${academicStats.passingRate}%`);

            doc.end();
        } else {
            res.status(400).json({ message: 'Format không hợp lệ' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thống kê dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        const userStats = await getUserStatsData();
        const courseStats = await getCourseStatsData();
        const academicStats = await getAcademicStatsData();

        res.json({
            totalUsers: userStats.totalUsers,
            totalCourses: courseStats.totalCourses,
            totalClasses: courseStats.totalClasses,
            avgScore: academicStats.avgScore,
            passingRate: academicStats.passingRate
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
