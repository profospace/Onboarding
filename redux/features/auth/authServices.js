import { base_url } from '../../../utils/base_url';
import api from '../../../utils/api';


// Base URLs for different user types
const API_BASE_URL = `${base_url}/api`;
const SALESMAN_API = `${API_BASE_URL}/salesmen`;
const ADMIN_API = `${API_BASE_URL}/adminSales`;

// Register user
// Register user
const register = async (userData) => {
    const response = await api.post('/salesmen/register', userData);

    if (response.data?.data) {
        localStorage.setItem(
            'user',
            JSON.stringify(response.data.data.salesman)
        );
        localStorage.setItem('token', response.data.data.token);
    }

    return response.data;
};

// Login user
const login = async (userData) => {
    console.log('[AUTH SERVICE] Login called');
    console.log('[AUTH SERVICE] Payload:', {
        username: userData.username,
        isAdmin: userData.isAdmin,
    });

    const endpoint = userData.isAdmin
        ? '/adminSales/login'
        : '/salesmen/login';

    console.log('[AUTH SERVICE] Using endpoint:', endpoint);

    try {
        const response = await api.post(endpoint, {
            username: userData.username,
            password: userData.password,
        });

        console.log('[AUTH SERVICE] Raw response:', response.data);

        const data = response.data?.data;
        if (!data) throw 'Invalid server response';

        let user;

        // 🔑 ADMIN LOGIN
        if (userData.isAdmin) {
            console.log('[AUTH SERVICE] Processing ADMIN login');

            user = {
                role: 'admin',
                userType: 'admin',
                token: data.token,
            };
        }
        // 🔑 SALESMAN LOGIN
        else {
            console.log('[AUTH SERVICE] Processing SALESMAN login');

            if (!data.salesman) throw 'Invalid salesman response';

            user = {
                ...data.salesman,
                role: 'salesman',
                userType: 'salesman',
                token: data.token,
            };
        }

        console.log('[AUTH SERVICE] Normalized user object:', user);

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', user.token);

        return user; // ✅ Redux receives THIS
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            error ||
            'Login failed';

        console.error('[AUTH SERVICE] Login failed:', message);
        throw message;
    }
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