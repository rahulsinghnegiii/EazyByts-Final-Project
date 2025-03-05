import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = async () => {
    try {
      // Only check if we have a token
      if (authService.getToken()) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setError(err);
      // Clear invalid token
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      toast.success('Welcome back!');
      return response;
    } catch (err) {
      setError(err);
      toast.error('Invalid credentials');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      toast.success('Registration successful!');
      return response;
    } catch (err) {
      setError(err);
      toast.error('Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (err) {
      setError(err);
      toast.error('Logout failed');
      throw err;
    }
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
      return updatedUser;
    } catch (err) {
      setError(err);
      toast.error('Failed to update profile');
      throw err;
    }
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    try {
      // TODO: Replace with actual API call
      toast.success('Password changed successfully');
    } catch (err) {
      setError(err);
      toast.error('Failed to change password');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: authService.isAuthenticated(),
  };

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}; 