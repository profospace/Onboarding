import axios from 'axios';

// Base URLs for different user types
const API_BASE_URL = 'http://localhost:5053/api';
const SALESMAN_API = `${API_BASE_URL}/salesmen`;
const ADMIN_API = `${API_BASE_URL}/adminSales`;

// Register user
const register = async (userData) => {
    const response = await axios.post(`${SALESMAN_API}/register`, userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data.salesman));
        localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
};

// Login user
const login = async (userData) => {
    // Determine which endpoint to use based on login type
    const endpoint = userData.isAdmin
        ? `${ADMIN_API}/login`
        : `${SALESMAN_API}/login`;

    const response = await axios.post(endpoint, {
        username: userData.username,
        password: userData.password
    });

    if (response.data) {
        const userData = {
            ...response.data.data.salesman,
            token: response.data.data.token,
            userType: response.data.data.salesman.role === 'admin' ? 'admin' : 'salesman'
        };

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        return userData;
    }

    return response.data;
};

// Logout user
const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

const authService = {
    register,
    login,
    logout,
};

export default authService;