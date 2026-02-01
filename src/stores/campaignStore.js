import { create } from 'zustand';
import campaignService from '../api/campaign';

const useCampaignStore = create((set) => ({
  // State
  campaigns: [],
  currentCampaign: null,
  isLoading: false,
  error: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  clearError: () => set({ error: null }),

  // Create Campaign
  createCampaign: async (campaignData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.createCampaign(campaignData);
      
      if (response.success) {
        set((state) => ({ 
          campaigns: [response.data.campaign, ...state.campaigns],
          currentCampaign: response.data.campaign,
          isLoading: false,
          error: null 
        }));
        return { 
          success: true, 
          data: response.data,
          campaign: response.data.campaign,
          aiPreview: response.data.aiPreview 
        };
      }
      
      throw new Error(response.message || 'Failed to create campaign');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to create campaign';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch Campaigns
  fetchCampaigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.getCampaigns();
      
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

  // Fetch Campaign by ID
  fetchCampaignById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.getCampaignById(id);
      
      if (response.success) {
        set({ 
          currentCampaign: response.data,
          isLoading: false,
          error: null 
        });
        return { success: true, data: response.data };
      }
      
      throw new Error(response.message || 'Failed to fetch campaign');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch campaign';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Update Campaign
  updateCampaign: async (id, campaignData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.updateCampaign(id, campaignData);
      
      if (response.success) {
        set((state) => ({ 
          campaigns: state.campaigns.map(c => c.id === id ? response.data : c),
          currentCampaign: response.data,
          isLoading: false,
          error: null 
        }));
        return { success: true, data: response.data };
      }
      
      throw new Error(response.message || 'Failed to update campaign');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to update campaign';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Delete Campaign
  deleteCampaign: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.deleteCampaign(id);
      
      if (response.success) {
        set((state) => ({ 
          campaigns: state.campaigns.filter(c => c.id !== id),
          currentCampaign: null,
          isLoading: false,
          error: null 
        }));
        return { success: true, message: response.message };
      }
      
      throw new Error(response.message || 'Failed to delete campaign');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to delete campaign';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Clear Campaign Data
  clearCampaignData: () => set({ 
    campaigns: [],
    currentCampaign: null,
    error: null 
  }),
}));

export default useCampaignStore;
