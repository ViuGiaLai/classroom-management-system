import axios from 'axios';
import { getToken } from '@/utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Get attendance records by class and date
 */
export const getAttendanceByClass = async (classId, date) => {
  try {
    const params = {};
    if (date) {
      params.date = date;
    }
    const response = await api.get(`/attendance/${classId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
};

/**
 * Create new attendance record
 */
export const createAttendance = async (classId, studentId, date, status, note = '') => {
  try {
    const response = await api.post('/attendance', {
      class_id: classId,
      student_id: studentId,
      date,
      status,
      note,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating attendance:', error);
    throw error;
  }
};

/**
 * Create bulk attendance records
 */
export const createBulkAttendance = async (attendanceData) => {
  try {
    const response = await api.post('/attendance/bulk', attendanceData);
    return response.data;
  } catch (error) {
    console.error('Error creating bulk attendance:', error);
    throw error;
  }
};

/**
 * Update attendance record
 */
export const updateAttendance = async (attendanceId, status, note = '') => {
  try {
    const response = await api.put(`/attendance/${attendanceId}`, {
      status,
      note,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating attendance:', error);
    throw error;
  }
};

/**
 * Delete attendance record
 */
export const deleteAttendance = async (attendanceId) => {
  try {
    const response = await api.delete(`/attendance/${attendanceId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting attendance:', error);
    throw error;
  }
};

/**
 * Get attendance report for a class
 */
export const getAttendanceReport = async (classId, startDate, endDate) => {
  try {
    const response = await api.get(`/attendance/report/${classId}`, {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    throw error;
  }
};

export default api;
