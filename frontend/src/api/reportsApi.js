import api from './axiosConfig';

// Lấy thống kê người dùng
export const getUserStats = () => {
    return api.get('/reports/users');
};

// Lấy báo cáo người dùng (PDF/Excel)
export const generateUserReport = (format) => {
    return api.get(`/reports/users/export?format=${format}`, {
        responseType: 'blob'
    });
};

// Lấy thống kê học phần
export const getCourseStats = () => {
    return api.get('/reports/courses');
};

// Lấy báo cáo học phần (PDF/Excel)
export const generateCourseReport = (format) => {
    return api.get(`/reports/courses/export?format=${format}`, {
        responseType: 'blob'
    });
};

// Lấy thống kê kết quả học tập
export const getAcademicStats = () => {
    return api.get('/reports/academic');
};

// Lấy báo cáo kết quả học tập (PDF/Excel)
export const generateAcademicReport = (format) => {
    return api.get(`/reports/academic/export?format=${format}`, {
        responseType: 'blob'
    });
};

// Lấy báo cáo tổng hợp
export const getComprehensiveReport = () => {
    return api.get('/reports/comprehensive');
};

// Lấy báo cáo tổng hợp (PDF/Excel)
export const generateComprehensiveReport = (format) => {
    return api.get(`/reports/comprehensive/export?format=${format}`, {
        responseType: 'blob'
    });
};

// Lấy thống kê chung cho dashboard
export const getDashboardStats = () => {
    return api.get('/reports/dashboard');
};

// Lấy báo cáo theo khoa
export const getFacultyReport = (facultyId) => {
    return api.get(`/reports/faculty/${facultyId}`);
};

// Lấy báo cáo theo lớp học
export const getClassReport = (classId) => {
    return api.get(`/reports/class/${classId}`);
};

// Lấy báo cáo theo học kỳ
export const getSemesterReport = (semester) => {
    return api.get(`/reports/semester/${semester}`);
};

// Lấy báo cáo theo năm học
export const getAcademicYearReport = (year) => {
    return api.get(`/reports/academic-year/${year}`);
};