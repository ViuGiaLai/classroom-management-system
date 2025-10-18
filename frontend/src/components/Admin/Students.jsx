import { useMemo, useState } from "react";

const seedStudents = [
  {
    id: "SV001",
    name: "Nguyễn Văn A",
    email: "sv.a@lms.edu.vn",
    major: "CNTT",
    className: "IT01",
    year: "K64",
    status: "Đang học",
  },
  {
    id: "SV002",
    name: "Trần Thị B",
    email: "sv.b@lms.edu.vn",
    major: "KTPM",
    className: "SE02",
    year: "K64",
    status: "Đang học",
  },
  {
    id: "SV003",
    name: "Lê Văn C",
    email: "sv.c@lms.edu.vn",
    major: "HTTT",
    className: "IS03",
    year: "K63",
    status: "Bảo lưu",
  },
  {
    id: "SV004",
    name: "Phạm D",
    email: "sv.d@lms.edu.vn",
    major: "CNTT",
    className: "IT01",
    year: "K63",
    status: "Tốt nghiệp",
  },
];

export default function StudentsPage() {
  const [query, setQuery] = useState("");
  const [major, setMajor] = useState("Tất cả");
  const [status, setStatus] = useState("Tất cả");

  const data = useMemo(() => {
    return seedStudents.filter((s) => {
      const q = query.toLowerCase();
      const matchQuery = q
        ? s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
        : true;
      const matchMajor = major === "Tất cả" ? true : s.major === major;
      const matchStatus = status === "Tất cả" ? true : s.status === status;
      return matchQuery && matchMajor && matchStatus;
    });
  }, [query, major, status]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Đang học":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      case "Bảo lưu":
        return "bg-amber-50 text-amber-700 ring-amber-600/20";
      case "Tốt nghiệp":
        return "bg-blue-50 text-blue-700 ring-blue-600/20";
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
              Quản lý sinh viên
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Danh sách sinh viên và trạng thái học tập
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
            Thêm sinh viên
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
                  placeholder="Tìm theo mã, tên, email..."
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
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="rounded-xl border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              >
                <option>Tất cả chuyên ngành</option>
                <option>CNTT</option>
                <option>KTPM</option>
                <option>HTTT</option>
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              >
                <option>Tất cả trạng thái</option>
                <option>Đang học</option>
                <option>Bảo lưu</option>
                <option>Tốt nghiệp</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/70 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thông tin
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ngành
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Lớp
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Khóa
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
                {data.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            <span className="text-sm font-medium leading-none text-white">
                              {s.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {s.name}
                          </div>
                          <div className="text-xs text-gray-500">{s.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {s.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {s.major}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {s.className}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {s.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClass(
                          s.status
                        )}`}
                      >
                        {s.status}
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
