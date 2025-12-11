import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TeacherDashboard from '../pages/teacher/Dashboard';
import ProfilePage from '../pages/teacher/profile/ProfilePage';
import MaterialsPage from '../pages/teacher/TaiLieu/index';
import TeacherClasses from '../pages/teacher/Classes/index';
import TeacherStudents from '../pages/teacher/Students/index';

import DiemDanh from '../pages/teacher/DiemDanh/index';
import AssignmentPage from '../pages/teacher/BaiTap/index';
import ExamList from '../pages/teacher/Exams/index';
import CreateExam from '../pages/teacher/Exams/CreateExam';
import ExamDetail from '../pages/teacher/Exams/ExamDetail';
import EditExam from '../pages/teacher/Exams/EditExam';

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
      <Route path="assignments" element={<AssignmentPage />} />
      {/* kiểm tra */}
      <Route path="exams" element={<ExamList />} />
      <Route path="exams/create" element={<CreateExam />} />
      <Route path="exams/:id" element={<ExamDetail />} />
      <Route path="exams/edit/:id" element={<EditExam />} />


      <Route path="schedule" element={<div className="p-6">Lịch giảng dạy (coming soon)</div>} />
      <Route path="attendance" element={<DiemDanh />} />
      <Route path="attendance/:classId" element={<DiemDanh />} />
      <Route path="reports" element={<div className="p-6">Báo cáo (coming soon)</div>} />
      <Route path="settings" element={<div className="p-6">Cài đặt (coming soon)</div>} />
    </Routes>
  );
};

export default TeacherRoutes;