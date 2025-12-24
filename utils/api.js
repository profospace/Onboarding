import axios from 'axios';
import { base_url } from './base_url';

const api = axios.create({
  baseURL: `${base_url}/api`,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;x
    }

    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || '';

    // Only force logout on AUTH endpoints
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

export default api;
