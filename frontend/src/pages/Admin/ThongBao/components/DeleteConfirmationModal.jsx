import React from 'react';
import { Dialog } from '@headlessui/react';
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, notification }) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    >
                        <CloseOutlined className="w-6 h-6" />
                    </button>
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa thông báo</h3>
                        {notification && (
                            <div className="text-left bg-gray-50 p-3 rounded-lg mb-4">
                                <p className="font-semibold text-gray-900">{notification.title}</p>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.content}</p>
                            </div>
                        )}
                        <p className="text-sm text-gray-500 mb-6">
                            Bạn có chắc chắn muốn xóa thông báo này? Hành động này không thể hoàn tác.
                        </p>
                    </div>
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Xóa thông báo
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default DeleteConfirmationModal;
