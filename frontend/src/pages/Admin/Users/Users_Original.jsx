import { useMemo, useState, useEffect } from "react";
import { getAllUsers, createUser, updateUser, deleteUser } from "@/api/user";
import { EditOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from 'react-toastify';

export default function UsersPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "student",
    password: "",
    // Student-specific fields
    administrative_class: "",
    faculty_id: "",
    department_id: "",
    advisor_id: "",
    status: "studying",
    year_of_admission: new Date().getFullYear(),
    academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    // Teacher-specific fields
    position: "",
    degree: "",
    specialization: "",
    // Additional user fields
    gender: "",
    date_of_birth: "",
    phone: "",
    address: "",
    avatar_url: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const data = useMemo(() => {
    return users.filter((u) => {
      const q = query.toLowerCase();
      return (
        (u.full_name && u.full_name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q))
      );
    });
  }, [users, query]);

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-rose-50 text-rose-700 ring-rose-600/20";
      case "teacher":
        return "bg-blue-50 text-blue-700 ring-blue-600/20";
      case "student":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "teacher":
        return "Giảng viên";
      case "student":
        return "Sinh viên";
      default:
        return role;
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      full_name: "",
      email: "",
      role: "student",
      password: "",
      // Student-specific fields
      administrative_class: "",
      faculty_id: "",
      department_id: "",
      advisor_id: "",
      status: "studying",
      year_of_admission: new Date().getFullYear(),
      academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      // Teacher-specific fields
      position: "",
      degree: "",
      specialization: "",
      // Additional user fields
      gender: "",
      date_of_birth: "",
      phone: "",
      address: "",
      avatar_url: ""
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (userId) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      setEditingUser(user);
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        role: user.role || "student",
        password: "", // Không hiển thị password cũ
        // Student-specific fields (if available)
        administrative_class: user.administrative_class || "",
        faculty_id: user.faculty_id || "",
        department_id: user.department_id || "",
        advisor_id: user.advisor_id || "",
        status: user.status || "studying",
        year_of_admission: user.year_of_admission || new Date().getFullYear(),
        academic_year: user.academic_year || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        // Teacher-specific fields (if available)
        position: user.position || "",
        degree: user.degree || "",
        specialization: user.specialization || "",
        // Additional user fields
        gender: user.gender || "",
        date_of_birth: user.date_of_birth || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar_url: user.avatar_url || ""
      });
      setIsModalOpen(true);
    }
  };

  const handleDeleteUser = (userId) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      setUserToDelete(user);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setSubmitLoading(true);
    try {
      await deleteUser(userToDelete._id);
      await loadUsers(); // Reload danh sách
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      toast.success("Xóa người dùng thành công!");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Không thể xóa người dùng");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (editingUser) {
        // Cập nhật user - chỉ gửi password nếu có
        const updateData = {
          full_name: formData.full_name,
          email: formData.email,
          role: formData.role,
          // Student-specific fields
          administrative_class: formData.administrative_class,
          faculty_id: formData.faculty_id,
          department_id: formData.department_id,
          advisor_id: formData.advisor_id,
          status: formData.status,
          year_of_admission: formData.year_of_admission,
          academic_year: formData.academic_year,
          // Teacher-specific fields
          position: formData.position,
          degree: formData.degree,
          specialization: formData.specialization,
          // Additional user fields
          gender: formData.gender,
          date_of_birth: formData.date_of_birth,
          phone: formData.phone,
          address: formData.address,
          avatar_url: formData.avatar_url
        };

        // Chỉ thêm password nếu người dùng nhập
        if (formData.password.trim()) {
          updateData.password = formData.password;
        }

        await updateUser(editingUser._id, updateData);
        toast.success("Cập nhật người dùng thành công!");
      } else {
        // Tạo user mới - password là bắt buộc
        if (!formData.password.trim()) {
          toast.error("Vui lòng nhập mật khẩu");
          setSubmitLoading(false);
          return;
        }

        await createUser(formData);
        toast.success("Thêm người dùng thành công!");
      }

      await loadUsers(); // Reload danh sách
      setIsModalOpen(false);
      setFormData({
        full_name: "",
        email: "",
        role: "student",
        password: "",
        // Student-specific fields
        administrative_class: "",
        faculty_id: "",
        department_id: "",
        advisor_id: "",
        status: "studying",
        year_of_admission: new Date().getFullYear(),
        academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        // Teacher-specific fields
        position: "",
        degree: "",
        specialization: "",
        // Additional user fields
        gender: "",
        date_of_birth: "",
        phone: "",
        address: "",
        avatar_url: ""
      });
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to save user:", error);
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra";
      toast.error(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Phần Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-slate-900">
                Quản lý người dùng
              </h1>
              <p className="text-slate-600">
                Quản lý tài khoản và phân quyền người dùng trong hệ thống
              </p>
            </div>
            <button
              onClick={handleAddUser}
              disabled={loading}
              className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              {loading ? "Đang tải..." : "Thêm người dùng"}
            </button>
          </div>
        </div>

        {/* Bảng dữ liệu chính */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-slate-400"
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
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Họ tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-indigo-600"></div>
                        <p className="text-slate-600 font-medium">Đang tải dữ liệu...</p>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-slate-600 font-medium">Không tìm thấy người dùng nào</p>
                        <p className="text-slate-500 text-sm">Thử thay đổi điều kiện tìm kiếm</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                              <span className="text-sm font-semibold text-white">
                                {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">
                              {user.full_name || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600">
                          {user.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                          {getRoleDisplayName(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 transition-colors p-1"
                            title="Chỉnh sửa"
                            onClick={() => handleEditUser(user._id)}
                          >
                            <EditOutlined style={{ fontSize: "18px" }} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 transition-colors p-1"
                            title="Xóa"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <DeleteOutlined style={{ fontSize: "18px" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Thêm/Sửa User */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Nhập họ tên"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Nhập email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Vai trò
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="student">Sinh viên</option>
                    <option value="teacher">Giảng viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                  <p className="mt-1 text-xs text-slate-500">
                    {formData.role === 'student' && 'Các trường thông tin sinh viên sẽ được hiển thị bên dưới'}
                    {formData.role === 'teacher' && 'Các trường thông tin giảng viên sẽ được hiển thị bên dưới'}
                    {formData.role === 'admin' && 'Chỉ các thông tin cơ bản của người dùng'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mật khẩu {editingUser && "(để trống nếu không đổi)"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingUser}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder={editingUser ? "Nhập mật khẩu mới (nếu muốn đổi)" : "Nhập mật khẩu"}
                  />
                </div>
              </div>

              {/* Student-specific fields - only show when role is student */}
              {formData.role === 'student' && (
                <>
                  <div className="border-t border-slate-200 pt-4">
                    <h3 className="text-sm font-medium text-slate-900 mb-4">Thông tin sinh viên</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Lớp hành chính
                      </label>
                      <input
                        type="text"
                        name="administrative_class"
                        value={formData.administrative_class}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="VD: 12A1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Trạng thái
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value="studying">Đang học</option>
                        <option value="reserved">Bảo lưu</option>
                        <option value="leave">Nghỉ</option>
                        <option value="graduated">Tốt nghiệp</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Năm nhập học
                      </label>
                      <input
                        type="number"
                        name="year_of_admission"
                        value={formData.year_of_admission}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="VD: 2023"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Năm học
                      </label>
                      <input
                        type="text"
                        name="academic_year"
                        value={formData.academic_year}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="VD: 2023-2024"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Khoa (ID)
                      </label>
                      <input
                        type="text"
                        name="faculty_id"
                        value={formData.faculty_id}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="ID Khoa"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Bộ môn (ID)
                      </label>
                      <input
                        type="text"
                        name="department_id"
                        value={formData.department_id}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="ID Bộ môn"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Cố vấn (ID)
                      </label>
                      <input
                        type="text"
                        name="advisor_id"
                        value={formData.advisor_id}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="ID Giảng viên"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Teacher-specific fields - only show when role is teacher */}
              {formData.role === 'teacher' && (
                <>
                  <div className="border-t border-slate-200 pt-4">
                    <h3 className="text-sm font-medium text-slate-900 mb-4">Thông tin giảng viên</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Chức vụ
                      </label>
                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value="">Chọn chức vụ</option>
                        <option value="Giảng viên">Giảng viên</option>
                        <option value="Phó giáo sư">Phó giáo sư</option>
                        <option value="Giáo sư">Giáo sư</option>
                        <option value="Trưởng bộ môn">Trưởng bộ môn</option>
                        <option value="Phó trưởng khoa">Phó trưởng khoa</option>
                        <option value="Trưởng khoa">Trưởng khoa</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Học vị
                      </label>
                      <select
                        name="degree"
                        value={formData.degree}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value="">Chọn học vị</option>
                        <option value="Cử nhân">Cử nhân</option>
                        <option value="Thạc sĩ">Thạc sĩ</option>
                        <option value="Tiến sĩ">Tiến sĩ</option>
                        <option value="Phó giáo sư">Phó giáo sư</option>
                        <option value="Giáo sư">Giáo sư</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Chuyên môn
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="VD: Công nghệ phần mềm, Khoa học máy tính..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Khoa (ID)
                      </label>
                      <input
                        type="text"
                        name="faculty_id"
                        value={formData.faculty_id}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="ID Khoa"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Bộ môn (ID)
                      </label>
                      <input
                        type="text"
                        name="department_id"
                        value={formData.department_id}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="ID Bộ môn"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Additional user fields */}
              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-sm font-medium text-slate-900 mb-4">Thông tin cá nhân</h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Nhập địa chỉ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Nhập URL ảnh đại diện (không bắt buộc)"
                  />
                </div>

                <div></div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitLoading}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? "Đang xử lý..." : (editingUser ? "Cập nhật" : "Thêm mới")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xác nhận xóa */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-red-600">
                Xác nhận xóa
              </h2>
            </div>

            <div className="p-6">
              <p className="text-slate-700 mb-4">
                Bạn có chắc chắn muốn xóa người dùng <strong className="text-slate-900">{userToDelete.full_name}</strong>?
              </p>
              <p className="text-sm text-slate-500 mb-6">
                Thao tác này không thể hoàn tác.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={submitLoading}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={submitLoading}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}