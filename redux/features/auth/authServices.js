import { base_url } from '../../../utils/base_url';
import api from '../../../utils/api';


// Base URLs for different user types
const API_BASE_URL = `${base_url}/api`;
const SALESMAN_API = `${API_BASE_URL}/salesmen`;
const ADMIN_API = `${API_BASE_URL}/adminSales`;

// 🔑 Role-based base path resolver
const getBaseByUser = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.role) {
    throw new Error('User not found or role missing');
  }

  return user.role === 'admin'
    ? '/adminSales'
    : '/salesmen';
};

/* ======================================================
   REGISTER (still SALESMAN ONLY – correct as-is)
   ====================================================== */
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

/* ======================================================
   LOGIN (explicit routes – DO NOT auto-resolve)
   ====================================================== */
const login = async (userData) => {
  console.log('[AUTH SERVICE] Login called', userData);

  const endpoint = userData.isAdmin
    ? '/adminSales/login'
    : '/salesmen/login';

  try {
    const response = await api.post(endpoint, {
      username: userData.username,
      password: userData.password,
    });

    const data = response.data?.data;
    if (!data) throw 'Invalid server response';

    let user;

    if (userData.isAdmin) {
      user = {
        role: 'admin',
        userType: 'admin',
        token: data.token,
      };
    } else {
      user = {
        ...data.salesman,
        role: 'salesman',
        userType: 'salesman',
        token: data.token,
      };
    }

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', user.token);

    return user;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      error ||
      'Login failed';

    throw message;
  }
};

/* ======================================================
   LOGOUT
   ====================================================== */
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

/* ======================================================
   ✅ EXPORTS
   ====================================================== */
const authService = {
  register,
  login,
  logout,
  getBaseByUser, // 👈 USE THIS IN OTHER API CALL FILES
};

export default authService;