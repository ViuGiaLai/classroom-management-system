import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import Dashboard from './components/Admin/Dashboard';
import Users from './components/Admin/Users';
import Students from './components/Admin/Students';
import Lecturers from './components/Admin/Lecturers';
import Departments from './components/Admin/Departments';
import Majors from './components/Admin/Majors';
import Courses from './components/Admin/Courses';
import Classes from './components/Admin/Classes';
import Grades from './components/Admin/Grades';
import Reports from './components/Admin/Reports';
import AdminLayout from './components/Admin/Layout';
import PrivateRoute from './common/PrivateRoute'; 
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

        {/* Các route dành cho admin - bảo vệ bằng PrivateRoute */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="students" element={<Students />} />
          <Route path="lecturers" element={<Lecturers />} />
          <Route path="departments" element={<Departments />} />
          <Route path="majors" element={<Majors />} />
          <Route path="courses" element={<Courses />} />
          <Route path="classes" element={<Classes />} />
          <Route path="grades" element={<Grades />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<div className="p-6">Cài đặt (coming soon)</div>} />
          <Route path="logs" element={<div className="p-6">Nhật ký (coming soon)</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
