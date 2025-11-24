import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentDashboard from '../pages/student/Dashboard';
import ProfilePage from '../pages/student/profile/ProfilePage';

const StudentRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="courses" element={<div className="p-6">Khóa học (coming soon)</div>} />
      <Route path="grades" element={<div className="p-6">Điểm số (coming soon)</div>} />
      <Route path="schedule" element={<div className="p-6">Lịch học (coming soon)</div>} />
      <Route path="assignments" element={<div className="p-6">Bài tập (coming soon)</div>} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="settings" element={<div className="p-6">Cài đặt (coming soon)</div>} />
    </Routes>
  );
};

export default StudentRoutes;