export default function GradeTable({ 
  data, 
  loading, 
  onApprove, 
  onViewDetail, 
  onRejectClick,
  getStatusClass,
  getStatusText,
  formatDate 
}) {
  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-8 text-center text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-8 text-center text-gray-500">
        Không có dữ liệu
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Thông tin
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Giảng viên
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Học kỳ
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Ngày gửi
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                SL sinh viên
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((submission) => (
              <tr
                key={submission._id}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0">
                      <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {submission.class_id?.course_id?.code?.slice(-3) || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {submission.class_id?.course_id?.title || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {submission.class_id?.course_id?.code || "N/A"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {submission.teacher_id?.full_name || "N/A"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  HK{submission.class_id?.semester || "N/A"} {submission.class_id?.year || ""}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(submission.submitted_at)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {submission.class_id?.current_enrollment || 0}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(
                      submission.status
                    )}`}
                  >
                    {getStatusText(submission.status)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() => onViewDetail(submission)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Xem chi tiết
                  </button>
                  {submission.status === "pending_approval" && (
                    <>
                      <button
                        onClick={() => onApprove(submission._id)}
                        className="text-green-600 hover:text-green-800 mr-3"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => onRejectClick(submission)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Trả lại
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
