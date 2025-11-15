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
  SettingOutlined,
  HistoryOutlined,
  SolutionOutlined
} from '@ant-design/icons';

const navItems = [
  { key: "dashboard", path: "/admin/dashboard", label: "Tổng quan", icon: DashboardOutlined },
  { key: "users", path: "/admin/users", label: "Người dùng", icon: UserOutlined },
  { key: "students", path: "/admin/students", label: "Sinh viên", icon: TeamOutlined },
  { key: "lecturers", path: "/admin/lecturers", label: "Giảng viên", icon: SolutionOutlined },
  { key: "departments", path: "/admin/departments", label: "Khoa", icon: ApartmentOutlined },
  { key: "majors", path: "/admin/majors", label: "Chuyên ngành", icon: ReadOutlined },
  { key: "courses", path: "/admin/courses", label: "Học phần", icon: BookOutlined },
  { key: "classes", path: "/admin/classes", label: "Lớp học phần", icon: ScheduleOutlined },
  { key: "grades", path: "/admin/grades", label: "Quản lý điểm", icon: FileTextOutlined },
  { key: "reports", path: "/admin/reports", label: "Báo cáo", icon: BarChartOutlined },
  { key: "settings", path: "/admin/settings", label: "Cài đặt", icon: SettingOutlined },
  { key: "logs", path: "/admin/logs", label: "Nhật ký", icon: HistoryOutlined },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check which item is active based on the current path
  const isActive = (path) => {
    return location.pathname === path || 
           (location.pathname.endsWith(path.split('/').pop()) && 
            location.pathname.includes('admin'));
  };

  return (
    <aside className="hidden md:flex md:flex-col md:w-56 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Quản lý</h2>
      </div>
      
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 w-full text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-blue-50 text-blue-600 shadow-sm hover:bg-blue-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {React.createElement(item.icon, {
                className: `text-base ${active ? "text-blue-600" : "text-gray-500"}`,
                style: { fontSize: '16px' }
              })}
              <span className="truncate">{item.label}</span>
              {active && (
                <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}