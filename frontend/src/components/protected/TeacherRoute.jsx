import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function TeacherRoute({ children }) {
  const { isAuthenticated, isTeacher, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Nếu chưa đăng nhập → quay lại trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu không phải teacher → quay lại trang chủ
  if (!isTeacher) {
    return <Navigate to="/" replace />;
  }

  // Nếu là teacher → cho vào trang
  return children;
}
