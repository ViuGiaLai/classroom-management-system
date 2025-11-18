export default function GradeDetailModal({ 
  show, 
  submission, 
  onClose, 
  onApprove, 
  onReject,
  getStatusClass,
  getStatusText,
  formatDate 
}) {
  if (!show || !submission) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
        <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Chi tiết bản nộp điểm</h3>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Mã học phần</p>
                <p className="font-medium">{submission.class_id?.course_id?.code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tên học phần</p>
                <p className="font-medium">{submission.class_id?.course_id?.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Giảng viên</p>
                <p className="font-medium">{submission.teacher_id?.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Học kỳ</p>
                <p className="font-medium">HK{submission.class_id?.semester} {submission.class_id?.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày nộp</p>
                <p className="font-medium">{formatDate(submission.submitted_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(submission.status)}`}>
                  {getStatusText(submission.status)}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Danh sách điểm sinh viên</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">MSSV</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Điểm</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submission.grades && Object.entries(submission.grades).map(([studentId, grade]) => (
                      <tr key={studentId}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{studentId}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{grade.name || "N/A"}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{grade.grade || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {submission.status === "pending_approval" && (
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={onReject}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100"
                >
                  Trả lại
                </button>
                <button
                  onClick={() => onApprove(submission._id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-green-200 rounded hover:bg-green-700"
                >
                  Duyệt
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
