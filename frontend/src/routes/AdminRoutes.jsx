import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminDashboard from '../pages/Admin/Dashboard';
import AdminUsers from '../pages/Admin/Users/Users';
import AdminStudents from '../pages/Admin/SinhVien/Students';
import AdminLecturers from '../pages/Admin/GiangVien/Lecturers';
import AdminDepartments from '../pages/Admin/Khoa/Faculty';
import AdminMajors from '../pages/Admin/BoMon/Majors';
import AdminCourses from '../pages/Admin/HocPhan/Courses';
import AdminClasses from '../pages/Admin/LopHocPhan/Classes';
import AdminGrades from '../pages/Admin/QuanLyDiem/Grades';
import AdminReports from '../pages/Admin/BaoCao/Reports';
import Notifications from '../pages/Admin/ThongBao/Notifications';
import Profile from '../pages/Admin/Profile';

const AdminRoutes = () => {
  const location = useLocation();
  
  // If the path is exactly /admin, redirect to /admin/dashboard
  if (location.pathname === '/admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <Routes>
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
      <Route path="notifications" element={<Notifications />} />
      <Route path="profile" element={<Profile />} />
      {/* Add a catch-all route for any undefined paths */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;