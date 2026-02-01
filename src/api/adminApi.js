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

  // Get recent activity logs
  getRecentLogs: async () => {
    try {
      const response = await api.get('/admin/logs/recent');
      console.log('Recent logs response:', response);
      return response.data;
    } catch (error) {
      console.error('Recent logs error:', error);
      throw error.response?.data?.message || 'Failed to fetch recent logs';
    }
  },

  // Get paginated logs
  getLogs: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/admin/logs?page=${page}&limit=${limit}`);
      console.log('Logs response:', response);
      return response.data;
    } catch (error) {
      console.error('Logs error:', error);
      throw error.response?.data?.message || 'Failed to fetch logs';
    }
  },
};

export default adminService;
