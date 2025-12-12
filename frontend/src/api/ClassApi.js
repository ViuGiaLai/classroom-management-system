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

// Lấy danh sách lớp học của teacher hiện tại
export const getMyClasses = async () => {
  const response = await api.get('/classes/teacher/my-classes');
  return response.data;
};

// Lấy danh sách sinh viên trong một lớp học
export const getStudentsInClass = async (classId) => {
  const response = await api.get(`/classes/${classId}/students`);
  return response.data;
};

// Lấy tất cả sinh viên của teacher từ tất cả các lớp
export const getMyStudents = async () => {
  const response = await api.get('/classes/teacher/my-students');
  return response.data;
};


export const getAllClasses = async () => {
  try {
    const response = await api.get('/classes');
    return response.data; // Return the data directly
  } catch (error) {
    console.error('Error fetching all classes:', error);
    throw error; // Re-throw to handle in the component
  }
};

export const getEnrolledClasses = async () => {
  try {
    const response = await api.get('/classes/student/enrolled');
    return response.data; // Return the data directly
  } catch (error) {
    console.error('Error fetching enrolled classes:', error);
    throw error; // Re-throw to handle in the component
  }
};