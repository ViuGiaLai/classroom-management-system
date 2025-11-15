import React from "react";
import { Navigate } from "react-router-dom";
import { isAdmin } from "@/utils/auth";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Nếu chưa đăng nhập → quay lại trang login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu không phải admin → quay lại trang chủ
  if (!isAdmin() || userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Nếu là admin → cho vào trang
  return children;
}
