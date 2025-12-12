import axios from 'axios';
import dayjs from 'dayjs';
import { getToken } from '@/utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    const params = date ? { date } : {};
    const response = await api.get(`/attendance/class/${classId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
};

/**
 * Create new attendance record - ĐÃ SỬA LỖI organization_id
 */
export const createAttendance = async (classId, studentId, date, status, note = '') => {
  try {
    // Lấy thông tin user từ localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    // Fix: Đặt biến đúng tên, đúng scope
    const orgId = user?.organization_id;

    if (!orgId) {
      throw new Error('Không tìm thấy organization_id. Vui lòng đăng nhập lại.');
    }

    const formattedDate = dayjs(date).format('YYYY-MM-DD');

    const payload = {
      class_id: classId,
      student_id: studentId,
      date: formattedDate,
      status,
      note,
      organization_id: orgId, // Đúng tên trường backend yêu cầu
    };

    console.log('Sending attendance payload:', payload); // Debug

    const response = await api.post('/attendance', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating attendance:', error.response?.data || error.message);
    const msg = error.response?.data?.message || error.message || 'Lỗi khi tạo điểm danh';
    throw new Error(msg);
  }
};

/**
 * Update attendance
 */
export const updateAttendance = async (attendanceId, status, note = '') => {
  try {
    const response = await api.put(`/attendance/${attendanceId}`, { status, note });
    return response.data;
  } catch (error) {
    console.error('Error updating attendance:', error);
    throw error;
  }
};

/**
 * Delete attendance
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

export default api;