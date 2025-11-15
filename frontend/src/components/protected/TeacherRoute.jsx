import React from "react";
import { Navigate } from "react-router-dom";
import { isTeacher } from "@/utils/auth";

export default function TeacherRoute({ children }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Nếu chưa đăng nhập → quay lại trang login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu không phải teacher → quay lại trang chủ
  if (!isTeacher() || userRole !== "teacher") {
    return <Navigate to="/" replace />;
  }

  // Nếu là teacher → cho vào trang
  return children;
}
