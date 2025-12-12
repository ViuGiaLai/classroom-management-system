import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getCourses } from '@/api/course';
import { getTeachers } from '@/api/teacherApi';
import { Select, Input, Row, Col } from 'antd';
const { Option } = Select;

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

  const handleScheduleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const weekDays = [
    { value: 'Thứ 2', label: 'Thứ 2' },
    { value: 'Thứ 3', label: 'Thứ 3' },
    { value: 'Thứ 4', label: 'Thứ 4' },
    { value: 'Thứ 5', label: 'Thứ 5' },
    { value: 'Thứ 6', label: 'Thứ 6' },
    { value: 'Thứ 7', label: 'Thứ 7' },
    { value: 'Chủ nhật', label: 'Chủ nhật' },
  ];

  // Auto-generate the schedule string when any schedule field changes
  useEffect(() => {
    const { schedule_day, schedule_time, schedule_room } = formData;
    if (schedule_day && schedule_time) {
      const room = schedule_room ? `, Phòng ${schedule_room}` : '';
      const schedule = `${schedule_day}, ${schedule_time}${room}`;
      setFormData(prev => ({
        ...prev,
        schedule
      }));
    }
  }, [formData.schedule_day, formData.schedule_time, formData.schedule_room]);

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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lịch học <span className="text-red-500">*</span>
        </label>
        <Row gutter={8} className="mb-2">
          <Col span={8}>
            <Select
              placeholder="Thứ"
              className="w-full"
              value={formData.schedule_day || undefined}
              onChange={(value) => handleScheduleChange('schedule_day', value)}
              options={weekDays}
            />
          </Col>
          <Col span={8}>
            <Input
              placeholder="Giờ học (VD: 7:00-9:30)"
              value={formData.schedule_time || ''}
              onChange={(e) => handleScheduleChange('schedule_time', e.target.value)}
            />
          </Col>
          <Col span={8}>
            <Input
              placeholder="Phòng (VD: A101)"
              value={formData.schedule_room || ''}
              onChange={(e) => handleScheduleChange('schedule_room', e.target.value)}
            />
          </Col>
        </Row>
        <div className="text-xs text-gray-500 mt-1">
          {formData.schedule || 'Chưa có lịch học'}
        </div>
      </div>
    </div>
  );
}
