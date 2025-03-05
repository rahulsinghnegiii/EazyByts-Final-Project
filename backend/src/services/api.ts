import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
      withCredentials: true // Important for CORS
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Don't override Content-Type for FormData
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }
        
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized error
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login'; // Redirect to login
        } else if (error.response?.status === 503) {
          console.error('Service unavailable:', error.response.data);
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(email: string, password: string): Promise<AxiosResponse> {
    try {
      const response = await this.api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<AxiosResponse> {
    try {
      const response = await this.api.post('/auth/register', userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Event methods
  async createEvent(formData: FormData): Promise<AxiosResponse> {
    try {
      // Log FormData for debugging
      console.log('Creating event with data:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Get the token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Make the request with explicit headers
      const response = await this.api.post('/events', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Let the browser set the correct Content-Type for FormData
        }
      });

      return response;
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  }

  async getEvents(): Promise<AxiosResponse> {
    try {
      return await this.api.get('/events');
    } catch (error) {
      console.error('Get events error:', error);
      throw error;
    }
  }

  async getEventById(id: string): Promise<AxiosResponse> {
    try {
      return await this.api.get(`/events/${id}`);
    } catch (error) {
      console.error('Get event error:', error);
      throw error;
    }
  }

  async updateEvent(id: string, formData: FormData): Promise<AxiosResponse> {
    try {
      return await this.api.put(`/events/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error('Update event error:', error);
      throw error;
    }
  }

  async deleteEvent(id: string): Promise<AxiosResponse> {
    try {
      return await this.api.delete(`/events/${id}`);
    } catch (error) {
      console.error('Delete event error:', error);
      throw error;
    }
  }

  async registerForEvent(eventId: string): Promise<AxiosResponse> {
    try {
      return await this.api.post(`/events/${eventId}/register`);
    } catch (error) {
      console.error('Event registration error:', error);
      throw error;
    }
  }

  async cancelEventRegistration(eventId: string): Promise<AxiosResponse> {
    try {
      return await this.api.delete(`/events/${eventId}/register`);
    } catch (error) {
      console.error('Cancel registration error:', error);
      throw error;
    }
  }

  // Helper methods
  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }
}

export const apiService = new ApiService();
export default apiService; 