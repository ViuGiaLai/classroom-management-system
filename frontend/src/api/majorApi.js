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

// Lấy danh sách lớp học phần của bộ môn
export const getMajorClasses = (majorId) => {
  return api.get(`/departments/${majorId}/classes`);
};

// Gán lớp học phần vào bộ môn
export const assignClassToMajor = (majorId, classId) => {
  return api.post(`/departments/${majorId}/classes`, { class_id: classId });
};

// Gỡ lớp học phần khỏi bộ môn
export const removeClassFromMajor = (majorId, classId) => {
  return api.delete(`/departments/${majorId}/classes/${classId}`);
};

export default {
  getMajors,
  createMajor,
  updateMajor,
  getMajorById,
  deleteMajor,
  getMajorClasses,
  assignClassToMajor,
  removeClassFromMajor,
};
