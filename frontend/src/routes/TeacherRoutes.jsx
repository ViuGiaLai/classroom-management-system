import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TeacherDashboard from '../pages/teacher/Dashboard';
import ProfilePage from '../pages/teacher/profile/ProfilePage';
import MaterialsPage from '../pages/teacher/TaiLieu/index';
import TeacherClasses from '../pages/teacher/Classes/index';
import TeacherStudents from '../pages/teacher/Students/index';

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<TeacherDashboard />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="courses" element={<div className="p-6">Khóa học (coming soon)</div>} />
      <Route path="classes" element={<TeacherClasses />} />
      <Route path="students/:classId" element={<TeacherStudents />} />
      <Route path="students" element={<TeacherStudents />} />
      <Route path="materials" element={<MaterialsPage />} />
      <Route path="materials" element={<Navigate to="/teacher/classes" replace />} />
      <Route path="grades" element={<div className="p-6">Điểm số (coming soon)</div>} />
      <Route path="assignments" element={<div className="p-6">Bài tập (coming soon)</div>} />
      <Route path="schedule" element={<div className="p-6">Lịch giảng dạy (coming soon)</div>} />
      <Route path="attendance" element={<div className="p-6">Điểm danh (coming soon)</div>} />
      <Route path="reports" element={<div className="p-6">Báo cáo (coming soon)</div>} />
      <Route path="settings" element={<div className="p-6">Cài đặt (coming soon)</div>} />
    </Routes>
  );
};

export default TeacherRoutes;