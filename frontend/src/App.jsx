import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import AdminRoute from './components/protected/AdminRoute';
import TeacherRoute from './components/protected/TeacherRoute';
import StudentRoute from './components/protected/StudentRoute';
import AdminRoutes from './routes/AdminRoutes';
import StudentRoutes from './routes/StudentRoutes';
import TeacherRoutes from './routes/TeacherRoutes';
import AdminDashboardLayout from './pages/Admin/DashboardLayout';
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
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboardLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<AdminRoutes />} />
        </Route>
        {/* Student Routes - bảo vệ bằng StudentRoute */}
        <Route
          path="/student"
          element={
            <StudentRoute>
              <StudentRoutes />
            </StudentRoute>
          }
        />

        {/* Teacher Routes - bảo vệ bằng TeacherRoute */}
        <Route
          path="/teacher"
          element={
            <TeacherRoute>
              <TeacherRoutes />
            </TeacherRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
