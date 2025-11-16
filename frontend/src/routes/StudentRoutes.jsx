import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentDashboard from '../pages/student/StudentDashboard';
import Overview from '../pages/student/overview';

const StudentRoutes = () => {
  return (
    <Routes>
      <Route index element={<StudentDashboard />} />
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="overview" element={<Overview />} />
      <Route path="courses" element={<div className="p-6">Khóa học (coming soon)</div>} />
      <Route path="grades" element={<div className="p-6">Điểm số (coming soon)</div>} />
      <Route path="schedule" element={<div className="p-6">Lịch học (coming soon)</div>} />
      <Route path="assignments" element={<div className="p-6">Bài tập (coming soon)</div>} />
      <Route path="profile" element={<div className="p-6">Hồ sơ cá nhân (coming soon)</div>} />
      <Route path="settings" element={<div className="p-6">Cài đặt (coming soon)</div>} />
    </Routes>
  );
};

export default StudentRoutes;