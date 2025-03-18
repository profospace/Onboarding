import axios from 'axios';
import { base_url } from './base_url';

// Base API configuration
const API_BASE_URL = `${base_url}/api`;

// Salesman API endpoints
export const salesmanAPI = {
    base: `${API_BASE_URL}/salesmen`,
    login: `${API_BASE_URL}/salesmen/login`,
    profile: `${API_BASE_URL}/salesmen/profile`,
    properties: `${API_BASE_URL}/properties`,
};

// Admin API endpoints
export const adminAPI = {
    base: `${API_BASE_URL}/adminSales`,
    login: `${API_BASE_URL}/adminSales/login`,
    manageSalesmen: `${API_BASE_URL}/salesmen`,
    analytics: `${API_BASE_URL}/analytics`,
};

// Create axios instances with default configurations
const createAuthenticatedInstance = () => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Add request interceptor to attach token
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add response interceptor to handle common errors
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                // Token expired or invalid, log out the user
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

// Export configured instances
export const salesmanAxios = createAuthenticatedInstance();
export const adminAxios = createAuthenticatedInstance();

export default {
    salesmanAPI,
    adminAPI,
    salesmanAxios,
    adminAxios,
};