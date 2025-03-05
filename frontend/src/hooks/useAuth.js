import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Implement actual API call
          const mockUser = {
            id: '1',
            name: 'John Doe',
            email: credentials.email,
          };
          set({ user: mockUser, isAuthenticated: true });
        } catch (error) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Implement actual API call
          const mockUser = {
            id: '1',
            name: data.name,
            email: data.email,
          };
          set({ user: mockUser, isAuthenticated: true });
        } catch (error) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    register: store.register,
    logout: store.logout,
    clearError: store.clearError,
  };
}; 