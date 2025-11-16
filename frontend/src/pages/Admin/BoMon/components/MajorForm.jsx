import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getFaculties } from '@/api/facultyApi';
import { BookOutlined, PhoneOutlined, MailOutlined, TeamOutlined, UserOutlined, ApartmentOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';

export default function MajorForm({ formData, setFormData, isEdit }) {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFaculties = async () => {
      try {
        setLoading(true);
        const response = await getFaculties();
        setFaculties(response.data || []);
      } catch (error) {
        toast.error('Không thể tải danh sách khoa');
        console.error('Error loading faculties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFaculties();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên bộ môn <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <BookOutlined className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder="Nhập tên bộ môn"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mã bộ môn <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <BookOutlined className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="code"
              value={formData.code || ''}
              onChange={handleInputChange}
              placeholder="VD: CNTT, KTPM, QLTT"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Khoa <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <ApartmentOutlined className="absolute left-3 top-3 text-gray-400 pointer-events-none z-10" />
            <select
              name="faculty_id"
              value={formData.faculty_id || ''}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              required
            >
              <option value="">Chọn khoa</option>
              {faculties.map(faculty => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trưởng bộ môn
          </label>
          <div className="relative">
            <UserOutlined className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="head_of_department"
              value={formData.head_of_department || ''}
              onChange={handleInputChange}
              placeholder="Nhập tên trưởng bộ môn"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <div className="relative">
            <PhoneOutlined className="absolute left-3 top-3 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <MailOutlined className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              placeholder="bomon@university.edu.vn"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số lượng giảng viên
          </label>
          <div className="relative">
            <TeamOutlined className="absolute left-3 top-3 text-gray-400" />
            <input
              type="number"
              name="lecturer_count"
              value={formData.lecturer_count || ''}
              onChange={handleInputChange}
              placeholder="VD: 15"
              min="0"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số lượng sinh viên
          </label>
          <div className="relative">
            <TeamOutlined className="absolute left-3 top-3 text-gray-400" />
            <input
              type="number"
              name="student_count"
              value={formData.student_count || ''}
              onChange={handleInputChange}
              placeholder="VD: 200"
              min="0"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400 pointer-events-none z-10">
              {formData.status === 'Đang hoạt động' ? <CheckCircleOutlined /> : <StopOutlined />}
            </div>
            <select
              name="status"
              value={formData.status || 'Đang hoạt động'}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="Đang hoạt động">Đang hoạt động</option>
              <option value="Tạm dừng">Tạm dừng</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Địa chỉ
        </label>
        <div className="relative">
          <ApartmentOutlined className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="address"
            value={formData.address || ''}
            onChange={handleInputChange}
            placeholder="Nhập địa chỉ bộ môn"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <div className="relative">
          <BookOutlined className="absolute left-3 top-3 text-gray-400" />
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            placeholder="Mô tả về bộ môn"
            rows={3}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
