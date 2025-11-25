import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  ReadOutlined,
  ApartmentOutlined,
  BookOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SolutionOutlined,
  BellOutlined
} from '@ant-design/icons';

const navItems = [
  { key: "dashboard", path: "/teacher/dashboard", label: "Tổng quan", icon: DashboardOutlined },
  { key: "classes", path: "/teacher/classes", label: "Lớp học của tôi", icon: UserOutlined },
  { key: "students", path: "/teacher/students", label: "Sinh viên", icon: TeamOutlined },
  { key: "materials", path: "/teacher/materials", label: "Tài liệu", icon: SolutionOutlined },
  { key: "assignments", path: "/teacher/assignments", label: "Bài tập", icon: ApartmentOutlined },
  { key: "exams", path: "/teacher/exams", label: "Kiểm tra", icon: ReadOutlined },
  { key: "attendance", path: "/teacher/attendance", label: "Điểm danh", icon: BookOutlined },
  { key: "lectures", path: "/teacher/lectures", label: "Lịch giảng dạy", icon: ScheduleOutlined },
  { key: "grades", path: "/teacher/grades", label: "Quản lý điểm", icon: FileTextOutlined },
  { key: "notifications", path: "/teacher/notifications", label: "Thông báo", icon: BellOutlined },
  { key: "reports", path: "/teacher/reports", label: "Báo cáo", icon: BarChartOutlined },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ||
      (location.pathname.endsWith(path.split('/').pop()) &&
        location.pathname.includes('teacher'));
  };

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 shadow-sm min-h-[calc(100vh-4rem)]">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Quản lý</h2>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);

          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-4 rounded-lg px-4 py-3 w-full text-[15px] font-medium transition-all duration-200
                ${active
                  ? "bg-blue-50 text-blue-600 shadow-sm hover:bg-blue-100"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              {React.createElement(item.icon, {
                style: { fontSize: '20px' },
                className: active ? "text-blue-600" : "text-gray-500"
              })}

              <span className="truncate">{item.label}</span>

              {active && (
                <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
