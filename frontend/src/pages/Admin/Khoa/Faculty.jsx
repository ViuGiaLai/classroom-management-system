import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getFaculties, deleteFaculty, updateFaculty, createFaculty } from "@/api/facultyApi";
import { getDepartments } from "@/api/departmentApi";
import { ApartmentOutlined, EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, BookOutlined } from '@ant-design/icons';
import FacultyModal from "./components/FacultyModal";
import FacultyForm from "./components/FacultyForm";
import DeleteModal from "./components/DeleteModal";

export default function DepartmentsPage() {
  const [query, setQuery] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]); // Add state for departments
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  // Load faculties from API
  useEffect(() => {
    const loadFaculties = async () => {
      try {
        setLoading(true);
        const response = await getFaculties();
        setFaculties(response.data || []);
      } catch (error) {
        toast.error("Không thể tải danh sách khoa");
        console.error("Error loading faculties:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFaculties();
  }, []);

  // Load departments from API
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await getDepartments();
        setDepartments(response.data || []);
      } catch (error) {
        console.error("Error loading departments:", error);
      }
    };

    loadDepartments();
  }, []);

  // Function to get departments count for a faculty
  const getDepartmentsCount = (facultyId) => {
    return departments.filter(dept => dept.faculty_id?._id === facultyId || dept.faculty_id === facultyId).length;
  };

  // Function to get departments list for a faculty
  const getDepartmentsList = (facultyId) => {
    return departments.filter(dept => dept.faculty_id?._id === facultyId || dept.faculty_id === facultyId);
  };

  const filteredData = useMemo(() => {
    return faculties.filter((f) => {
      const q = query.toLowerCase();
      const matchQuery = q
        ? f.name.toLowerCase().includes(q) || f.code.toLowerCase().includes(q)
        : true;
      return matchQuery;
    });
  }, [faculties, query]);

  // CRUD operations
  const handleDelete = (faculty) => {
    setFacultyToDelete(faculty);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!facultyToDelete) return;
    
    try {
      const facultyId = facultyToDelete._id || facultyToDelete.id;
      if (!facultyId) {
        toast.error("Không tìm thấy ID khoa để xóa");
        return;
      }
      await deleteFaculty(facultyId);
      toast.success("Xóa khoa thành công");
      const response = await getFaculties();
      setFaculties(response.data || []);
    } catch (error) {
      toast.error("Không thể xóa khoa");
      console.error("Delete error:", error);
    } finally {
      setDeleteModalOpen(false);
      setFacultyToDelete(null);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setFacultyToDelete(null);
  };

  const handleEdit = (faculty) => {
    console.log('Editing faculty:', faculty);
    setIsEdit(true);
    setCurrentFaculty(faculty);
    const newFormData = {
      name: faculty.name || '',
      code: faculty.code || ''
    };
    console.log('Setting formData to:', newFormData);
    setFormData(newFormData);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setIsEdit(false);
    setCurrentFaculty(null);
    setFormData({
      name: '',
      code: ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Validate required fields
      if (!formData.name || !formData.code) {
        toast.error('Vui lòng điền đầy đủ tên và mã khoa');
        return;
      }

      // Check for duplicate code (exclude current faculty when editing)
      // Skip validation if faculties data hasn't loaded yet
      if (faculties.length > 0) {
        console.log('Debug - faculties:', faculties);
        console.log('Debug - formData.code:', formData.code);
        console.log('Debug - isEdit:', isEdit);
        console.log('Debug - currentFaculty:', currentFaculty);
        
        const duplicateCode = faculties.find(f => 
          f.code === formData.code && (!isEdit || f._id !== currentFaculty?._id)
        );
        console.log('Debug - duplicateCode:', duplicateCode);
        
        if (duplicateCode) {
          toast.error(`Mã khoa "${formData.code}" đã tồn tại`);
          return;
        }

        // Check for duplicate name (exclude current faculty when editing)
        const duplicateName = faculties.find(f => 
          f.name === formData.name && (!isEdit || f._id !== currentFaculty?._id)
        );
        console.log('Debug - duplicateName:', duplicateName);
        
        if (duplicateName) {
          toast.error(`Tên khoa "${formData.name}" đã tồn tại`);
          return;
        }
      }

      if (isEdit && currentFaculty) {
        await updateFaculty(currentFaculty.id, formData);
        toast.success('Cập nhật khoa thành công');
      } else {
        await createFaculty(formData);
        toast.success('Tạo khoa thành công');
      }

      // Reload data
      const response = await getFaculties();
      setFaculties(response.data || []);
      
      setModalOpen(false);
      setFormData({});
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(isEdit ? `Không thể cập nhật khoa: ${errorMessage}` : `Không thể tạo khoa: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    // Only reset form data after modal is closed to avoid flickering
    setTimeout(() => {
      setFormData({});
      setCurrentFaculty(null);
    }, 300);
  };

  return (
    // Thêm nền gradient tinh tế cho toàn bộ trang
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Phần Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Quản lý khoa
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Danh sách khoa, trưởng khoa và chương trình đào tạo
            </p>
          </div>
          <button onClick={handleAdd} className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <PlusOutlined className="h-5 w-5 mr-2" />
            Thêm khoa
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Bảng dữ liệu chính */}
        {!loading && (
          <div className="bg-white rounded-2xl border border-gray-200/60 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50/50">
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <SearchOutlined className="absolute left-4 top-3.5 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm theo mã, tên khoa..."
                    className="w-full rounded-xl border-gray-300 bg-white pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/70 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thông tin khoa
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Số chuyên ngành
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((d) => (
                    <tr
                      key={d._id}
                      className="hover:bg-gray-50/80 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                              <span className="text-sm font-bold leading-none text-white">
                                {d.code}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {d.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Mã khoa: {d.code}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <BookOutlined className="h-4 w-4 text-gray-400" />
                          <div className="text-sm text-gray-900">
                            {getDepartmentsCount(d._id)} chuyên ngành
                          </div>
                        </div>
                        <div className="mt-1">
                          {getDepartmentsList(d._id).slice(0, 2).map((dept, index) => (
                            <div key={dept._id} className="text-xs text-gray-500">
                              {dept.name}
                              {index === 0 && getDepartmentsList(d._id).length > 1 && ","}
                            </div>
                          ))}
                          {getDepartmentsCount(d._id) > 2 && (
                            <div className="text-xs text-gray-400">
                              +{getDepartmentsCount(d._id) - 2} khác
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => handleEdit(d)}
                          className="text-blue-600 hover:text-blue-800 mr-4 transition-colors duration-150"
                          title="Chỉnh sửa"
                        >
                          <EditOutlined className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(d)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-150"
                          title="Xóa"
                        >
                          <DeleteOutlined className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <FacultyModal
          isOpen={modalOpen}
          onClose={closeModal}
          title={isEdit ? 'Chỉnh sửa khoa' : 'Thêm khoa mới'}
          onSubmit={handleSubmit}
          loading={submitting}
        >
          <FacultyForm 
            formData={formData} 
            setFormData={setFormData} 
            isEdit={isEdit}
          />
        </FacultyModal>

        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          itemName={facultyToDelete?.name || ''}
        />
      </div>
    </div>
  );
}