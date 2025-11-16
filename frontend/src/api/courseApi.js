import api from './axiosConfig';

// Course API functions
export const getCourses = () => {
  return api.get('/courses');
};

export const createCourse = (data) => {
  return api.post('/courses', data);
};

export const updateCourse = (id, data) => {
  return api.put(`/courses/${id}`, data);
};

export const deleteCourse = (id) => {
  return api.delete(`/courses/${id}`);
};

export const getCourseById = (id) => {
  return api.get(`/courses/${id}`);
};
