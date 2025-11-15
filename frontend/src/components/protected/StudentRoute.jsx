import React from "react";
import { Navigate } from "react-router-dom";
import { isStudent } from "@/utils/auth";

export default function StudentRoute({ children }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Nếu chưa đăng nhập → quay lại trang login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu không phải student → quay lại trang chủ
  if (!isStudent() || userRole !== "student") {
    return <Navigate to="/" replace />;
  }

  // Nếu là student → cho vào trang
  return children;
}
