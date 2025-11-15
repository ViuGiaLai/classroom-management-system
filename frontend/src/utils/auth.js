import api from '../api/axiosConfig';

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

export const getRole = () => localStorage.getItem("role");

export const isAdmin = () => getRole() === "admin";
export const isTeacher = () => getRole() === "teacher";
export const isStudent = () => getRole() === "student";

export const getUser = () => {
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch (error) {
        return null;
    }
};

export const getToken = () => localStorage.getItem("token");

export const getUserId = () => localStorage.getItem("userId");

export const isAuthenticated = () => !!getToken();

export const hasRole = (role) => getRole() === role;

export const getDashboardPath = () => {
    const role = getRole();
    switch (role) {
        case "admin":
            return "/admin/dashboard";
        case "teacher":
            return "/teacher";
        case "student":
            return "/student";
        default:
            return "/";
    }
};

export const logout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (e) {
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        delete api.defaults.headers.common['Authorization'];
    }
};

export const setAuthData = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", user.role);
    localStorage.setItem("userId", user.id);
};
