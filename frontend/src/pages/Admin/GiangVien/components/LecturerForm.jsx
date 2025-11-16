import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getFaculties } from '@/api/facultyApi';

export default function LecturerForm({ formData, setFormData, isEdit }) {
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
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            placeholder="Nhập họ và tên giảng viên"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mã giảng viên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="code"
            value={formData.code || ''}
            onChange={handleInputChange}
            placeholder="VD: GV001, GV002"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            placeholder="giangvien@university.edu.vn"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ''}
            onChange={handleInputChange}
            placeholder="Nhập số điện thoại"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
              <option key={faculty.id} value={faculty.id}>
                {faculty.name}
              </option>
            ))}
          </select>
        </div>

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
            <option value="Trưởng bộ môn">Trưởng bộ môn</option>
            <option value="Phó trưởng khoa">Phó trưởng khoa</option>
            <option value="Trưởng khoa">Trưởng khoa</option>
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
            <option value="Đang hoạt động">Đang hoạt động</option>
            <option value="Tạm dừng">Tạm dừng</option>
            <option value="Đã nghỉ hưu">Đã nghỉ hưu</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Địa chỉ
        </label>
        <input
          type="text"
          name="address"
          value={formData.address || ''}
          onChange={handleInputChange}
          placeholder="Nhập địa chỉ"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          placeholder="Thông tin thêm về giảng viên"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
