import api from './axiosConfig';

const examApi = {
  getAll: async () => {
    return await api.get('/exams?populate=class_id');
  },

  getById: async (id) => {
    return await api.get(`/exams/${id}?populate=questions`);
  },

  create: async (data) => {
    const examData = {
      ...data,
      questions: data.questions?.map((q, index) => ({
        ...q,
        order: index + 1
      })) || []
    };
    
    return await api.post('/exams', examData);
  },

  update: async (id, data) => {
    // Process questions data before sending
    const examData = {
      ...data,
      questions: data.questions?.map((q, index) => ({
        ...q,
        order: index + 1
      })) || []
    };
    
    return await api.put(`/exams/${id}`, examData);
  },

  delete: async (id) => {
    return await api.delete(`/exams/${id}`);
  },

  // For student submission
  submit: async (examId, answers) => {
    return await api.post(`/exams/${examId}/submit`, { answers });
  },

  // Get exam results
  getResults: async (examId) => {
    return await api.get(`/exams/${examId}/results`);
  },
};

export default examApi;
