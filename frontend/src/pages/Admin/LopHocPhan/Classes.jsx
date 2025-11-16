import { useMemo, useState } from "react";

const seedClasses = [
  {
    id: "SE101-01",
    course: "Nhập môn KTPM",
    lecturer: "TS. Trần B",
    semester: "HK1/2024",
    students: 35,
    status: "Đang học",
  },
  {
    id: "IT201-02",
    course: "Cấu trúc dữ liệu",
    lecturer: "PGS. TS. Nguyễn A",
    semester: "HK1/2024",
    students: 42,
    status: "Đang học",
  },
  {
    id: "IS301-01",
    course: "Phân tích HTTT",
    lecturer: "ThS. Lê C",
    semester: "HK2/2023",
    students: 30,
    status: "Đã kết thúc",
  },
];

export default function ClassesPage() {
  const [query, setQuery] = useState("");
  const [semester, setSemester] = useState("Tất cả");
  const [status, setStatus] = useState("Tất cả");

  const data = useMemo(() => {
    return seedClasses.filter((c) => {
      const q = query.toLowerCase();
      const matchQuery = q
        ? c.id.toLowerCase().includes(q) ||
          c.course.toLowerCase().includes(q) ||
          c.lecturer.toLowerCase().includes(q)
        : true;
      const matchSemester =
        semester === "Tất cả" ? true : c.semester === semester;
      const matchStatus = status === "Tất cả" ? true : c.status === status;
      return matchQuery && matchSemester && matchStatus;
    });
  }, [query, semester, status]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Đang học":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      case "Đã kết thúc":
        return "bg-slate-50 text-slate-700 ring-slate-600/20";
      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
  };

  return (
    // Thêm nền gradient tinh tế cho toàn bộ trang
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Phần Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Quản lý lớp học phần
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Theo dõi lớp học phần theo học kỳ, giảng viên và sĩ số
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
            Tạo lớp học phần
          </button>
        </div>

        {/* Bảng dữ liệu chính */}
        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm theo mã lớp, học phần, giảng viên..."
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
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="rounded-xl border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              >
                <option>Tất cả học kỳ</option>
                <option>HK1/2024</option>
                <option>HK2/2023</option>
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              >
                <option>Tất cả trạng thái</option>
                <option>Đang học</option>
                <option>Đã kết thúc</option>
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
                    Sĩ số
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
                {data.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    {/* Cột "Thông tin" đã được gộp và cấu trúc lại */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                            <span className="text-sm font-bold leading-none text-white">
                              {c.id.split("-").pop()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {c.course}
                          </div>
                          <div className="text-xs text-gray-500">{c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {c.lecturer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {c.semester}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1.5 text-gray-400"
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
                        {c.students}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClass(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-4 transition-colors duration-150"
                        title="Chỉnh sửa"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 transition-colors duration-150"
                        title="Xóa"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
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
