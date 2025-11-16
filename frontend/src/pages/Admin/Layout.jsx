import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Dashboard from "./Dashboard";
import UsersPage from "./Users/Users";
import StudentsPage from "./SinhVien/Students";
import LecturersPage from "./GiangVien/Lecturers";
import DepartmentsPage from "./Khoa/Departments";
import MajorsPage from "./ChuyenNganh/Majors";
import ClassesPage from "./LopHocPhan/Classes";
import CoursesPage from "./HocPhan/Courses";
import GradesPage from "./QuanLyDiem/Grades";
import ReportsPage from "./BaoCao/Reports";

export default function AdminLayout() {
  const location = useLocation();

  const getTitle = (pathname) => {
    const path = pathname.split('/').pop();
    switch (path) {
      case 'users':
        return 'Người dùng';
      case 'students':
        return 'Sinh viên';
      case 'lecturers':
        return 'Giảng viên';
      case 'departments':
        return 'Khoa';
      case 'majors':
        return 'Chuyên ngành';
      case 'classes':
        return 'Lớp học phần';
      case 'courses':
        return 'Học phần';
      case 'grades':
        return 'Quản lý điểm';
      case 'reports':
        return 'Báo cáo';
      case 'dashboard':
      default:
        return 'Tổng quan';
    }
  };

  const title = getTitle(location.pathname);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeKey={location.pathname.split('/').pop()} />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <Topbar title={title} />

        {/* Page Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
