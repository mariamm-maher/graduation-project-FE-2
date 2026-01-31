import { create } from 'zustand';
import adminService from '../api/adminApi';

const useAdminStore = create((set) => ({
  // State
  analytics: null,
  users: [],
  sessions: [],
  collaborations: [],
  campaigns: [],
  isLoading: false,
  error: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  clearError: () => set({ error: null }),

  // Fetch Analytics
  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getAnalytics();
      
      if (response.success) {
        set({ 
          analytics: response.data,
          isLoading: false,
          error: null 
        });
        return { success: true, data: response.data };
      }
      
      throw new Error(response.message || 'Failed to fetch analytics');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch analytics';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch Users
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getUsers();
      
      if (response.success) {
        set({ 
          users: response.data || [],
          isLoading: false,
          error: null 
        });
        return { success: true, data: response.data };
      }
      
      throw new Error(response.message || 'Failed to fetch users');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch users';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch Sessions
  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getSessions();
      
      if (response.success) {
        set({ 
          sessions: response.data || [],
          isLoading: false,
          error: null 
        });
        return { success: true, data: response.data };
      }
      
      throw new Error(response.message || 'Failed to fetch sessions');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch sessions';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch Collaborations
  fetchCollaborations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getCollaborations();
      
      if (response.success) {
        set({ 
          collaborations: response.data || [],
          isLoading: false,
          error: null 
        });
        return { success: true, data: response.data };
      }
      
      throw new Error(response.message || 'Failed to fetch collaborations');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch collaborations';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch Campaigns
  fetchCampaigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getCampaigns();
      
      if (response.success) {
        set({ 
          campaigns: response.data || [],
          isLoading: false,
          error: null 
        });
        return { success: true, data: response.data };
      }
      
      throw new Error(response.message || 'Failed to fetch campaigns');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch campaigns';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Clear all data
  clearAdminData: () => set({ 
    analytics: null,
    users: [],
    sessions: [],
    collaborations: [],
    campaigns: [],
    error: null 
  }),
}));

export default useAdminStore;
