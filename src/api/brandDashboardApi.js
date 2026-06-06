import api from '../config/axios';

// Brand Dashboard API Service
const brandDashboardService = {
  // Get brand dashboard data
  getBrandDashboard: async () => {
    try {
      const response = await api.get('/owner/brand-dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch brand dashboard data';
    }
  },

  // Get AI insights
  getAIInsights: async () => {
    try {
      const response = await api.get('/owner/ai-insights');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch AI insights';
    }
  },

  // Get performance trend data
  getPerformanceTrend: async (period, metric) => {
    try {
      const response = await api.get('/owner/performance-trend', {
        params: { period, metric }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch performance trend';
    }
  },

  // Get platform analytics data
  getPlatformAnalytics: async () => {
    try {
      const response = await api.get('/owner/platform-analytics');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch platform analytics';
    }
  },
};

export default brandDashboardService;
