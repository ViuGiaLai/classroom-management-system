import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/Admin/Dashboard';
import AdminDashboardLayout from '../pages/Admin/DashboardLayout';
import AdminUsers from '../pages/Admin/Users/Users';
import AdminStudents from '../pages/Admin/SinhVien/Students';
import AdminLecturers from '../pages/Admin/GiangVien/Lecturers';
import AdminDepartments from '../pages/Admin/Khoa/Departments';
import AdminMajors from '../pages/Admin/ChuyenNganh/Majors';
import AdminCourses from '../pages/Admin/HocPhan/Courses';
import AdminClasses from '../pages/Admin/LopHocPhan/Classes';
import AdminGrades from '../pages/Admin/QuanLyDiem/Grades';
import AdminReports from '../pages/Admin/BaoCao/Reports';

const AdminRoutes = () => {
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
    </Routes>
  );
};

export default AdminRoutes;