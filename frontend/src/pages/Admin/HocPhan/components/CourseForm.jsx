import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getDepartments } from '@/api/departmentApi';

export default function CourseForm({ formData, setFormData, isEdit }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoading(true);
        const response = await getDepartments();
        setDepartments(response.data || []);
      } catch (error) {
        toast.error('Không thể tải danh sách bộ môn');
        console.error('Error loading departments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
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
            Tên học phần <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            placeholder="Nhập tên học phần"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mã học phần <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="code"
            value={formData.code || ''}
            onChange={handleInputChange}
            placeholder="VD: IT101, MATH201"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bộ môn <span className="text-red-500">*</span>
          </label>
          <select
            name="department_id"
            value={formData.department_id || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Chọn bộ môn</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số tín chỉ
          </label>
          <input
            type="number"
            name="credits"
            value={formData.credits || ''}
            onChange={handleInputChange}
            placeholder="VD: 3"
            min="1"
            max="10"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số giờ lý thuyết
          </label>
          <input
            type="number"
            name="theory_hours"
            value={formData.theory_hours || ''}
            onChange={handleInputChange}
            placeholder="VD: 30"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số giờ thực hành
          </label>
          <input
            type="number"
            name="lab_hours"
            value={formData.lab_hours || ''}
            onChange={handleInputChange}
            placeholder="VD: 15"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Học kỳ
          </label>
          <select
            name="semester"
            value={formData.semester || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Chọn học kỳ</option>
            <option value="1">Học kỳ 1</option>
            <option value="2">Học kỳ 2</option>
            <option value="3">Học kỳ 3</option>
            <option value="4">Học kỳ 4</option>
            <option value="5">Học kỳ 5</option>
            <option value="6">Học kỳ 6</option>
            <option value="7">Học kỳ 7</option>
            <option value="8">Học kỳ 8</option>
          </select>
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
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          placeholder="Mô tả về học phần"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
