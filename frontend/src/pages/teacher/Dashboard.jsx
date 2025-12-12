import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getMyClasses } from '@/api/ClassApi';
import materialApi from '@/api/materialApi';

function StatCard({ title, value, subtitle, icon, color = "blue" }) {
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

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'purple', 'orange']),
};

export default function Dashboard() {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalMaterials, setTotalMaterials] = useState(0); // State cho tài liệu

  // --- GỌI API KHI LOAD TRANG ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // --- LẤY DỮ LIỆU LỚP HỌC ---
        const classesResponse = await getMyClasses();
        const classesList = Array.isArray(classesResponse?.data) ? classesResponse.data : [];
        setTotalClasses(classesList.length);

        // --- 3. LẤY DỮ LIỆU TÀI LIỆU ---
        // materialApi.getMaterials() trong file bạn gửi đã trả về response.data?.data || []
        // nên kết quả nhận được ở đây sẽ là mảng tài liệu luôn.
        const materialsData = await materialApi.getMaterials();
        const materialsList = Array.isArray(materialsData) ? materialsData : [];
        setTotalMaterials(materialsList.length);

      } catch (error) {
        console.error('Lỗi khi tải dữ liệu Dashboard:', error);
      }
    };

    fetchDashboardData();
  }, []);

  // --- ICONS ---
  const IconCourse = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  );

  const IconStudent = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const IconDocument = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const IconTask = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );

  const IconCalendar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  return (
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
        
        {/* 1. Hàng Thống kê (Grid 4 cột) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Lớp học phần"
            value={totalClasses}
            subtitle="Đang giảng dạy"
            icon={<IconCourse />}
            color="blue"
          />
          <StatCard
            title="Sinh viên"
            value="0"
            subtitle="Tổng số sinh viên"
            icon={<IconStudent />}
            color="green"
          />
          <StatCard
            title="Tài liệu"
            value={totalMaterials}
            subtitle="Đã đăng tải"
            icon={<IconDocument />}
            color="purple"
          />
          <StatCard
            title="Bài tập"
            value="2"
            subtitle="Đang chờ chấm"
            icon={<IconTask />}
            color="orange"
          />
        </div>

        {/* 2. Hàng Nội dung chính */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Cột trái: Lớp học của tôi */}
          <div className="bg-white rounded-2xl border border-gray-200/60 shadow-lg p-6 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Lớp học của tôi</h2>
              <button className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                Xem tất cả
              </button>
            </div>
            {/* Vùng trống */}
            <div className="flex-1 rounded-xl bg-gray-50/50 border-2 border-dashed border-gray-100 flex items-center justify-center">
              {/* Nội dung lớp học sẽ được render ở đây sau này */}
            </div>
          </div>

          {/* Cột phải: Lịch giảng dạy */}
          <div className="bg-white rounded-2xl border border-gray-200/60 shadow-lg p-6 h-full">
            <div className="flex items-center gap-2 mb-6">
              <IconCalendar />
              <h2 className="text-lg font-bold text-gray-900">Lịch giảng dạy</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50/50 rounded-xl p-4 flex gap-4 transition-all hover:bg-blue-50 border border-blue-100/50 group cursor-pointer">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-lg flex flex-col items-center justify-center text-white shadow-blue-200 shadow-md group-hover:scale-105 transition-transform duration-300">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Thứ 2</span>
                  <span className="text-lg font-bold leading-none mt-1">07:00</span>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-bold text-gray-900 text-base">Lập trình căn bản</h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    Phòng A101 <span className="text-gray-300">•</span> 07:00 - 09:00
                  </p>
                </div>
              </div>

              <div className="bg-blue-50/50 rounded-xl p-4 flex gap-4 transition-all hover:bg-blue-50 border border-blue-100/50 group cursor-pointer">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-lg flex flex-col items-center justify-center text-white shadow-blue-200 shadow-md group-hover:scale-105 transition-transform duration-300">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Thứ 4</span>
                  <span className="text-lg font-bold leading-none mt-1">13:00</span>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-bold text-gray-900 text-base">Cấu trúc dữ liệu</h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    Phòng B205 <span className="text-gray-300">•</span> 13:00 - 15:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}