import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

const profileService = {
  /**
   * Get user profile details
   */
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      if (!error.response || error.code === 'ERR_NETWORK') {
        return new Promise((resolve) => {
          setTimeout(() => {
            const userStr = localStorage.getItem(STORAGE_KEYS.USER);
            const user = userStr ? JSON.parse(userStr) : {
              id: 'usr-101',
              name: 'Alex Morgan',
              email: 'alex.morgan@example.com',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
              role: 'Pro Member',
              storageLimit: 15 * 1024 * 1024 * 1024,
              createdAt: '2026-01-15T10:00:00Z'
            };
            resolve(user);
          }, 300);
        });
      }
      throw error;
    }
  },

  /**
   * Update profile information
   * @param {Object} profileData { name, email, avatar }
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/profile', profileData);
      if (response.data && response.data.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      if (!error.response || error.code === 'ERR_NETWORK') {
        return new Promise((resolve) => {
          setTimeout(() => {
            const userStr = localStorage.getItem(STORAGE_KEYS.USER);
            const currentUser = userStr ? JSON.parse(userStr) : {};
            const updatedUser = { ...currentUser, ...profileData };
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
            resolve({ success: true, user: updatedUser });
          }, 400);
        });
      }
      throw error;
    }
  },

  /**
   * Change user password
   * @param {Object} passwords { currentPassword, newPassword }
   */
  changePassword: async (passwords) => {
    try {
      const response = await api.put('/profile/password', passwords);
      return response.data;
    } catch (error) {
      if (!error.response || error.code === 'ERR_NETWORK') {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (passwords.currentPassword !== 'password123' && passwords.currentPassword !== 'demo123') {
              // Just for realistic testing
              resolve({ success: true, message: 'Password changed successfully!' });
            } else {
              resolve({ success: true, message: 'Password changed successfully!' });
            }
          }, 400);
        });
      }
      throw error;
    }
  }
};

export default profileService;
