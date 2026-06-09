import { create } from 'zustand';
import brandDashboardService from '../api/brandDashboardApi';

const useBrandDashboardStore = create((set) => ({
  // State
  dashboardData: null,
  aiInsights: null,
  performanceTrend: null,
  isLoading: false,
  isInsightsLoading: false,
  isTrendLoading: false,
  error: null,
  activeChartPeriod: 'monthly',
  activeChartMetric: 'reach',
  platformData: null,
  isPlatformLoading: false,
  activePlatform: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),
  setPerformanceTrend: (performanceTrend) => set({ performanceTrend }),
  setTrendLoading: (isTrendLoading) => set({ isTrendLoading }),

  setInsightsLoading: (isInsightsLoading) => set({ isInsightsLoading }),

  setError: (error) => set({ error, isLoading: false }),

  clearError: () => set({ error: null }),

  setChartPeriod: (period) => set({ activeChartPeriod: period }),

  setChartMetric: (metric) => set({ activeChartMetric: metric }),

  setActivePlatform: (platform) => set({ activePlatform: platform }),

  // Fetch brand dashboard data
  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await brandDashboardService.getBrandDashboard();
      console.log('Brand Dashboard API Response:', response);
      
      if (response?.success || response?.status === 'success') {
        const data = response?.data || response;
        set({ 
          dashboardData: data,
          performanceTrend: data.performanceTrend ?? null,
          isLoading: false,
          error: null 
        });
        return { success: true, data };
      }
      
      throw new Error(response?.message || 'Failed to fetch brand dashboard data');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch brand dashboard data';
      console.error('Brand Dashboard API Error:', error);
      set({ 
        error: errorMessage, 
        isLoading: false,
        dashboardData: null
      });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch AI insights
  fetchAIInsights: async () => {
    set({ isInsightsLoading: true });
    try {
      const response = await brandDashboardService.getAIInsights();
      
      if (response?.success || response?.status === 'success') {
        const data = response?.data || response;
        set({ 
          aiInsights: data, 
          isInsightsLoading: false
        });
        return { success: true, data };
      }
      
      throw new Error(response?.message || 'Failed to fetch AI insights');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch AI insights';
      set({ 
        isInsightsLoading: false,
        aiInsights: null
      });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch performance trend
  fetchPerformanceTrend: async (period, metric) => {
    set({ isTrendLoading: true, error: null });
    try {
      const response = await brandDashboardService.getPerformanceTrend(period, metric);

      if (response?.success || response?.status === 'success') {
        const data = response?.data || response;
        set({ performanceTrend: data, isTrendLoading: false, error: null });
        return { success: true, data };
      }

      throw new Error(response?.message || 'Failed to fetch performance trend');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch performance trend';
      set({ isTrendLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch platform analytics
  fetchPlatformAnalytics: async () => {
    set({ isPlatformLoading: true });
    try {
      const res = await brandDashboardService.getPlatformAnalytics();
      const platforms = res.data?.data?.platforms || res.data?.platforms || [];
      set({
        platformData: platforms,
        activePlatform: platforms[0]?.platform ?? null,
        isPlatformLoading: false,
      });
    } catch (err) {
      console.error('PlatformAnalytics fetch failed', err);
      set({ isPlatformLoading: false });
    }
  },
}));

export default useBrandDashboardStore;
