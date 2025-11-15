import api from './axiosConfig';

// Login service
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    // Store token and user info in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('role', response.data.user.role);
      localStorage.setItem('userId', response.data.user.id);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Register service
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    // Store token and user info in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('role', response.data.user.role);
      localStorage.setItem('userId', response.data.user.id);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Logout service
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
};

// Get current user
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
