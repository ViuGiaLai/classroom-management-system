import { useState, useEffect } from "react";
import { getFaculties } from "@/api/facultyApi";
import { getDepartments } from "@/api/departmentApi";
import { getTeachers } from "@/api/teacherApi";

const StudentFields = ({ formData, handleInputChange, errors }) => {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load faculties, departments, and advisors
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
        // Filter teachers who can be advisors (assuming there's a field to identify advisors)
        setAdvisors(teachersRes.data?.filter(t => t.position?.includes('Cố vấn') || t.rank) || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <>
      {/* Student-specific fields - only show when role is student */}
      {formData.role === 'student' && (
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
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">Chọn khoa</option>
                {faculties.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
              {errors?.faculty_id && (
                <p className="text-red-500 text-xs mt-1">{errors.faculty_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bộ môn
              </label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">Chọn bộ môn</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
              {errors?.department_id && (
                <p className="text-red-500 text-xs mt-1">{errors.department_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cố vấn học tập
              </label>
              <select
                name="advisor_id"
                value={formData.advisor_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">Chọn cố vấn</option>
                {advisors.map((advisor) => (
                  <option key={advisor.id} value={advisor.id}>
                    {advisor.rank} {advisor.name}
                  </option>
                ))}
              </select>
              {errors?.advisor_id && (
                <p className="text-red-500 text-xs mt-1">{errors.advisor_id}</p>
              )}
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
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="VD: ST23D"
              />
              {errors?.administrative_class && (
                <p className="text-red-500 text-xs mt-1">{errors.administrative_class}</p>
              )}
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
        </>
      )}
    </>
  );
};

export default StudentFields;
