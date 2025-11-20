import React from 'react';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';

const NotificationList = ({ notifications, onViewDetail, onDelete }) => {
    if (notifications.length === 0) {
        return (
            <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500">
                Chưa có thông báo nào
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {notifications.map(notif => (
                <div key={notif.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg">{notif.title}</h3>
                        <p className="text-gray-600">{notif.content}</p>
                        <div className="mt-1 text-sm text-gray-500">
                            <span className="mr-2">{notif.target}</span>
                            <span>{notif.readCount} người đã đọc</span>
                            <span className="ml-2">{notif.date}</span>
                        </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                        <button
                            onClick={() => onViewDetail(notif)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                        >
                            <EyeOutlined className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => onDelete(notif.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa thông báo"
                        >
                            <DeleteOutlined className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationList;
