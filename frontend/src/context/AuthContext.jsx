import React, { useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { STORAGE_KEYS } from '../utils/constants';
import { AuthContext } from './auth-context';

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
      const verified = await authService.verifyToken();
      if (verified?.valid && verified.user) {
        setUser(verified.user);
      } else {
        authService.logout();
        setUser(null);
      }
    } catch (err) {
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
      if (!data?.token || !data?.user) {
        throw new Error('Login response did not include a token and user.');
      }
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
      if (!data?.token || !data?.user) {
        throw new Error('Registration response did not include a token and user.');
      }
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
