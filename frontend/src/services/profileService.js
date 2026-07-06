import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

const profileService = {
  /**
   * Get user profile details
   */
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data?.user || response.data;
  },

  /**
   * Update profile information
   * @param {Object} profileData { name, email, avatar }
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    if (response.data?.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Change user password
   * @param {Object} passwords { currentPassword, newPassword }
   */
  changePassword: async (passwords) => {
    const response = await api.put('/profile/password', passwords);
    return response.data;
  }
};

export default profileService;
