import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: '',  // Empty baseURL since we're using the proxy
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Always use /api prefix
    if (!config.url.startsWith('/api')) {
      config.url = `/api${config.url}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        headers: {
          ...config.headers,
          Authorization: config.headers.Authorization ? '[HIDDEN]' : undefined,
        },
      });
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response.data;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      toast.error('Unable to connect to the server. Please check if the backend is running.');
      return Promise.reject(error);
    }

    // Handle specific error cases
    switch (error.response.status) {
      case 401:
        if (!window.location.pathname.startsWith('/login')) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
        }
        break;
      case 403:
        toast.error('Access denied. You do not have permission to perform this action.');
        break;
      case 404:
        if (error.config.url.includes('/auth/profile')) {
          // Don't show error for profile 404s as they're handled separately
          return Promise.reject(error);
        }
        toast.error('Resource not found. Please try again later.');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(error.response?.data?.message || 'An unexpected error occurred.');
    }

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.message || error.message,
      });
    }

    return Promise.reject(error);
  }
);

export default api; 