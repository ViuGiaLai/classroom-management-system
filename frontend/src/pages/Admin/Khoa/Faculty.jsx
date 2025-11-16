import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getFaculties, deleteFaculty, updateFaculty, createFaculty } from "@/api/facultyApi";
import { ApartmentOutlined, EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
import FacultyModal from "./components/FacultyModal";
import FacultyForm from "./components/FacultyForm";
import DeleteModal from "./components/DeleteModal";

export default function DepartmentsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Tất cả");
  const [faculties, setFaculties] = useState([]);
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

  const filteredData = useMemo(() => {
    return faculties.filter((f) => {
      const q = query.toLowerCase();
      const matchQuery = q
        ? f.name.toLowerCase().includes(q) || f.id.toLowerCase().includes(q)
        : true;
      const matchStatus = status === "Tất cả" ? true : f.status === status;
      return matchQuery && matchStatus;
    });
  }, [faculties, query, status]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Đang hoạt động":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      case "Tạm dừng":
        return "bg-amber-50 text-amber-700 ring-amber-600/20";
      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
  };

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
    setIsEdit(true);
    setCurrentFaculty(faculty);
    setFormData({
      name: faculty.name || '',
      code: faculty.code || '',
      head_of_faculty: faculty.head_of_faculty || '',
      phone: faculty.phone || '',
      email: faculty.email || '',
      address: faculty.address || '',
      status: faculty.status || 'Đang hoạt động',
      description: faculty.description || ''
    });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setIsEdit(false);
    setCurrentFaculty(null);
    setFormData({
      name: '',
      code: '',
      head_of_faculty: '',
      phone: '',
      email: '',
      address: '',
      status: 'Đang hoạt động',
      description: ''
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
    setFormData({});
    setCurrentFaculty(null);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative md:col-span-2">
                  <SearchOutlined className="absolute left-4 top-3.5 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm theo mã, tên khoa..."
                    className="w-full rounded-xl border-gray-300 bg-white pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-xl border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                >
                  <option>Tất cả trạng thái</option>
                  <option>Đang hoạt động</option>
                  <option>Tạm dừng</option>
                </select>
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
                      Trưởng khoa
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Số giảng viên
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Chương trình
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((d) => (
                    <tr
                      key={d.id}
                      className="hover:bg-gray-50/80 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                              <span className="text-sm font-bold leading-none text-white">
                                {d.id}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {d.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{d.head}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <TeamOutlined className="h-4 w-4 mr-1.5 text-gray-400" />
                          {d.lecturers}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <BookOutlined className="h-4 w-4 mr-1.5 text-gray-400" />
                          {d.programs}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClass(
                            d.status
                          )}`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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