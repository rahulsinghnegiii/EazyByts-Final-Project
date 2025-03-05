import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

class AuthService {
  private static TOKEN_KEY = 'token';
  private static USER_KEY = 'user';

  async login(credentials: LoginCredentials): Promise<User> {
    const response = await api.post<{ token: string; user: User }>('/auth/login', credentials);
    const { token, user } = response.data;
    
    this.setToken(token);
    this.setUser(user);
    
    return user;
  }

  async register(data: RegisterData): Promise<User> {
    const response = await api.post<{ token: string; user: User }>('/auth/register', data);
    const { token, user } = response.data;
    
    this.setToken(token);
    this.setUser(user);
    
    return user;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      this.clearAuth();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<User>('/auth/me');
      const user = response.data;
      this.setUser(user);
      return user;
    } catch (error) {
      this.clearAuth();
      return null;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.patch<User>('/auth/profile', data);
    const updatedUser = response.data;
    this.setUser(updatedUser);
    return updatedUser;
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.post('/auth/change-password', data);
  }

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  }

  async resetPassword(data: { token: string; password: string }): Promise<void> {
    await api.post('/auth/reset-password', data);
  }

  getToken(): string | null {
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(AuthService.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(AuthService.TOKEN_KEY, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
  }

  private clearAuth(): void {
    localStorage.removeItem(AuthService.TOKEN_KEY);
    localStorage.removeItem(AuthService.USER_KEY);
  }
}

export const authService = new AuthService();
export default authService; 