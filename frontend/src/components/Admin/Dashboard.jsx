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
      {/* Nền gradient tinh tế khi hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{value}</div>
          {subtitle && (
            <div className="text-sm text-gray-600 mt-1">{subtitle}</div>
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
              Chào mừng quay trở lại, admin
            </p>
          </div>
        </div>

        {/* Phần các thẻ thống kê chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Tổng người dùng"
            value="5"
            subtitle="1 giảng viên, 3 sinh viên"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            }
            color="blue"
          />
          <StatCard
            title="Học phần"
            value="3"
            subtitle="Đang hoạt động"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            }
            color="green"
          />
          <StatCard
            title="Lớp học phần"
            value="2"
            subtitle="Học kỳ hiện tại"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            }
            color="purple"
          />
        </div>

        {/* Phần các khối thông tin chi tiết */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Khối Khoa */}
            <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Khoa</h2>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                  Xem tất cả
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard
                  title="Khoa"
                  value="3"
                  subtitle="Đang hoạt động"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  }
                  color="orange"
                />
              </div>
            </div>

            {/* Khối Hoạt động gần đây - ĐÃ CHỈNH SỬA */}
            <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Hoạt động gần đây
                </h2>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                  Xem tất cả
                </button>
              </div>
              <ul className="space-y-4">
                {[
                  {
                    color: "bg-blue-500",
                    title: "Tạo học phần mới",
                    desc: "Cơ sở dữ liệu",
                    time: "2 giờ trước",
                  },
                  {
                    color: "bg-emerald-500",
                    title: "Thêm giảng viên mới",
                    desc: "Nguyễn Văn A",
                    time: "5 giờ trước",
                  },
                  {
                    color: "bg-purple-500",
                    title: "Cập nhật thông tin khoa CNTT",
                    desc: "",
                    time: "1 ngày trước",
                  },
                ].map((activity, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    {/* Dấu chấm màu tĩnh như bản gốc */}
                    <span
                      className={`h-2 w-2 rounded-full ${activity.color} mt-2 flex-shrink-0`}
                    ></span>
                    <div className="flex-1 text-sm text-gray-700">
                      <span className="font-semibold">{activity.title}:</span>{" "}
                      {activity.desc}
                      <span className="block text-xs text-gray-500 mt-1">
                        {activity.time}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Khối Thống kê nhanh */}
          <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Thống kê nhanh
            </h2>
            <ul className="space-y-5">
              {[
                {
                  icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                  label: "Tỷ lệ giảng viên/sinh viên",
                  value: "1:15",
                },
                {
                  icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                  label: "Số lớp trung bình/giảng viên",
                  value: "2.5",
                },
                {
                  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                  label: "Số sinh viên trung bình/lớp",
                  value: "35",
                },
              ].map((stat, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50/80 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={stat.icon}
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {stat.label}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {stat.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
