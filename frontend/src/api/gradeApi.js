import api from './axiosConfig';

export const gradeApi = {
  // Lấy danh sách nộp điểm
  getSubmissions: (params = {}) => {
    return api.get('/class-grade-submissions', { params });
  },

  // Tạo bản nộp điểm mới
  createSubmission: (data) => {
    return api.post('/class-grade-submissions', data);
  },

  // Nộp điểm để duyệt
  submitForApproval: (id) => {
    return api.put(`/class-grade-submissions/${id}/submit`);
  },

  // Duyệt điểm
  approveSubmission: (id, data) => {
    return api.put(`/class-grade-submissions/${id}/approve`, data);
  },

  // Trả lại điểm
  rejectSubmission: (id, data) => {
    return api.put(`/class-grade-submissions/${id}/reject`, data);
  },

  // Xóa bản nộp điểm
  deleteSubmission: (id) => {
    return api.delete(`/class-grade-submissions/${id}`);
  },

  // Lấy chi tiết bản nộp điểm
  getSubmissionDetail: (id) => {
    return api.get(`/class-grade-submissions/${id}`);
  },

  // Cập nhật bản nộp điểm
  updateSubmission: (id, data) => {
    return api.put(`/class-grade-submissions/${id}`, data);
  }
};

export default gradeApi;
