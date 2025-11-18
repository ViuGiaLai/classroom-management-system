import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { getAllUsers, createUser, updateUser, deleteUser } from "@/api/userApi";
import UserTable from "./components/UserTable";
import UserModal from "./components/UserModal";
import DeleteModal from "./components/DeleteModal";

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
    gender: "",
    date_of_birth: "",
    phone: "",
    address: "",
    // Student fields
    administrative_class: "",
    faculty_id: "",
    department_id: "",
    advisor_id: "",
    status: "studying",
    // Teacher fields
    position: "",
    degree: "",
    specialization: "",
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

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      full_name: "",
      email: "",
      role: "student",
      password: "",
      gender: "",
      date_of_birth: "",
      phone: "",
      address: "",
      administrative_class: "",
      faculty_id: "",
      department_id: "",
      advisor_id: "",
      status: "studying",
      position: "",
      degree: "",
      specialization: "",
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
        password: "",
        gender: user.gender || "",
        date_of_birth: user.date_of_birth || "",
        phone: user.phone || "",
        address: user.address || "",
        administrative_class: user.administrative_class || "",
        faculty_id: user.faculty_id || "",
        department_id: user.department_id || "",
        advisor_id: user.advisor_id || "",
        status: user.status || "studying",
        position: user.position || "",
        degree: user.degree || "",
        specialization: user.specialization || "",
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
      await loadUsers();
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
      // Validate required fields
      if (!formData.full_name.trim()) {
        toast.error("Vui lòng nhập họ tên");
        setSubmitLoading(false);
        return;
      }
      
      if (!formData.email.trim()) {
        toast.error("Vui lòng nhập email");
        setSubmitLoading(false);
        return;
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        toast.error("Email không hợp lệ");
        setSubmitLoading(false);
        return;
      }
      
      if (!formData.role) {
        toast.error("Vui lòng chọn vai trò");
        setSubmitLoading(false);
        return;
      }

      // Dữ liệu cơ bản
      const submitData = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        gender: formData.gender || "",
        date_of_birth: formData.date_of_birth || "",
        phone: formData.phone || "",
        address: formData.address || "",
      };

      // Thêm password nếu có
      if (formData.password.trim()) {
        submitData.password = formData.password.trim();
      } else if (!editingUser) {
        // Password bắt buộc khi tạo mới
        toast.error("Vui lòng nhập mật khẩu");
        setSubmitLoading(false);
        return;
      }

      // Thêm các trường theo role với validation
      if (formData.role === 'student') {
        if (!formData.faculty_id) {
          toast.error("Vui lòng chọn khoa cho sinh viên");
          setSubmitLoading(false);
          return;
        }
        submitData.administrative_class = formData.administrative_class || "";
        submitData.faculty_id = formData.faculty_id;
        submitData.department_id = formData.department_id || "";
        submitData.advisor_id = formData.advisor_id || "";
        submitData.status = formData.status || "studying";
      } else if (formData.role === 'teacher') {
        if (!formData.faculty_id) {
          toast.error("Vui lòng chọn khoa cho giảng viên");
          setSubmitLoading(false);
          return;
        }
        submitData.position = formData.position || "";
        submitData.degree = formData.degree || "";
        submitData.specialization = formData.specialization || "";
        submitData.faculty_id = formData.faculty_id;
        submitData.department_id = formData.department_id || "";
      }

      // Log data being sent for debugging
      console.log("Submitting user data:", submitData);

      if (editingUser) {
        await updateUser(editingUser._id, submitData);
        toast.success("Cập nhật người dùng thành công!");
      } else {
        await createUser(submitData);
        toast.success("Thêm người dùng thành công!");
      }

      await loadUsers();
      setIsModalOpen(false);
      setFormData({
        full_name: "",
        email: "",
        role: "student",
        password: "",
        gender: "",
        date_of_birth: "",
        phone: "",
        address: "",
        administrative_class: "",
        faculty_id: "",
        department_id: "",
        advisor_id: "",
        status: "studying",
        position: "",
        degree: "",
        specialization: "",
      });
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to save user:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      
      let errorMessage = "Có lỗi xảy ra";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 500) {
        errorMessage = "Lỗi server: Vui lòng kiểm tra lại dữ liệu hoặc liên hệ quản trị viên";
      } else if (error.response?.status === 400) {
        errorMessage = "Dữ liệu không hợp lệ: Vui lòng kiểm tra lại thông tin";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
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
          </div>
        </div>

        {/* User Table */}
        <UserTable
          users={data}
          loading={loading}
          query={query}
          setQuery={setQuery}
          handleAddUser={handleAddUser}
          handleEditUser={handleEditUser}
          handleDeleteUser={handleDeleteUser}
        />

        {/* User Modal */}
        <UserModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          editingUser={editingUser}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          submitLoading={submitLoading}
        />

        {/* Delete Confirmation Modal */}
        <DeleteModal
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          userToDelete={userToDelete}
          confirmDelete={confirmDelete}
          submitLoading={submitLoading}
        />
      </div>
    </div>
  );
}