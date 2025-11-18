import { useState, useEffect } from "react";
import { getFaculties } from "@/api/facultyApi";
import { getDepartments } from "@/api/departmentApi";

const TeacherFields = ({ formData, handleInputChange }) => {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [facultiesRes, departmentsRes] = await Promise.all([
          getFaculties(),
          getDepartments()
        ]);

        setFaculties(facultiesRes.data || []);
        setDepartments(departmentsRes.data || []);
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

  // Handle change and auto-update faculty when department is selected
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'department_id' && value) {
      const selectedDept = departments.find(dept => dept._id === value);
      if (selectedDept && selectedDept.faculty_id) {
        const facultyId = selectedDept.faculty_id._id || selectedDept.faculty_id;
        handleInputChange({ target: { name: 'department_id', value } });
        handleInputChange({ target: { name: 'faculty_id', value: facultyId } });
        return;
      }
    }
    
    handleInputChange(e);
  };

  if (formData.role !== 'teacher') return null;

  return (
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
            className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Chọn học vị</option>
            <option value="Cử nhân">Cử nhân</option>
            <option value="Thạc sĩ">Thạc sĩ</option>
            <option value="Tiến sĩ">Tiến sĩ</option>
            <option value="Phó giáo sư">Phó giáo sư</option>
            <option value="Giáo sư">Giáo sư</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Khoa
          </label>
          <select
            name="faculty_id"
            value={formData.faculty_id}
            onChange={handleFieldChange}
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
            onChange={handleFieldChange}
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
          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="VD: Công nghệ phần mềm, Khoa học máy tính..."
        />
      </div>
    </>
  );
};

export default TeacherFields;