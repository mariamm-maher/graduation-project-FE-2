import api from '../config/axios';

const socialMediaService = {
  // Placeholder for future social media integrations
  // This service handles connections, syncing, and interactions with social media platforms
  
  connectAccount: async (platform, data) => {
    try {
      const response = await api.post(`/social-media/${platform}/connect`, data);
      return response.data;
    } catch (error) {
      console.error('Connect social media account error:', error);
      throw error.response?.data?.message || 'Failed to connect social media account';
    }
  },

  disconnectAccount: async (platform) => {
    try {
      const response = await api.post(`/social-media/${platform}/disconnect`);
      return response.data;
    } catch (error) {
      console.error('Disconnect social media account error:', error);
      throw error.response?.data?.message || 'Failed to disconnect social media account';
    }
  },

  getAccounts: async () => {
    try {
      const response = await api.get('/social-media/accounts');
      return response.data;
    } catch (error) {
      console.error('Get social media accounts error:', error);
      throw error.response?.data?.message || 'Failed to fetch social media accounts';
    }
  },

  getStats: async (platform) => {
    try {
      const response = await api.get(`/social-media/${platform}/stats`);
      return response.data;
    } catch (error) {
      console.error('Get social media stats error:', error);
      throw error.response?.data?.message || 'Failed to fetch social media stats';
    }
  }
};

export default socialMediaService;
