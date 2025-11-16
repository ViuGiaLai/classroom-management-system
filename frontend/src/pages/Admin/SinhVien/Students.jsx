import { useMemo, useState, useEffect } from "react";
import studentApi from "@/api/studentApi";

export default function StudentsPage() {
  const [query, setQuery] = useState("");
  const [major, setMajor] = useState("Tất cả");
  const [status, setStatus] = useState("Tất cả");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    user_id: "",
    student_code: "",
    administrative_class: "",
    faculty_id: "",
    department_id: "",
    status: "Đang học",
    year_of_admission: "",
    academic_year: "",
    advisor_id: "",
  });

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getStudents();
      console.log('Student API Response:', response);
      console.log('Student API Response data:', response.data);
      console.log('Student API Response status:', response.status);
      console.log('Student API Response headers:', response.headers);
      // API returns data in response.data, similar to Users.jsx
      const studentsData = response.data || [];
      console.log('Students data:', studentsData);
      console.log('Students data length:', studentsData.length);
      setStudents(studentsData);
      setError("");
    } catch (err) {
      console.error('Error fetching students:', err);
      console.error('Error response:', err.response);
      setError("Lỗi khi tải danh sách sinh viên: " + (err.message || err));
      setStudents([]); // Ensure students is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const data = useMemo(() => {
    // Ensure students is always an array
    const studentsArray = Array.isArray(students) ? students : [];
    return studentsArray.filter((s) => {
      const q = query.toLowerCase();
      const studentName = s.user_id?.full_name || '';
      const studentCode = s.student_code || '';
      const studentEmail = s.user_id?.email || '';

      const matchQuery = q
        ? studentName.toLowerCase().includes(q) ||
        studentCode.toLowerCase().includes(q) ||
        studentEmail.toLowerCase().includes(q)
        : true;

      const studentMajor = s.faculty_id?.name || '';
      const matchMajor = major === "Tất cả" ? true : studentMajor === major;

      const matchStatus = status === "Tất cả" ? true : s.status === status;
      return matchQuery && matchMajor && matchStatus;
    });
  }, [query, major, status, students]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      if (editingStudent) {
        await studentApi.updateStudent(editingStudent._id, formData);
      } else {
        await studentApi.createStudent(formData);
      }
      await fetchStudents();
      resetForm();
    } catch (err) {
      setError("Lỗi khi lưu sinh viên: " + (err.message || err));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      user_id: student.user_id?._id || "",
      student_code: student.student_code || "",
      administrative_class: student.administrative_class || "",
      faculty_id: student.faculty_id?._id || "",
      department_id: student.department_id?._id || "",
      status: student.status || "Đang học",
      year_of_admission: student.year_of_admission || "",
      academic_year: student.academic_year || "",
      advisor_id: student.advisor_id?._id || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      setSubmitLoading(true);
      await studentApi.deleteStudent(studentToDelete._id);
      await fetchStudents();
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    } catch (err) {
      setError("Lỗi khi xóa sinh viên: " + (err.message || err));
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingStudent(null);
    setFormData({
      user_id: "",
      student_code: "",
      administrative_class: "",
      faculty_id: "",
      department_id: "",
      status: "Đang học",
      year_of_admission: "",
      academic_year: "",
      advisor_id: "",
    });
  };

  // Get unique majors and statuses for filters
  const majors = useMemo(() => {
    const uniqueMajors = [...new Set(students.map(s => s.faculty_id?.name).filter(Boolean))];
    return ["Tất cả", ...uniqueMajors];
  }, [students]);

  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(students.map(s => s.status).filter(Boolean))];
    return ["Tất cả", ...uniqueStatuses];
  }, [students]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
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
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
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

        {/* Hiển thị lỗi */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

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
                {majors.map(m => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              >
                {statuses.map(s => (
                  <option key={s}>{s}</option>
                ))}
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
                    key={s._id}
                    className="hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            <span className="text-sm font-medium leading-none text-white">
                              {s.user_id?.full_name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || 'SV'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {s.user_id?.full_name || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">{s.student_code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {s.user_id?.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {s.faculty_id?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {s.administrative_class || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {s.year_of_admission || 'N/A'}
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
                        onClick={() => handleEdit(s)}
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
                        onClick={() => handleDelete(s)}
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
            {data.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Không có dữ liệu sinh viên
              </div>
            )}
          </div>
        </div>

        {/* Modal thêm/sửa sinh viên */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingStudent ? 'Chỉnh sửa sinh viên' : 'Thêm sinh viên mới'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã sinh viên *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.student_code}
                    onChange={(e) => setFormData({ ...formData, student_code: e.target.value })}
                    className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.user_id}
                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                    className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lớp hành chính
                  </label>
                  <input
                    type="text"
                    value={formData.administrative_class}
                    onChange={(e) => setFormData({ ...formData, administrative_class: e.target.value })}
                    className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  >
                    <option value="Đang học">Đang học</option>
                    <option value="Bảo lưu">Bảo lưu</option>
                    <option value="Tốt nghiệp">Tốt nghiệp</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitLoading ? 'Đang lưu...' : (editingStudent ? 'Cập nhật' : 'Thêm mới')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal xác nhận xóa */}
        {isDeleteModalOpen && studentToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Xóa sinh viên
              </h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Bạn có chắc chắn muốn xóa sinh viên "{studentToDelete.user_id?.full_name || studentToDelete.student_code}"? 
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setStudentToDelete(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={submitLoading}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}