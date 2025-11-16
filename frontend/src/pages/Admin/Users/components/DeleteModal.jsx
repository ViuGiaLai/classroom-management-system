import React from "react";

const DeleteModal = ({ 
  isDeleteModalOpen, 
  setIsDeleteModalOpen, 
  userToDelete, 
  confirmDelete, 
  submitLoading 
}) => {
  if (!isDeleteModalOpen || !userToDelete) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-red-600">
            Xác nhận xóa
          </h2>
        </div>

        <div className="p-6">
          <p className="text-slate-700 mb-4">
            Bạn có chắc chắn muốn xóa người dùng <strong className="text-slate-900">{userToDelete.full_name}</strong>?
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Thao tác này không thể hoàn tác.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={submitLoading}
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={submitLoading}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitLoading ? "Đang xóa..." : "Xóa"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
