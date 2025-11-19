import api from './axiosConfig';

// Tạo thông báo
export const createNotification = (data) => {
  return api.post('/notifications', data);
};

// Lấy thông báo theo user
export const getNotificationsByUser = (userId) => {
  return api.get(`/notifications/user/${userId}`);
};

// Đánh dấu đã đọc
export const markNotificationAsRead = (id) => {
  return api.put(`/notifications/${id}/read`);
};

// Xóa thông báo
export const deleteNotification = (id) => {
  return api.delete(`/notifications/${id}`);
};
