import api from '../config/axios';

// Admin Service Functions
const adminService = {
  // Get analytics data
  getAnalytics: async () => {
    try {
      const response = await api.get('/admin/analytics');
      console.log('Analytics response:', response);
      return response.data;
    } catch (error) {
      console.error('Analytics error:', error);
      throw error.response?.data?.message || 'Failed to fetch analytics';
    }
  },

  // Get all users
  getUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      console.log('Users response:', response);
      return response.data;
    } catch (error) {
      console.error('Users error:', error);
      throw error.response?.data?.message || 'Failed to fetch users';
    }
  },

  // Get all sessions
  getSessions: async () => {
    try {
      const response = await api.get('/admin/sessions');
      console.log('Sessions response:', response);
      return response.data;
    } catch (error) {
      console.error('Sessions error:', error);
      throw error.response?.data?.message || 'Failed to fetch sessions';
    }
  },

  // Get all collaborations
  getCollaborations: async () => {
    try {
      const response = await api.get('/admin/collaborations');
      console.log('Collaborations response:', response);
      return response.data;
    } catch (error) {
      console.error('Collaborations error:', error);
      throw error.response?.data?.message || 'Failed to fetch collaborations';
    }
  },

  // Get all campaigns
  getCampaigns: async () => {
    try {
      const response = await api.get('/admin/campaigns');
      console.log('Campaigns response:', response);
      return response.data;
    } catch (error) {
      console.error('Campaigns error:', error);
      throw error.response?.data?.message || 'Failed to fetch campaigns';
    }
  },
};

export default adminService;
