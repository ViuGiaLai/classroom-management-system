import { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Dashboard from "./Dashboard";
import UsersPage from "./Users";
import StudentsPage from "./Students";
import LecturersPage from "./Lecturers";
import DepartmentsPage from "./Departments";
import MajorsPage from "./Majors";
import ClassesPage from "./Classes";
import CoursesPage from "./Courses";
import GradesPage from "./Grades";
import ReportsPage from "./Reports";

export default function AdminLayout() {
  const [hash, setHash] = useState(() => (typeof window !== 'undefined' ? window.location.hash.replace('#', '') : 'overview'));

  useEffect(() => {
    const onHash = () => setHash(window.location.hash.replace('#', '') || 'overview');
    window.addEventListener('hashchange', onHash);
    if (!window.location.hash) window.location.hash = '#overview';
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const title = useMemo(() => {
    switch (hash) {
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
      case 'overview':
      default:
        return 'Tổng quan';
    }
  }, [hash]);

  const content = useMemo(() => {
    switch (hash) {
      case 'users':
        return <UsersPage />;
      case 'students':
        return <StudentsPage />;
      case 'lecturers':
        return <LecturersPage />;
      case 'departments':
        return <DepartmentsPage />;
      case 'majors':
        return <MajorsPage />;
      case 'classes':
        return <ClassesPage />;
      case 'courses':
        return <CoursesPage />;
      case 'grades':
        return <GradesPage />;
      case 'reports':
        return <ReportsPage />;
      case 'overview':
      default:
        return <Dashboard />;
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar title={title} />
      <div className="flex">
        <Sidebar activeKey={hash} />
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">{content}</main>
      </div>
    </div>
  );
}
