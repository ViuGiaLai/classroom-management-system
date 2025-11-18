import api from './axiosConfig';

// Course Class API functions
export const getCourseClasses = () => {
  return api.get('/classes');
};

export const createCourseClass = (data) => {
  return api.post('/classes', data);
};

export const updateCourseClass = (id, data) => {
  return api.put(`/classes/${id}`, data);
};

export const deleteCourseClass = (id) => {
  return api.delete(`/classes/${id}`);
};

export const getCourseClassById = (id) => {
  return api.get(`/classes/${id}`);
};
