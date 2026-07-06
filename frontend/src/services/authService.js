import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

const persistSession = (data) => {
  if (data?.token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
  }

  if (data?.user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
  }
};

const authService = {
  /**
   * Log in user with credentials
   * @param {Object} credentials { email, password }
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    persistSession(response.data);
    return response.data;
  },

  /**
   * Register a new account
   * @param {Object} userData { name, email, password }
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    persistSession(response.data);
    return response.data;
  },

  /**
   * Log out user and clear storage
   */
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Get currently logged in user profile from storage
   */
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch {
      localStorage.removeItem(STORAGE_KEYS.USER);
      return null;
    }
  },

  /**
   * Verify token validity with backend
   */
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    persistSession(response.data);
    return response.data;
  }
};

export default authService;
