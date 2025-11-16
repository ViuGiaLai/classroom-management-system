import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCourses, deleteCourse, updateCourse, createCourse } from "@/api/courseApi";
import { BookOutlined, EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, StarOutlined } from '@ant-design/icons';
import CourseModal from "./components/CourseModal";
import CourseForm from "./components/CourseForm";

export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("Tất cả");
  const [status, setStatus] = useState("Tất cả");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load courses from API
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const response = await getCourses();
        setCourses(response.data || []);
      } catch (error) {
        toast.error("Không thể tải danh sách học phần");
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const filteredData = useMemo(() => {
    return courses.filter((c) => {
      const q = query.toLowerCase();
      const matchQuery = q
        ? c.name.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
        : true;
      const matchDept = dept === "Tất cả" ? true : c.department === dept;
      const matchStatus = status === "Tất cả" ? true : c.status === status;
      return matchQuery && matchDept && matchStatus;
    });
  }, [courses, query, dept, status]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Đang mở":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      case "Đóng":
        return "bg-slate-50 text-slate-700 ring-slate-600/20";
      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa học phần này?")) {
      return;
    }

    try {
      await deleteCourse(courseId);
      toast.success("Xóa học phần thành công");
      // Reload courses list
      const response = await getCourses();
      setCourses(response.data || []);
    } catch (error) {
      toast.error("Không thể xóa học phần");
      console.error("Error deleting course:", error);
    }
  };

  const handleEdit = (course) => {
    setIsEdit(true);
    setCurrentCourse(course);
    setFormData({
      title: course.title || '',
      code: course.code || '',
      department_id: course.department_id || '',
      credits: course.credits || '',
      theory_hours: course.theory_hours || '',
      lab_hours: course.lab_hours || '',
      semester: course.semester || '',
      status: course.status || 'Đang hoạt động',
      description: course.description || ''
    });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setIsEdit(false);
    setCurrentCourse(null);
    setFormData({
      title: '',
      code: '',
      department_id: '',
      credits: '',
      theory_hours: '',
      lab_hours: '',
      semester: '',
      status: 'Đang hoạt động',
      description: ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Validate required fields
      if (!formData.title || !formData.code || !formData.department_id) {
        toast.error('Vui lòng điền đầy đủ tên, mã học phần và bộ môn');
        return;
      }

      if (isEdit && currentCourse) {
        await updateCourse(currentCourse.id, formData);
        toast.success('Cập nhật học phần thành công');
      } else {
        await createCourse(formData);
        toast.success('Tạo học phần thành công');
      }

      // Reload data
      const response = await getCourses();
      setCourses(response.data || []);
      
      setModalOpen(false);
      setFormData({});
    } catch (error) {
      toast.error(isEdit ? 'Không thể cập nhật học phần' : 'Không thể tạo học phần');
      console.error('Error saving course:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({});
    setCurrentCourse(null);
  };

  return (
    // Thêm nền gradient tinh tế cho toàn bộ trang
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Phần Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Quản lý học phần
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Danh sách học phần, khoa phụ trách, tín chỉ và tình trạng mở
            </p>
          </div>
          <button onClick={handleAdd} className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <PlusOutlined className="h-5 w-5 mr-2" />
            Thêm học phần
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
                  placeholder="Tìm theo mã, tên học phần..."
                  className="w-full rounded-xl border-gray-300 bg-white pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="rounded-xl border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              >
                <option>Tất cả khoa</option>
                <option>CNTT</option>
                <option>KTPM</option>
                <option>HTTT</option>
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              >
                <option>Tất cả trạng thái</option>
                <option>Đang mở</option>
                <option>Đóng</option>
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
                    Khoa
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tín chỉ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Học kỳ
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
                    key={c.code}
                    className="hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    {/* Cột "Thông tin" đã được gộp và cấu trúc lại */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                            <span className="text-sm font-bold leading-none text-white">
                              {c.code.slice(-3)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {c.name}
                          </div>
                          <div className="text-xs text-gray-500">{c.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {c.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <StarOutlined className="h-4 w-4 mr-1.5 text-gray-400" />
                        {c.credits}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {c.semesters.map((semester, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                          >
                            {semester}
                          </span>
                        ))}
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

        <CourseModal
          isOpen={modalOpen}
          onClose={closeModal}
          title={isEdit ? 'Chỉnh sửa học phần' : 'Thêm học phần mới'}
          onSubmit={handleSubmit}
          loading={submitting}
        >
          <CourseForm 
            formData={formData} 
            setFormData={setFormData} 
            isEdit={isEdit}
          />
        </CourseModal>
      </div>
    </div>
  );
}
