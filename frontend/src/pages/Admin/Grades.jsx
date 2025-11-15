import { useMemo, useState } from "react";

const seedGrades = [
  {
    id: 1,
    courseCode: "CS101",
    courseName: "Lập trình cơ bản",
    lecturer: "Nguyễn Văn A",
    semester: "HK1 2024",
    submitDate: "15/3/2024",
    studentCount: 2,
    status: "Chờ duyệt",
  },
  {
    id: 2,
    courseCode: "CS102",
    courseName: "Cấu trúc dữ liệu và giải thuật",
    lecturer: "Trần Thị B",
    semester: "HK1 2024",
    submitDate: "10/3/2024",
    studentCount: 3,
    status: "Đã duyệt",
  },
  {
    id: 3,
    courseCode: "CS103",
    courseName: "Lập trình hướng đối tượng",
    lecturer: "Lê Văn C",
    semester: "HK2 2024",
    submitDate: "5/3/2024",
    studentCount: 1,
    status: "Đã trả lại",
  },
];

export default function GradesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Tất cả");
  const [activeTab, setActiveTab] = useState("Tất cả");

  const data = useMemo(() => {
    return seedGrades.filter((g) => {
      const q = query.toLowerCase();
      const matchQuery = q
        ? g.courseCode.toLowerCase().includes(q) ||
          g.courseName.toLowerCase().includes(q) ||
          g.lecturer.toLowerCase().includes(q)
        : true;
      const matchStatus = status === "Tất cả" ? true : g.status === status;
      const matchTab = activeTab === "Tất cả" ? true : g.status === activeTab;
      return matchQuery && matchStatus && matchTab;
    });
  }, [query, status, activeTab]);

  const getStatusClass = (st) => {
    switch (st) {
      case "Chờ duyệt":
        return "bg-amber-50 text-amber-700 ring-amber-600/20";
      case "Đã duyệt":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      case "Đã trả lại":
        return "bg-rose-50 text-rose-700 ring-rose-600/20";
      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
  };

  // Định nghĩa các thẻ trạng thái với số lượng và phụ đề tương ứng
  const statusTabs = [
    {
      key: "Chờ duyệt",
      count: seedGrades.filter((g) => g.status === "Chờ duyệt").length,
      subtitle: "Lớp học phần cần duyệt điểm",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "amber",
    },
    {
      key: "Đã duyệt",
      count: seedGrades.filter((g) => g.status === "Đã duyệt").length,
      subtitle: "Lớp đã hoàn thành",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "emerald",
    },
    {
      key: "Đã trả lại",
      count: seedGrades.filter((g) => g.status === "Đã trả lại").length,
      subtitle: "Cần chỉnh sửa",
      icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "rose",
    },
  ];

  return (
    // Thêm nền gradient tinh tế cho toàn bộ trang
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Phần Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Danh sách điểm
            </h1>
            <p className="text-base text-gray-500 mt-2">
              Quản lý và phê duyệt điểm sinh viên theo học phần
            </p>
          </div>
          <button className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nhập điểm
          </button>
        </div>

        {/* Phần các thẻ trạng thái */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statusTabs.map((tab) => (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`group relative overflow-hidden rounded-2xl border bg-white p-6 cursor-pointer transition-all duration-300 ease-out ${
                activeTab === tab.key
                  ? `border-${tab.color}-500 shadow-xl scale-105`
                  : "border-gray-200 shadow-md hover:shadow-lg hover:scale-[1.02]"
              }`}
            >
              {/* Nền gradient tinh tế khi active */}
              {activeTab === tab.key && (
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-${tab.color}-50/50 to-transparent opacity-70`}
                />
              )}
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{tab.key}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {tab.count}
                  </p>
                  {/* Phụ đề được thêm vào đây */}
                  <p className="text-xs text-gray-500 mt-1">{tab.subtitle}</p>
                </div>
                <div
                  className={`h-12 w-12 rounded-2xl bg-${tab.color}-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-7 w-7 text-${tab.color}-600`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={tab.icon}
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bảng dữ liệu chính */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-lg">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm kiếm theo mã HP, tên học phần, giảng viên..."
                  className="w-full rounded-xl border-gray-300 bg-white pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              >
                <option>Tất cả</option>
                <option>Chờ duyệt</option>
                <option>Đã duyệt</option>
                <option>Đã trả lại</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/70 border-b border-gray-200">
                <tr>
                  {/* Gộp hai cột thành một cột "Thông tin" */}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thông tin
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Giảng viên
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Học kỳ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ngày gửi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    SL sinh viên
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((g) => (
                  <tr
                    key={g.id}
                    className="hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    {/* Cột "Thông tin" đã được gộp và cấu trúc lại */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            <span className="text-sm font-bold leading-none text-white">
                              {g.courseCode.slice(-3)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {g.courseName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {g.courseCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {g.lecturer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {g.semester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {g.submitDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {g.studentCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClass(
                          g.status
                        )}`}
                      >
                        {g.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-150">
                        Xem & Duyệt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
