import api from './axiosConfig';

// Lấy danh sách bộ môn
export const getDepartments = () => {
  return api.get('/departments');
};

// Tạo bộ môn mới
export const createDepartment = (data) => {
  return api.post('/departments', data);
};

// Cập nhật thông tin bộ môn
export const updateDepartment = (id, data) => {
  return api.put(`/departments/${id}`, data);
};

// Lấy thông tin bộ môn theo ID
export const getDepartmentById = (id) => {
  return api.get(`/departments/${id}`);
};

// Xóa bộ môn
export const deleteDepartment = (id) => {
  return api.delete(`/departments/${id}`);
};

export default {
  getDepartments,
  createDepartment,
  updateDepartment,
  getDepartmentById,
  deleteDepartment
};
