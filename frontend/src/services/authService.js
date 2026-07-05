import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

// Helper to simulate mock token generation for local development without active backend
const createMockToken = (user) => {
  return btoa(JSON.stringify({ ...user, exp: Date.now() + 86400000 }));
};

const authService = {
  /**
   * Log in user with credentials
   * @param {Object} credentials { email, password }
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data && response.data.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      // Fallback for local frontend development/demo when backend is offline
      if (!error.response || error.code === 'ERR_NETWORK') {
        return new Promise((resolve) => {
          setTimeout(() => {
            const mockUser = {
              id: 'usr-101',
              name: credentials.email.split('@')[0].replace('.', ' ') || 'Alex Morgan',
              email: credentials.email,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
              role: 'Pro Member',
              storageLimit: 15 * 1024 * 1024 * 1024,
              createdAt: new Date().toISOString()
            };
            const mockToken = createMockToken(mockUser);
            localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
            resolve({ token: mockToken, user: mockUser });
          }, 800);
        });
      }
      throw error;
    }
  },

  /**
   * Register a new account
   * @param {Object} userData { name, email, password }
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data && response.data.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      if (!error.response || error.code === 'ERR_NETWORK') {
        return new Promise((resolve) => {
          setTimeout(() => {
            const mockUser = {
              id: 'usr-' + Math.floor(100 + Math.random() * 900),
              name: userData.name,
              email: userData.email,
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
              role: 'Free Tier',
              storageLimit: 15 * 1024 * 1024 * 1024,
              createdAt: new Date().toISOString()
            };
            const mockToken = createMockToken(mockUser);
            localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
            resolve({ token: mockToken, user: mockUser });
          }, 800);
        });
      }
      throw error;
    }
  },

  /**
   * Log out user and clear storage
   */
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Get currently logged in user profile from storage or API
   */
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  /**
   * Verify token validity with backend
   */
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      // If network error, check if local token exists
      if (!error.response || error.code === 'ERR_NETWORK') {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) return { valid: true };
      }
      throw error;
    }
  }
};

export default authService;
