import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route index element={<TeacherDashboard />} />
      <Route path="dashboard" element={<TeacherDashboard />} />
      <Route path="courses" element={<div className="p-6">Khóa học (coming soon)</div>} />
      <Route path="classes" element={<div className="p-6">Lớp học (coming soon)</div>} />
      <Route path="students" element={<div className="p-6">Sinh viên (coming soon)</div>} />
      <Route path="grades" element={<div className="p-6">Điểm số (coming soon)</div>} />
      <Route path="assignments" element={<div className="p-6">Bài tập (coming soon)</div>} />
      <Route path="schedule" element={<div className="p-6">Lịch giảng dạy (coming soon)</div>} />
      <Route path="attendance" element={<div className="p-6">Điểm danh (coming soon)</div>} />
      <Route path="reports" element={<div className="p-6">Báo cáo (coming soon)</div>} />
      <Route path="profile" element={<div className="p-6">Hồ sơ cá nhân (coming soon)</div>} />
      <Route path="settings" element={<div className="p-6">Cài đặt (coming soon)</div>} />
    </Routes>
  );
};

export default TeacherRoutes;