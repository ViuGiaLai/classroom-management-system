import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getMajors, deleteMajor, updateMajor, createMajor } from "@/api/majorApi";
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
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
        ? m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q)
        : true;
      return matchQuery;
    });
  }, [majors, query]);

  const handleDelete = async (majorId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chuyên ngành này?")) {
      return;
    }

    try {
      await deleteMajor(majorId);
      toast.success("Xóa chuyên ngành thành công");
      // Reload majors list
      const response = await getMajors();
      setMajors(response.data || []);
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
      
      // Validate required fields
      if (!formData.name || !formData.faculty_id) {
        toast.error('Vui lòng điền đầy đủ tên bộ môn và chọn khoa');
        return;
      }

      if (isEdit && currentMajor) {
        await updateMajor(currentMajor.id, formData);
        toast.success('Cập nhật bộ môn thành công');
      } else {
        await createMajor(formData);
        toast.success('Tạo bộ môn thành công');
      }

      // Reload data
      const response = await getMajors();
      setMajors(response.data || []);
      
      setModalOpen(false);
      setFormData({});
    } catch (error) {
      toast.error(isEdit ? 'Không thể cập nhật bộ môn' : 'Không thể tạo bộ môn');
      console.error('Error saving major:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({});
    setCurrentMajor(null);
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
                    Khoa
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Số sinh viên
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center">
                            <span className="text-sm font-bold leading-none text-white">
                              {m.id}
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(m)}
                        className="text-blue-600 hover:text-blue-800 mr-4 transition-colors duration-150"
                        title="Chỉnh sửa"
                      >
                        <EditOutlined className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
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
      </div>
    </div>
  );
}