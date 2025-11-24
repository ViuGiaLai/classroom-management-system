import React, { useState } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

function StatCard({ title, value, subtitle, icon, color = "blue" }: StatCardProps) {
  const colorClasses = {
    blue: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-200",
    green:
      "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-200",
    purple:
      "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-200",
    orange:
      "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-200",
  };

  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200/60 p-6 shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
      {/* Nền gradient tinh tế khi hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider no-underline">
            {title}
          </div>
          <div className="text-3xl font-bold text-gray-900 mt-2 no-underline">{value}</div>
          {subtitle && (
            <div className="text-sm text-gray-600 mt-1 no-underline">{subtitle}</div>
          )}
        </div>
        <div
          className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  interface DashboardStats {
    // Add specific stat properties here when you know the structure
    // Example:
    // totalStudents?: number;
    // totalCourses?: number;
    [key: string]: any;
  }


  return (
    // Thêm nền gradient tinh tế cho toàn bộ trang
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
      <div className="space-y-8">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Chào mừng trở lại, student</h1>
          <p className="text-gray-500 mt-1">Đây là tổng quan về quá trình học tập của bạn</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Môn học</p>
            <h2 className="text-3xl font-semibold mt-2">5</h2>
            <p className="text-gray-400 text-sm mt-1">Đang theo học</p>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Bài tập</p>
            <h2 className="text-3xl font-semibold mt-2">3</h2>
            <p className="text-gray-400 text-sm mt-1">Chưa hoàn thành</p>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Đã hoàn thành</p>
            <h2 className="text-3xl font-semibold mt-2">12</h2>
            <p className="text-gray-400 text-sm mt-1">Bài tập đã nộp</p>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Điểm TB</p>
            <h2 className="text-3xl font-semibold mt-2">8.5</h2>
            <p className="text-gray-400 text-sm mt-1">Điểm trung bình</p>
          </div>
        </div>

        {/* Courses & Assignments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Courses */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Môn học của tôi</h3>
              <button className="text-blue-600 text-sm hover:underline">Xem tất cả</button>
            </div>

            {/* Course item */}
            <div className="mb-5">
              <p className="font-medium text-gray-800">Lập trình căn bản</p>
              <p className="text-gray-500 text-sm">Thứ 2, 7:00 - 9:00</p>
              <div className="w-full bg-gray-200 h-2 rounded mt-3">
                <div className="bg-blue-500 h-2 rounded" style={{ width: '75%' }}></div>
              </div>
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Vào lớp học</button>
            </div>

            <div>
              <p className="font-medium text-gray-800">Cấu trúc dữ liệu và Giải thuật</p>
              <p className="text-gray-500 text-sm">Thứ 4, 13:00 - 15:00</p>
              <div className="w-full bg-gray-200 h-2 rounded mt-3">
                <div className="bg-blue-500 h-2 rounded" style={{ width: '75%' }}></div>
              </div>
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Vào lớp học</button>
            </div>
          </div>

          {/* Upcoming Assignments */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Bài tập sắp đến hạn</h3>

            <div className="border rounded-lg p-4 bg-orange-50 mb-4">
              <p className="font-medium text-gray-800">Bài tập 1 - Hello World</p>
              <p className="text-gray-500 text-sm">Lập trình căn bản</p>
              <p className="text-gray-500 text-sm">Hạn: 1/2/2024</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-red-500 font-semibold">+613 ngày</span>
                <button className="px-3 py-1 bg-white border text-gray-700 rounded text-sm hover:bg-gray-100">Nộp bài</button>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-orange-50">
              <p className="font-medium text-gray-800">Bài tập 2 - Tính toán cơ bản</p>
              <p className="text-gray-500 text-sm">Lập trình căn bản</p>
              <p className="text-gray-500 text-sm">Hạn: 15/2/2024</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-red-500 font-semibold">+599 ngày</span>
                <button className="px-3 py-1 bg-white border text-gray-700 rounded text-sm hover:bg-gray-100">Nộp bài</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
