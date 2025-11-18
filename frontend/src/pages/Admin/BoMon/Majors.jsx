import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
import { getMajors, createMajor, updateMajor, deleteMajor, getMajorClasses, assignClassToMajor, removeClassFromMajor } from '@/api/majorApi';
import { getCourseClasses } from '@/api/ClassApi';
import MajorModal from "./components/MajorModal";
import MajorForm from "./components/MajorForm";

export default function MajorsPage() {
  const [query, setQuery] = useState("");
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentMajor, setCurrentMajor] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Class assignment states
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Load majors from API
  useEffect(() => {
    const loadMajors = async () => {
      try {
        setLoading(true);
        const response = await getMajors();
        setMajors(response.data || []);
      } catch (error) {
        toast.error("Không thể tải danh sách chuyên ngành");
        console.error("Error loading majors:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMajors();
  }, []);

  const filteredData = useMemo(() => {
    return majors.filter((m) => {
      const q = query.toLowerCase();
      const matchQuery = q
        ? m.name.toLowerCase().includes(q) || (m._id || m.id).toString().toLowerCase().includes(q)
        : true;
      return matchQuery;
    });
  }, [majors, query]);

  const handleDelete = async (major) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chuyên ngành này?")) {
      return;
    }

    try {
      await deleteMajor(major._id || major.id);
      toast.success("Xóa chuyên ngành thành công");
      // Reload majors list
      try {
        const response = await getMajors();
        setMajors(response.data || []);
      } catch (reloadError) {
        console.error('Error reloading majors after delete:', reloadError);
        toast.warning('Xóa thành công nhưng không thể tải lại danh sách');
      }
    } catch (error) {
      toast.error("Không thể xóa chuyên ngành");
      console.error("Error deleting major:", error);
    }
  };

  const handleEdit = (major) => {
    setIsEdit(true);
    setCurrentMajor(major);
    setFormData({
      name: major.name || '',
      faculty_id: major.faculty_id?._id || major.faculty_id || ''
    });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setIsEdit(false);
    setCurrentMajor(null);
    setFormData({
      name: '',
      faculty_id: ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      console.log('Submitting form data:', formData);
      console.log('Is edit mode:', isEdit);
      console.log('Current major:', currentMajor);
      
      // Validate required fields
      if (!formData.name || !formData.faculty_id) {
        toast.error('Vui lòng điền đầy đủ tên bộ môn và chọn khoa');
        return;
      }

      if (isEdit && currentMajor) {
        const majorId = currentMajor._id || currentMajor.id;
        console.log('Updating major with ID:', majorId);
        await updateMajor(majorId, formData);
        toast.success('Cập nhật bộ môn thành công');
      } else {
        console.log('Creating new major with data:', formData);
        await createMajor(formData);
        toast.success('Tạo bộ môn thành công');
      }

      // Reload data
      try {
        const response = await getMajors();
        setMajors(response.data || []);
      } catch (reloadError) {
        console.error('Error reloading majors:', reloadError);
        toast.warning('Thao tác thành công nhưng không thể tải lại danh sách');
      }
      
      setModalOpen(false);
      setFormData({});
    } catch (error) {
      console.error('Error saving major - Full error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      toast.error(isEdit ? 'Không thể cập nhật bộ môn' : 'Không thể tạo bộ môn');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({});
    setCurrentMajor(null);
  };

  // Class assignment functions
  const handleOpenClassModal = async (major) => {
    try {
      setSelectedMajor(major);
      setLoadingClasses(true);
      
      // Load all available classes and assigned classes
      const [allClassesRes, assignedClassesRes] = await Promise.all([
        getCourseClasses(),
        getMajorClasses(major._id || major.id)
      ]);
      
      const allClasses = allClassesRes.data || [];
      const assigned = assignedClassesRes.data || [];
      
      // Filter out already assigned classes
      const available = allClasses.filter(cls => 
        !assigned.some(assigned => assigned._id === cls._id)
      );
      
      setAvailableClasses(available);
      setAssignedClasses(assigned);
      setClassModalOpen(true);
    } catch (error) {
      toast.error('Không thể tải danh sách lớp học phần');
      console.error('Error loading classes:', error);
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleCloseClassModal = () => {
    setClassModalOpen(false);
    setSelectedMajor(null);
    setAvailableClasses([]);
    setAssignedClasses([]);
    setSelectedClass('');
  };

  const handleAssignClass = async () => {
    if (!selectedClass || !selectedMajor) {
      toast.error('Vui lòng chọn lớp học phần');
      return;
    }

    try {
      await assignClassToMajor(selectedMajor._id || selectedMajor.id, selectedClass);
      
      // Refresh assigned classes
      const assignedClassesRes = await getMajorClasses(selectedMajor._id || selectedMajor.id);
      const assigned = assignedClassesRes.data || [];
      
      // Update available classes
      const updatedAvailable = availableClasses.filter(cls => cls._id !== selectedClass);
      
      setAssignedClasses(assigned);
      setAvailableClasses(updatedAvailable);
      setSelectedClass('');
      
      toast.success('Gán lớp học phần thành công');
    } catch (error) {
      toast.error('Không thể gán lớp học phần');
      console.error('Error assigning class:', error);
    }
  };

  const handleRemoveClass = async (classId) => {
    if (!selectedMajor) return;

    try {
      await removeClassFromMajor(selectedMajor._id || selectedMajor.id, classId);
      
      // Refresh assigned classes
      const assignedClassesRes = await getMajorClasses(selectedMajor._id || selectedMajor.id);
      const assigned = assignedClassesRes.data || [];
      
      // Add removed class back to available classes
      const removedClass = assignedClasses.find(cls => cls._id === classId);
      if (removedClass) {
        setAvailableClasses(prev => [...prev, removedClass]);
      }
      
      setAssignedClasses(assigned);
      
      toast.success('Gỡ lớp học phần thành công');
    } catch (error) {
      toast.error('Không thể gỡ lớp học phần');
      console.error('Error removing class:', error);
    }
  };

  return (
    // Thêm nền gradient tinh tế cho toàn bộ trang
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Phần Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Quản lý chuyên ngành
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Danh sách chuyên ngành, khoa, số học phần và sinh viên
            </p>
          </div>
          <button onClick={handleAdd} className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <PlusOutlined className="h-5 w-5 mr-2" />
            Thêm chuyên ngành
          </button>
        </div>

        {/* Bảng dữ liệu chính */}
        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50/50">
            <div className="relative">
              <SearchOutlined className="absolute left-4 top-3.5 text-gray-400 pointer-events-none z-10" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo mã, tên chuyên ngành..."
                className="w-full rounded-xl border-gray-300 bg-white pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/70 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thông tin
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thuộc khoa
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Số sinh viên
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((m) => (
                  <tr
                    key={m._id || m.id}
                    className="hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center">
                            <span className="text-sm font-bold leading-none text-white">
                              {(m._id || m.id).toString().slice(-6)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {m.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {m.faculty_id?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <TeamOutlined className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="font-medium">{m.student_count || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenClassModal(m)}
                          className="text-green-600 hover:text-green-800 transition-colors duration-150"
                          title="Gán lớp học phần"
                        >
                          <BookOutlined className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(m)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                          title="Chỉnh sửa"
                        >
                          <EditOutlined className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(m)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-150"
                          title="Xóa"
                        >
                          <DeleteOutlined className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <MajorModal
          isOpen={modalOpen}
          onClose={closeModal}
          title={isEdit ? "Chỉnh sửa chuyên ngành" : "Thêm chuyên ngành mới"}
          onSubmit={handleSubmit}
          submitting={submitting}
        >
          <MajorForm 
            formData={formData} 
            setFormData={setFormData}
            isEdit={isEdit}
          />
        </MajorModal>

        {/* Class Assignment Modal */}
        {classModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleCloseClassModal}
              ></div>
              
              {/* Modal */}
              <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Gán lớp học phần - {selectedMajor?.name}
                    </h3>
                    <button
                      onClick={handleCloseClassModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <span className="text-2xl">&times;</span>
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  {loadingClasses ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500">Đang tải dữ liệu...</div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Assign new class */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-3">Gán lớp học phần mới</h4>
                        <div className="flex gap-3">
                          <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Chọn lớp học phần...</option>
                            {availableClasses.map((cls) => (
                              <option key={cls._id} value={cls._id}>
                                {cls.course_id?.title} - {cls.lecturer_id?.user_id?.full_name || cls.lecturer_id?.full_name} ({cls.semester} {cls.year})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={handleAssignClass}
                            disabled={!selectedClass}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                          >
                            Gán
                          </button>
                        </div>
                      </div>

                      {/* Assigned classes */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-3">Lớp học phần đã gán</h4>
                        {assignedClasses.length === 0 ? (
                          <div className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                            Chưa có lớp học phần nào được gán
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {assignedClasses.map((cls) => (
                              <div key={cls._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {cls.course_id?.title || cls.course_id?.code}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Giảng viên: {cls.lecturer_id?.user_id?.full_name || cls.lecturer_id?.full_name} | 
                                    Học kỳ: {cls.semester} {cls.year}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveClass(cls._id)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                  <DeleteOutlined className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}