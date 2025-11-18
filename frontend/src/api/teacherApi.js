import api from './axiosConfig';

// Lấy danh sách giảng viên
export const getTeachers = () => {
  return api.get('/teachers');
};

// Tạo giảng viên mới
export const createTeacher = (data) => {
  return api.post('/teachers', data);
};

// Cập nhật thông tin giảng viên
export const updateTeacher = (id, data) => {
  return api.put(`/teachers/${id}`, data);
};

// Lấy thông tin giảng viên theo ID
export const getTeacherById = (id) => {
  return api.get(`/teachers/${id}`);
};

// Xóa giảng viên
export const deleteTeacher = (id) => {
  return api.delete(`/teachers/${id}`);
};

// Lấy danh sách giảng viên có thể làm cố vấn
export const getAdvisors = () => {
  return api.get('/teachers/advisors');
};

export default {
  getTeachers,
  createTeacher,
  updateTeacher,
  getTeacherById,
  deleteTeacher,
  getAdvisors
};
