import { useState, useEffect } from "react";
import { getFaculties } from "@/api/facultyApi";
import { getDepartments } from "@/api/departmentApi";
import { getTeachers } from "@/api/teacherApi";

const StudentFields = ({ formData, handleInputChange }) => {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [facultiesRes, departmentsRes, teachersRes] = await Promise.all([
          getFaculties(),
          getDepartments(),
          getTeachers()
        ]);

        setFaculties(facultiesRes.data || []);
        setDepartments(departmentsRes.data || []);
        setAdvisors(teachersRes.data || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter departments by faculty
  const filteredDepartments = formData.faculty_id 
    ? departments.filter(
        dept => dept.faculty_id?._id === formData.faculty_id || dept.faculty_id === formData.faculty_id
      )
    : departments;

  if (formData.role !== 'student') return null;

  return (
    <>
      <div className="border-t border-slate-200 pt-4">
        <h3 className="text-sm font-medium text-slate-900 mb-4">Thông tin sinh viên</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Khoa
          </label>
          <select
            name="faculty_id"
            value={formData.faculty_id}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Chọn khoa</option>
            {faculties.map((faculty) => (
              <option key={faculty._id} value={faculty._id}>
                {faculty.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bộ môn
          </label>
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Chọn bộ môn</option>
            {filteredDepartments.map((department) => (
              <option key={department._id} value={department._id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Cố vấn học tập
          </label>
          <select
            name="advisor_id"
            value={formData.advisor_id}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Chọn cố vấn</option>
            {advisors.map((advisor) => (
              <option key={advisor._id} value={advisor._id}>
                {advisor.user_id?.full_name || advisor.teacher_code}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Lớp hành chính
          </label>
          <input
            type="text"
            name="administrative_class"
            value={formData.administrative_class}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="VD: ST23D"
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
            className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="active">Đang học</option>
            <option value="reserved">Bảo lưu</option>
            <option value="leave">Nghỉ</option>
            <option value="graduated">Tốt nghiệp</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default StudentFields;