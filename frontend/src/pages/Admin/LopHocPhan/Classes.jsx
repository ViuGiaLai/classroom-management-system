import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCourseClasses, deleteCourseClass, updateCourseClass, createCourseClass } from "@/api/ClassApi";
import { TeamOutlined, EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import ClassModal from "./components/ClassModal";
import ClassForm from "./components/ClassForm";

export default function ClassesPage() {
  const [query, setQuery] = useState("");
  const [semester, setSemester] = useState("Tất cả");
  const [status, setStatus] = useState("Tất cả");
  const [courseClasses, setCourseClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load course classes from API
  useEffect(() => {
    const loadCourseClasses = async () => {
      try {
        setLoading(true);
        const response = await getCourseClasses();
        setCourseClasses(response.data || []);
      } catch (error) {
        toast.error("Không thể tải danh sách lớp học phần");
        console.error("Error loading course classes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourseClasses();
  }, []);

  const filteredData = useMemo(() => {
    return courseClasses.filter((c) => {
      const q = query.toLowerCase();
      const matchQuery = q
        ? c.name.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.course_id.toLowerCase().includes(q)
        : true;
      const matchSemester = semester === "Tất cả" ? true : c.semester === semester;
      const matchStatus = status === "Tất cả" ? true : c.status === status;
      return matchQuery && matchSemester && matchStatus;
    });
  }, [courseClasses, query, semester, status]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Đang học":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      case "Đã kết thúc":
        return "bg-slate-50 text-slate-700 ring-slate-600/20";
      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
  };

  const handleDelete = async (classId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lớp học phần này?")) {
      return;
    }

    try {
      await deleteCourseClass(classId);
      toast.success("Xóa lớp học phần thành công");
      // Reload course classes list
      const response = await getCourseClasses();
      setCourseClasses(response.data || []);
    } catch (error) {
      toast.error("Không thể xóa lớp học phần");
      console.error("Error deleting course class:", error);
    }
  };

  const handleEdit = (courseClass) => {
    setIsEdit(true);
    setCurrentClass(courseClass);
    setFormData({
      course_id: courseClass.course_id || '',
      lecturer_id: courseClass.lecturer_id || '',
      semester: courseClass.semester || '',
      year: courseClass.year || '',
      max_capacity: courseClass.max_capacity || 40,
      status: courseClass.status || 'Đang hoạt động',
      schedule: courseClass.schedule || ''
    });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setIsEdit(false);
    setCurrentClass(null);
    setFormData({
      course_id: '',
      lecturer_id: '',
      semester: '',
      year: new Date().getFullYear(),
      max_capacity: 40,
      status: 'Đang hoạt động',
      schedule: ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Validate required fields
      if (!formData.course_id || !formData.lecturer_id || !formData.semester || !formData.year) {
        toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
        return;
      }

      if (isEdit && currentClass) {
        await updateCourseClass(currentClass.id, formData);
        toast.success('Cập nhật lớp học phần thành công');
      } else {
        await createCourseClass(formData);
        toast.success('Tạo lớp học phần thành công');
      }

      // Reload data
      const response = await getCourseClasses();
      setCourseClasses(response.data || []);
      
      setModalOpen(false);
      setFormData({});
    } catch (error) {
      toast.error(isEdit ? 'Không thể cập nhật lớp học phần' : 'Không thể tạo lớp học phần');
      console.error('Error saving course class:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({});
    setCurrentClass(null);
  };

  return (
    // Thêm nền gradient tinh tế cho toàn bộ trang
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Phần Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Quản lý lớp học phần
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Theo dõi lớp học phần theo học kỳ, giảng viên và sĩ số
            </p>
          </div>
          <button 
            onClick={handleAdd}
            className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusOutlined className="h-5 w-5 mr-2" />
            Tạo lớp học phần
          </button>
        </div>

        {/* Bảng dữ liệu chính */}
        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <SearchOutlined className="absolute left-4 top-3.5 text-gray-400 pointer-events-none z-10" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm theo mã lớp, học phần, giảng viên..."
                  className="w-full rounded-xl border-gray-300 bg-white pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="rounded-xl border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              >
                <option>Tất cả học kỳ</option>
                <option>HK1/2024</option>
                <option>HK2/2023</option>
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              >
                <option>Tất cả trạng thái</option>
                <option>Đang học</option>
                <option>Đã kết thúc</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/70 border-b border-gray-200">
                <tr>
                  {/* Gộp hai cột thành một cột "Thông tin" */}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thông tin
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Giảng viên
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Học kỳ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sĩ số
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
                {filteredData.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    {/* Cột "Thông tin" đã được gộp và cấu trúc lại */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                            <span className="text-sm font-bold leading-none text-white">
                              {c.id.split("-").pop()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {c.course}
                          </div>
                          <div className="text-xs text-gray-500">{c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {c.lecturer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {c.semester}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <TeamOutlined className="h-4 w-4 mr-1.5 text-gray-400" />
                        {c.students}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClass(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-blue-600 hover:text-blue-800 mr-4 transition-colors duration-150"
                        title="Chỉnh sửa"
                      >
                        <EditOutlined className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
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
      </div>

      {/* Modal for Add/Edit */}
      <ClassModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={isEdit ? 'Chỉnh sửa lớp học phần' : 'Thêm lớp học phần mới'}
        onSubmit={handleSubmit}
        loading={submitting}
      >
        <ClassForm 
          formData={formData} 
          setFormData={setFormData} 
          isEdit={isEdit}
        />
      </ClassModal>
    </div>
  );
}
