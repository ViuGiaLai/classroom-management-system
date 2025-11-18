import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllUsers } from '@/api/userApi';
import { getFaculties } from '@/api/facultyApi';
import { getDepartments } from '@/api/departmentApi';

export default function LecturerForm({ formData, setFormData, isEdit }) {
  const [users, setUsers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [usersRes, facultiesRes, departmentsRes] = await Promise.all([
          getAllUsers(),
          getFaculties(),
          getDepartments()
        ]);
        setUsers(usersRes.data?.filter(user => user.role === 'teacher') || []);
        setFaculties(facultiesRes.data || []);
        setDepartments(departmentsRes.data || []);
      } catch (error) {
        toast.error('Không thể tải dữ liệu');
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If department is selected, auto-update faculty_id
    if (name === 'department_id' && value) {
      const selectedDept = departments.find(dept => dept._id === value);
      if (selectedDept && selectedDept.faculty_id) {
        const facultyId = selectedDept.faculty_id._id || selectedDept.faculty_id;
        setFormData(prev => ({
          ...prev,
          [name]: value,
          faculty_id: facultyId
        }));
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter departments based on selected faculty
  const filteredDepartments = formData.faculty_id 
    ? departments.filter(
        dept => dept.faculty_id?._id === formData.faculty_id || dept.faculty_id === formData.faculty_id
      )
    : departments; // Show all departments when no faculty is selected

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Người dùng <span className="text-red-500">*</span>
        </label>
        <select
          name="user_id"
          value={formData.user_id || ''}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Chọn người dùng</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.full_name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mã giảng viên <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="teacher_code"
          value={formData.teacher_code || ''}
          onChange={handleInputChange}
          placeholder="VD: GV001, GV002"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chức vụ
          </label>
          <select
            name="position"
            value={formData.position || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Chọn chức vụ</option>
            <option value="Giảng viên">Giảng viên</option>
            <option value="Giảng viên chính">Giảng viên chính</option>
            <option value="Phó giáo sư">Phó giáo sư</option>
            <option value="Giáo sư">Giáo sư</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Học vị
          </label>
          <select
            name="degree"
            value={formData.degree || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Khoa <span className="text-red-500">*</span>
          </label>
          <select
            name="faculty_id"
            value={formData.faculty_id || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Chọn khoa</option>
            {faculties.map(faculty => (
              <option key={faculty._id} value={faculty._id}>
                {faculty.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bộ môn
          </label>
          <select
            name="department_id"
            value={formData.department_id || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Chọn bộ môn</option>
            {filteredDepartments.map(department => (
              <option key={department._id} value={department._id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Chuyên môn
        </label>
        <input
          type="text"
          name="specialization"
          value={formData.specialization || ''}
          onChange={handleInputChange}
          placeholder="VD: Lập trình, Toán ứng dụng"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Lĩnh vực chuyên môn của giảng viên (ví dụ: Lập trình web, Trí tuệ nhân tạo)</p>
      </div>
    </div>
  );
}
