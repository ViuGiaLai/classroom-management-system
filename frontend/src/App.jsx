import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import AdminRoute from './components/protected/AdminRoute';
import TeacherRoute from './components/protected/TeacherRoute';
import StudentRoute from './components/protected/StudentRoute';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminDashboardLayout from './pages/Admin/DashboardLayout';
import AdminUsers from './pages/Admin/Users';
import AdminStudents from './pages/Admin/Students';
import AdminLecturers from './pages/Admin/Lecturers';
import AdminDepartments from './pages/Admin/Departments';
import AdminMajors from './pages/Admin/Majors';
import AdminCourses from './pages/Admin/Courses';
import AdminClasses from './pages/Admin/Classes';
import AdminGrades from './pages/Admin/Grades';
import AdminReports from './pages/Admin/Reports';
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<Home />} />

        {/* Trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />

        {/* Trang đăng ký */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Routes - bảo vệ bằng AdminRoute */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="lecturers" element={<AdminLecturers />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="majors" element={<AdminMajors />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="grades" element={<AdminGrades />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<div className="p-6">Cài đặt (coming soon)</div>} />
          <Route path="logs" element={<div className="p-6">Nhật ký (coming soon)</div>} />
        </Route>
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Student Routes - bảo vệ bằng StudentRoute */}
        <Route
          path="/student"
          element={
            <StudentRoute>
              <StudentDashboard />
            </StudentRoute>
          }
        />

        {/* Teacher Routes - bảo vệ bằng TeacherRoute */}
        <Route
          path="/teacher"
          element={
            <TeacherRoute>
              <TeacherDashboard />
            </TeacherRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
