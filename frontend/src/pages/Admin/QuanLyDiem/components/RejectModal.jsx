export default function RejectModal({ 
  show, 
  onClose, 
  onSubmit, 
  rejectionReason, 
  onReasonChange 
}) {
  if (!show) return null;

  const handleSubmit = () => {
    if (!rejectionReason.trim()) {
      return;
    }
    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
        <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Trả lại điểm</h3>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do trả lại
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => onReasonChange(e.target.value)}
                rows={4}
                className="w-full rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Nhập lý do trả lại điểm..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-200 rounded hover:bg-red-700"
              >
                Trả lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
