import api from '../config/axios';

const analyticsService = {

  // GET /api/analytics
  // Get dashboard overview
  getDashboard: async (params = {}) => {
    try {
      const { role, dateRange = '30d' } = params;
      const query = new URLSearchParams({ dateRange });
      if (role) query.set('role', role);
      const response = await api.get(`/analytics?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get dashboard overview error:', error);
      throw error.response?.data?.message || 'Failed to fetch dashboard overview';
    }
  },

  // GET /api/analytics/campaigns
  // Campaign performance
  getCampaignsAnalytics: async (params = {}) => {
    try {
      const { dateRange = '30d' } = params;
      const query = new URLSearchParams({ dateRange });
      const response = await api.get(`/analytics/campaigns?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get campaigns analytics error:', error);
      throw error.response?.data?.message || 'Failed to fetch campaign analytics';
    }
  },

  // GET /api/analytics/earnings
  // Earnings overview (influencer)
  getEarnings: async (params = {}) => {
    try {
      const { period = 'monthly' } = params;
      const query = new URLSearchParams({ period });
      const response = await api.get(`/analytics/earnings?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get earnings overview error:', error);
      throw error.response?.data?.message || 'Failed to fetch earnings overview';
    }
  },

  // GET /api/analytics/collaborations
  // Collaboration analytics
  getCollaborationsAnalytics: async (params = {}) => {
    try {
      const { userId, dateRange = '30d' } = params;
      const query = new URLSearchParams({ dateRange });
      if (userId) query.set('userId', userId);
      const response = await api.get(`/analytics/collaborations?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get collaborations analytics error:', error);
      throw error.response?.data?.message || 'Failed to fetch collaboration analytics';
    }
  },

  // GET /api/analytics/roi
  // ROI analysis (owner)
  getRoiAnalytics: async (params = {}) => {
    try {
      const { userId, dateRange = '30d' } = params;
      const query = new URLSearchParams({ dateRange });
      if (userId) query.set('userId', userId);
      const response = await api.get(`/analytics/roi?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get ROI analytics error:', error);
      throw error.response?.data?.message || 'Failed to fetch ROI analysis';
    }
  },
};

export default analyticsService;