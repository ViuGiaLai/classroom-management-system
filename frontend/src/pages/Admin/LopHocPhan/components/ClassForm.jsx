import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getCourses } from '@/api/course';
import { getTeachers } from '@/api/teacherApi';

export default function ClassForm({ formData, setFormData, isEdit }) {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [coursesRes, teachersRes] = await Promise.all([
          getCourses(),
          getTeachers()
        ]);
        setCourses(coursesRes.data || []);
        setTeachers(teachersRes.data || []);
      } catch (error) {
        toast.error('Không thể tải dữ liệu');
        console.error('Error loading form data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Học phần <span className="text-red-500">*</span>
          </label>
          <select
            name="course_id"
            value={formData.course_id || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Chọn học phần</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.code} - {course.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giảng viên <span className="text-red-500">*</span>
          </label>
          <select
            name="lecturer_id"
            value={formData.lecturer_id || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Chọn giảng viên</option>
            {teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.user_id?.full_name || teacher.full_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Học kỳ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="semester"
            value={formData.semester || ''}
            onChange={handleInputChange}
            placeholder="VD: 20231"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Năm <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="year"
            value={formData.year || ''}
            onChange={handleInputChange}
            placeholder="VD: 2023"
            min="2020"
            max="2030"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sĩ số tối đa <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="max_capacity"
            value={formData.max_capacity || 40}
            onChange={handleInputChange}
            min="1"
            max="200"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            name="status"
            value={formData.status || 'Đang hoạt động'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Đang hoạt động" key="active">Đang hoạt động</option>
            <option value="Tạm dừng" key="paused">Tạm dừng</option>
            <option value="Đã kết thúc" key="finished">Đã kết thúc</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lịch học
        </label>
        <input
          type="text"
          name="schedule"
          value={formData.schedule || ''}
          onChange={handleInputChange}
          placeholder="VD: Thứ 2, 7:00-9:30, Phòng A101"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
