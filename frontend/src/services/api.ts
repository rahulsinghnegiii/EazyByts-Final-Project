import axios, { AxiosInstance, AxiosError } from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = error.response?.data?.message || error.message;
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
      toast.error('Session expired. Please login again.');
    }
    
    // Handle server errors
    else if (error.response?.status === 500) {
      toast.error('An unexpected error occurred. Please try again later.');
    }
    
    // Handle validation errors
    else if (error.response?.status === 400) {
      toast.error(message);
    }
    
    // Handle not found errors
    else if (error.response?.status === 404) {
      toast.error('Resource not found.');
    }
    
    return Promise.reject(error);
  }
);

export default api; 