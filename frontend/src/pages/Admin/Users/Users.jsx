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

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      full_name: "",
      email: "",
      role: "student",
      password: "",
      administrative_class: "",
      faculty_id: "",
      department_id: "",
      advisor_id: "",
      status: "studying",
      year_of_admission: new Date().getFullYear(),
      academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      position: "",
      degree: "",
      specialization: "",
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
        administrative_class: "",
        faculty_id: "",
        department_id: "",
        advisor_id: "",
        status: "studying",
        year_of_admission: new Date().getFullYear(),
        academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        position: "",
        degree: "",
        specialization: "",
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
