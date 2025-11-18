import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getFaculties } from '@/api/facultyApi';
import { BookOutlined, ApartmentOutlined } from '@ant-design/icons';

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
                <option key={faculty._id || faculty.id} value={faculty._id || faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
