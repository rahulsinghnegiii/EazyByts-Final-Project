import api from './api';

// Keep track of profile fetch attempts
let profileFetchAttempted = false;

export const authService = {
  async login(credentials) {
    try {
      console.log('Attempting login with:', { email: credentials.email }); // Log without password
      const response = await api.post('/auth/login', credentials);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        // Reset profile fetch flag on successful login
        profileFetchAttempted = false;
      } else {
        console.warn('Login response missing token');
        throw new Error('Invalid server response: missing token');
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      throw error;
    }
  },

  async register(userData) {
    try {
      console.log('Attempting registration:', { email: userData.email });
      const response = await api.post('/auth/register', userData);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        // Reset profile fetch flag on successful registration
        profileFetchAttempted = false;
      }
      return response;
    } catch (error) {
      console.error('Registration error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) {
        console.log('No token found, skipping getCurrentUser');
        return null;
      }

      // Prevent duplicate profile fetches
      if (profileFetchAttempted) {
        console.log('Profile fetch already attempted, skipping');
        return null;
      }

      console.log('Fetching current user profile');
      profileFetchAttempted = true;
      
      const response = await api.get('/auth/profile');
      return response;
    } catch (error) {
      console.error('Get current user error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        this.logout();
        return null;
      }
      
      if (error.response?.status === 404) {
        return null;
      }
      
      throw error;
    }
  },

  async logout() {
    localStorage.removeItem('token');
    // Reset profile fetch flag on logout
    profileFetchAttempted = false;
    return true;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
}; 