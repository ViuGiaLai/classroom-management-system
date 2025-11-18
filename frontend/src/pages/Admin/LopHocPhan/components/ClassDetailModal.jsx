const ClassDetailModal = ({ isOpen, onClose, classData }) => {
  if (!classData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang hoạt động':
        return 'bg-green-100 text-green-800';
      case 'Tạm dừng':
        return 'bg-yellow-100 text-yellow-800';
      case 'Đã kết thúc':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-md shadow-lg w-full max-w-2xl">
          {/* Header */}
          <div className="border-b border-gray-200 px-4 py-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-900">
                Chi tiết Lớp học phần
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-4 py-3">
            <div className="space-y-4">
              {/* Thông tin cơ bản */}
              <div className="border border-gray-200 rounded p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Thông tin cơ bản</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Mã lớp</label>
                    <p className="text-sm text-gray-900">{classData._id}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Tên học phần</label>
                    <p className="text-sm text-gray-900">{classData.course_id?.title || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Mã học phần</label>
                    <p className="text-sm text-gray-900">{classData.course_id?.code || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Trạng thái</label>
                    <p className="text-sm text-gray-900">{classData.status}</p>
                  </div>
                </div>
              </div>

              {/* Thông tin giảng viên */}
              <div className="border border-gray-200 rounded p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Thông tin giảng viên</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Họ tên giảng viên</label>
                    <p className="text-sm text-gray-900">
                      {classData.lecturer_id?.user_id?.full_name || 'Chưa phân công'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Mã giảng viên</label>
                    <p className="text-sm text-gray-900">
                      {classData.lecturer_id?.teacher_code || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thông tin học tập */}
              <div className="border border-gray-200 rounded p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Thông tin học tập</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Học kỳ</label>
                    <p className="text-sm text-gray-900">{classData.semester || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Năm học</label>
                    <p className="text-sm text-gray-900">{classData.year || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Sĩ số tối đa</label>
                    <p className="text-sm text-gray-900">{classData.max_capacity || 40} sinh viên</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Đã đăng ký</label>
                    <p className="text-sm text-gray-900">{classData.current_enrollment || 0} sinh viên</p>
                  </div>
                </div>
              </div>

              {/* Lịch học */}
              <div className="border border-gray-200 rounded p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Lịch học</h4>
                <div>
                  <label className="text-xs text-gray-500">Thời khóa biểu</label>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {classData.schedule || 'Chưa có lịch học'}
                  </p>
                </div>
              </div>

              {/* Thông tin hệ thống */}
              <div className="border border-gray-200 rounded p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Thông tin hệ thống</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Ngày tạo</label>
                    <p className="text-sm text-gray-900">
                      {classData.created_at ? new Date(classData.created_at).toLocaleString('vi-VN') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Cập nhật lần cuối</label>
                    <p className="text-sm text-gray-900">
                      {classData.updated_at ? new Date(classData.updated_at).toLocaleString('vi-VN') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailModal;
