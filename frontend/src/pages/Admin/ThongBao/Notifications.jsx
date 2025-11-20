import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { 
    NotificationList, 
    CreateNotificationModal, 
    NotificationDetailModal, 
    DeleteConfirmationModal 
} from './components';
import { createNotification, getNotificationsByUser, deleteNotification } from '@/api/notificationApi';
import { getCourseClasses } from '@/api/ClassApi';

const recipientTypes = [
    { value: 'all', label: 'Tất cả' },
    { value: 'role', label: 'Theo vai trò' },
    { value: 'class', label: 'Theo lớp học phần' }
];

const roles = [
    { value: 'student', label: 'Sinh viên' },
    { value: 'teacher', label: 'Giảng viên' },
    { value: 'admin', label: 'Quản trị viên' }
];

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [recipientType, setRecipientType] = useState('all');
    const [selectedRole, setSelectedRole] = useState('student');
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [notificationToDelete, setNotificationToDelete] = useState(null);

    // Hàm load thông báo từ server
    const loadNotifications = async () => {
        const storedUser = localStorage.getItem('userInfo');
        if (!storedUser) return;

        const currentUser = JSON.parse(storedUser);
        const userId = currentUser?._id || currentUser?.id;
        if (!userId) return;

        try {
            const res = await getNotificationsByUser(userId);
            const data = Array.isArray(res.data) ? res.data : [];
            setNotifications(data);
            localStorage.setItem('notifications', JSON.stringify(data));
        } catch (err) {
            console.error('Failed to load notifications:', err);
            // Nếu lỗi server, thử lấy từ localStorage
            const stored = localStorage.getItem('notifications');
            if (stored) {
                try {
                    setNotifications(JSON.parse(stored));
                } catch (e) {
                    console.error('Failed to parse stored notifications:', e);
                    setNotifications([]);
                }
            } else {
                setNotifications([]);
            }
        }
    };

    // Load thông báo khi component mount
    useEffect(() => {
        loadNotifications();
    }, []);

    // Load thông báo từ localStorage khi component mount
    useEffect(() => {
        const stored = localStorage.getItem('notifications');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setNotifications(parsed);
            } catch (e) {
                console.error('Failed to parse stored notifications:', e);
                setNotifications([]);
            }
        }
    }, []);

    // Socket.io connection
    useEffect(() => {
        const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
            auth: {
                token: localStorage.getItem('token')
            }
        });

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        // Lắng nghe thông báo mới
        socket.on('receiveNotification', (notification) => {
            console.log('New notification received:', notification);
            
            // Cập nhật state
            setNotifications(prev => {
                const updated = [notification, ...prev];
                // Lưu vào localStorage
                localStorage.setItem('notifications', JSON.stringify(updated));
                return updated;
            });
            
            // Hiển thị toast
            toast.info(`📢 ${notification.title}`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (recipientType === 'class') {
            setLoading(true);
            getCourseClasses()
                .then(res => setClasses(res.data))
                .catch(() => setClasses([]))
                .finally(() => setLoading(false));
        }
    }, [recipientType]);

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);

        let payload = { title, content };
        if (recipientType === 'all') payload.target = { type: 'all' };
        else if (recipientType === 'role') payload.target = { type: 'role', role: selectedRole };
        else if (recipientType === 'class') payload.target = { type: 'class', classId: selectedClass };

        try {
            await createNotification(payload);

            // Reset form
            setTitle('');
            setContent('');
            setRecipientType('all');
            setSelectedRole('student');
            setSelectedClass('');
            setIsOpen(false);

            // Reload lại danh sách thông báo từ server
            await loadNotifications();

            toast.success('Gửi thông báo thành công!');
        } catch (error) {
            console.error('Error sending notification:', error);
            toast.error('Gửi thông báo thất bại!');
        } finally {
            setSending(false);
        }
    };

    // Xóa thông báo
    const handleDeleteNotification = async (id) => {
        // Tìm thông báo để hiển thị trong modal
        const notification = notifications.find(notif => notif.id === id);
        if (notification) {
            setNotificationToDelete(notification);
            setDeleteModalOpen(true);
        }
    };

    // Xác nhận xóa thông báo
    const confirmDeleteNotification = async () => {
        if (!notificationToDelete) return;

        try {
            await deleteNotification(notificationToDelete.id);

            // Cập nhật state và localStorage
            setNotifications(prev => {
                const updated = prev.filter(notif => notif.id !== notificationToDelete.id);
                localStorage.setItem('notifications', JSON.stringify(updated));
                return updated;
            });

            toast.success('Xóa thông báo thành công!');
            setDeleteModalOpen(false);
            setNotificationToDelete(null);
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Xóa thông báo thất bại!');
        }
    };

    // Xem chi tiết thông báo
    const handleViewDetail = (notification) => {
        setSelectedNotification(notification);
        setDetailModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setNotificationToDelete(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Thông báo toàn hệ thống</h2>
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    + Gửi thông báo
                </button>
            </div>

            <NotificationList
                notifications={notifications}
                onViewDetail={handleViewDetail}
                onDelete={handleDeleteNotification}
            />

            <CreateNotificationModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
                recipientType={recipientType}
                setRecipientType={setRecipientType}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                classes={classes}
                loading={loading}
                sending={sending}
                recipientTypes={recipientTypes}
                roles={roles}
                onSubmit={handleSend}
            />

            <NotificationDetailModal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                notification={selectedNotification}
            />

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={confirmDeleteNotification}
                notification={notificationToDelete}
            />
        </div>
    );
}
