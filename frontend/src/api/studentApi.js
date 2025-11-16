import api from './axiosConfig';

// Tạo sinh viên (chỉ admin)
export const createStudent = (data) => {
  return api.post('/students', data);
};

// Lấy danh sách sinh viên (chỉ admin)
export const getStudents = () => {
  return api.get('/students');
};

// Sinh viên tự cập nhật thông tin
export const updateStudent = (id, data) => {
  return api.put(`/students/${id}`, data);
};

// Lấy thông tin sinh viên theo tổ chức
export const getStudentById = (id) => {
  return api.get(`/students/${id}`);
};

// Xóa sinh viên (chỉ admin)
export const deleteStudent = (id) => {
  return api.delete(`/students/${id}`);
};

export default {
  createStudent,
  getStudents,
  updateStudent,
  getStudentById,
  deleteStudent
};
