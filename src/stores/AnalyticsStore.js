import { create } from 'zustand';
import analyticsService from '../api/analyticsApi';

const useAnalyticsStore = create((set) => ({
  analytics: null,
  campaignAnalytics: null,
  earningsAnalytics: null,
  collaborationAnalytics: null,
  roiAnalytics: null,
  isLoading: false,
  error: null,

  // Get general analytics
  getAnalytics: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await analyticsService.getAnalytics(params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.analytics;

      if (!ok) {
        throw new Error(payload?.message || 'Failed to fetch analytics');
      }

      const analytics = payload?.analytics || payload?.data || payload;
      set({ analytics, isLoading: false });
      return { success: true, data: analytics };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch analytics';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get campaign analytics
  getCampaignAnalytics: async (campaignId, params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await analyticsService.getCampaignAnalytics(campaignId, params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.analytics;

      if (!ok) {
        throw new Error(payload?.message || 'Failed to fetch campaign analytics');
      }

      const analytics = payload?.analytics || payload?.data || payload;
      set({ campaignAnalytics: analytics, isLoading: false });
      return { success: true, data: analytics };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch campaign analytics';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get earnings analytics
  getEarningsAnalytics: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await analyticsService.getEarningsAnalytics(params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.earnings;

      if (!ok) {
        throw new Error(payload?.message || 'Failed to fetch earnings analytics');
      }

      const earnings = payload?.earnings || payload?.data || payload;
      set({ earningsAnalytics: earnings, isLoading: false });
      return { success: true, data: earnings };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch earnings analytics';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get collaboration analytics
  getCollaborationAnalytics: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await analyticsService.getCollaborationAnalytics(params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.collaborations;

      if (!ok) {
        throw new Error(payload?.message || 'Failed to fetch collaboration analytics');
      }

      const collaborations = payload?.collaborations || payload?.data || payload;
      set({ collaborationAnalytics: collaborations, isLoading: false });
      return { success: true, data: collaborations };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch collaboration analytics';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get ROI analytics
  getROIAnalytics: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await analyticsService.getROIAnalytics(params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.roi;

      if (!ok) {
        throw new Error(payload?.message || 'Failed to fetch ROI analytics');
      }

      const roi = payload?.roi || payload?.data || payload;
      set({ roiAnalytics: roi, isLoading: false });
      return { success: true, data: roi };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch ROI analytics';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  clearError: () => set({ error: null })
}));

export default useAnalyticsStore;
