// src/components/common/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // Nếu chưa đăng nhập → quay lại trang login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có token → cho vào trang
  return children;
}
