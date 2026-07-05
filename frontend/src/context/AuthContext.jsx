import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { STORAGE_KEYS } from '../utils/constants';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initAuth = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Try to verify token or get current user
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        const verified = await authService.verifyToken();
        if (verified && verified.user) {
          setUser(verified.user);
        }
      }
    } catch (err) {
      console.error('Auth initialization failed:', err);
      authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();

    // Listen for auto logout event from Axios interceptor when 401 Unauthorized occurs
    const handleUnauthorized = () => {
      setUser(null);
      setError('Your session has expired. Please log in again.');
    };

    window.addEventListener('cloudvault:auth-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('cloudvault:auth-unauthorized', handleUnauthorized);
    };
  }, [initAuth]);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const updateUserData = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUserData,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
