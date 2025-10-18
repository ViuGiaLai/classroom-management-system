import { useState } from "react";

export default function GenerateReportPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = (reportType) => {
    setIsGenerating(true);
    // Giả lập quá trình tạo báo cáo
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Đã tạo thành công báo cáo ${reportType}!`);
    }, 2000);
  };

  const reportModules = [
    {
      id: "users",
      title: "Báo cáo Người dùng",
      icon: (
        <svg
          className="h-8 w-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      stats: [
        { label: "Tổng số người dùng", value: "5" },
        { label: "Giảng viên", value: "1" },
        { label: "Sinh viên", value: "3" },
      ],
      color: "blue",
    },
    {
      id: "courses",
      title: "Báo cáo Học phần",
      icon: (
        <svg
          className="h-8 w-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      stats: [
        { label: "Tổng số học phần", value: "3" },
        { label: "Lớp học", value: "2" },
        { label: "Trung bình/lớp", value: "35 SV/lớp" },
      ],
      color: "green",
    },
    {
      id: "outcomes",
      title: "Báo cáo Kết quả học tập",
      icon: (
        <svg
          className="h-8 w-8 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      stats: [
        { label: "Điểm trung bình", value: "7.8" },
        { label: "Tỷ lệ qua môn", value: "92%" },
        { label: "Tổng số đánh giá", value: "3" },
      ],
      color: "purple",
    },
    {
      id: "comprehensive",
      title: "Báo cáo Tổng hợp",
      icon: (
        <svg
          className="h-8 w-8 text-orange-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6m0 4V8m0 0l2-2m-2 2l2 2"
          />
        </svg>
      ),
      stats: [
        { label: "Học kỳ", value: "HK2024" },
        { label: "Trạng thái", value: "Đang tiến hành" },
      ],
      color: "orange",
      primaryAction: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Báo cáo & Thống kê
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Tạo và quản lý các báo cáo hệ thống
            </p>
          </div>
        </div>

        {/* Report Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {reportModules.map((module) => (
            <div
              key={module.id}
              className="group bg-white rounded-2xl border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 ease-out overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-3 rounded-xl bg-${module.color}-50 group-hover:scale-110 transition-transform duration-300 ease-out`}
                    >
                      {module.icon}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {module.title}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {module.stats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 rounded-lg bg-gray-50/80"
                    >
                      <span className="text-sm font-medium text-gray-600">
                        {stat.label}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                      onClick={() => handleGenerateReport(module.title)}
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      PDF
                    </button>
                    <button
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                      onClick={() => handleGenerateReport(module.title)}
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6m0 4V8m0 0l2-2m-2 2l2 2"
                        />
                      </svg>
                      Excel
                    </button>
                  </div>

                  {module.primaryAction && (
                    <button
                      className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                      onClick={() => handleGenerateReport(module.title)}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Xuất báo cáo tổng hợp
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-lg font-medium text-gray-900">
              Đang tạo báo cáo...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
