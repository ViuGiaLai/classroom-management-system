import api from './axiosConfig';

// Lấy danh sách khoa
export const getFaculties = () => {
  return api.get('/faculties');
};

// Tạo khoa mới
export const createFaculty = (data) => {
  return api.post('/faculties', data);
};

// Cập nhật thông tin khoa
export const updateFaculty = (id, data) => {
  return api.put(`/faculties/${id}`, data);
};

// Lấy thông tin khoa theo ID
export const getFacultyById = (id) => {
  return api.get(`/faculties/${id}`);
};

// Xóa khoa
export const deleteFaculty = (id) => {
  return api.delete(`/faculties/${id}`);
};

export default {
  getFaculties,
  createFaculty,
  updateFaculty,
  getFacultyById,
  deleteFaculty
};
