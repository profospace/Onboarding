import axios from 'axios';
import { base_url } from './base_url';

const api = axios.create({
  baseURL: `${base_url}/api`,
});

// 👉 Attach token on every request
api.interceptors.request.use(
  (config) => {
    //satisfies
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 👉 Handle auth expiry safely
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || '';

    // Only logout on auth-related failures
    const isAuthError =
      status === 401 &&
      (url.includes('/login') || url.includes('/me'));

    if (isAuthError) {
      console.warn('[API] Auth expired, logging out');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(err);
  }
);

export const getRoleApi = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.role) {
    throw new Error('User not authenticated');
  }

  return {
    role: user.role,
    base: user.role === 'admin' ? '/adminSales' : '/salesmen',
    api,
  };
};

export default api;