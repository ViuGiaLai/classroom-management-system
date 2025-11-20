import React from 'react';
import { Dialog } from '@headlessui/react';
import { CloseOutlined } from '@ant-design/icons';

const NotificationDetailModal = ({ isOpen, onClose, notification }) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    >
                        <CloseOutlined className="w-6 h-6" />
                    </button>
                    <h3 className="text-xl font-bold">Chi tiết thông báo</h3>
                    {notification && (
                        <div className="space-y-3">
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Tiêu đề</label>
                                <p className="text-lg font-semibold">{notification.title}</p>
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Nội dung</label>
                                <p className="text-gray-600 whitespace-pre-wrap">{notification.content}</p>
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Điểm đến</label>
                                <p className="text-gray-600">{notification.target}</p>
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Số người đọc</label>
                                <p className="text-gray-600">{notification.readCount} người</p>
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Thời gian gửi</label>
                                <p className="text-gray-600">{notification.date}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Đóng
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default NotificationDetailModal;
