import api from './api';

const storageService = {
  /**
   * Get storage usage metrics and breakdown by category
   */
  getStorageMetrics: async () => {
    const response = await api.get('/storage/metrics');
    return response.data;
  }
};

export default storageService;
