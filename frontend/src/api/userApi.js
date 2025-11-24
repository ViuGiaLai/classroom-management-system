import api from './axiosConfig';

// Tạo user (chỉ admin)
export const createUser = (data) => {
  return api.post('/users', data);
};

// Lấy danh sách user (chỉ admin)
export const getAllUsers = () => {
  return api.get('/users');
};

// User tự cập nhật thông tin
export const updateUser = (id, data) => {
  return api.put(`/users/${id}`, data);
};

// Cập nhật thông tin cá nhân
export const updateProfile = (data) => {
  return api.put('/users/profile', data);
};

// Xóa user (chỉ admin)
export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};
