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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Phần Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Tổng quan hệ thống
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Chào mừng quay trở lại, teacher
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
