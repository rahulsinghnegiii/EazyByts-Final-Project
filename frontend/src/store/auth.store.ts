import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authService, type User, type LoginCredentials, type RegisterData } from '../services/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,

        login: async (credentials) => {
          try {
            set({ isLoading: true, error: null });
            const user = await authService.login(credentials);
            set({ user, isAuthenticated: true });
          } catch (error) {
            set({ error: (error as Error).message });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        register: async (data) => {
          try {
            set({ isLoading: true, error: null });
            const user = await authService.register(data);
            set({ user, isAuthenticated: true });
          } catch (error) {
            set({ error: (error as Error).message });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        logout: async () => {
          try {
            set({ isLoading: true, error: null });
            await authService.logout();
            set({ user: null, isAuthenticated: false });
          } catch (error) {
            set({ error: (error as Error).message });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        updateProfile: async (data) => {
          try {
            set({ isLoading: true, error: null });
            const updatedUser = await authService.updateProfile(data);
            set({ user: updatedUser });
          } catch (error) {
            set({ error: (error as Error).message });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        checkAuth: async () => {
          try {
            set({ isLoading: true, error: null });
            const user = await authService.getCurrentUser();
            set({ user, isAuthenticated: !!user });
          } catch (error) {
            set({ error: (error as Error).message });
          } finally {
            set({ isLoading: false });
          }
        },

        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      }
    )
  )
); 