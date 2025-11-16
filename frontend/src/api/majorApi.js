import api from './axiosConfig';

// Lấy danh sách bộ môn
export const getMajors = () => {
  return api.get('/departments');
};

// Tạo bộ môn mới
export const createMajor = (data) => {
  return api.post('/departments', data);
};

// Cập nhật thông tin bộ môn
export const updateMajor = (id, data) => {
  return api.put(`/departments/${id}`, data);
};

// Lấy thông tin bộ môn theo ID
export const getMajorById = (id) => {
  return api.get(`/departments/${id}`);
};

// Xóa bộ môn
export const deleteMajor = (id) => {
  return api.delete(`/departments/${id}`);
};

export default {
  getMajors,
  createMajor,
  updateMajor,
  getMajorById,
  deleteMajor
};
