import React from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import { getUser, logout } from '@/utils/auth';

const StudentDashboardLayout: React.FC = ({ children }: any) => {
  const user = getUser();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">LMS</h2>
        <nav className="space-y-2">
          <Link className="block p-2 rounded hover:bg-gray-200" to="/student/dashboard">Tổng quan</Link>
          <Link className="block p-2 rounded hover:bg-gray-200" to="/student/courses">Lớp học</Link>
          <Link className="block p-2 rounded hover:bg-gray-200" to="/student/assignments">Bài tập</Link>
          <Link className="block p-2 rounded hover:bg-gray-200" to="/student/schedule">Lịch học</Link>
          <Link className="block p-2 rounded hover:bg-gray-200" to="/student/grades">Điểm số</Link>
          <Link className="block p-2 rounded hover:bg-gray-200" to="/student/profile">Hồ sơ</Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-gray-900">Student Dashboard</h1>

          <div className="flex items-center space-x-4">
            <span className="text-gray-600 text-sm">Welcome, {user?.full_name || 'Student'}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content area */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default StudentDashboardLayout;
