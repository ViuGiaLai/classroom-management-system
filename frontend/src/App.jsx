import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import Dashboard from './components/Admin/Dashboard';
import AdminLayout from './components/Admin/Layout';
import PrivateRoute from './common/PrivateRoute'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Chuyển hướng mặc định */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />

        {/* Các route dành cho admin - bảo vệ bằng PrivateRoute */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
