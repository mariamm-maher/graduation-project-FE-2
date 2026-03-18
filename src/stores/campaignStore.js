 
import { create } from 'zustand';
import campaignService from '../api/campaign';

const useCampaignStore = create((set) => ({
  // State
  campaigns: [],
  currentCampaign: null,
  campaignsOverview: null,
  activeTrackingTools: null,
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  isLoading: false,
  error: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  clearError: () => set({ error: null }),

  // Save and Publish Campaign
  saveAndPublishCampaign: async (campaignData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.saveAndPublishCampaign(campaignData);
      if (response.success) {
        set((state) => ({
          campaigns: [response.data, ...state.campaigns],
          currentCampaign: response.data,
          isLoading: false,
          error: null,
        }));
        return { success: true, data: response.data };
      }
      throw new Error(response.message || 'Failed to save and publish campaign');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to save and publish campaign';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Save Campaign
  saveCampaign: async (campaignData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.saveCampaign(campaignData);
      if (response.success) {
        set((state) => ({
          campaigns: [response.data, ...state.campaigns],
          currentCampaign: response.data,
          isLoading: false,
          error: null,
        }));
        return { success: true, data: response.data };
      }
      throw new Error(response.message || 'Failed to save campaign');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to save campaign';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Save Campaign as Draft
  saveDraftCampaign: async (draftData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.saveDraftCampaign(draftData);
      if (response.success) {
        set((state) => ({
          campaigns: [response.data, ...state.campaigns],
          currentCampaign: response.data,
          isLoading: false,
          error: null,
        }));
        return { success: true, data: response.data };
      }
      throw new Error(response.message || 'Failed to save campaign as draft');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to save campaign as draft';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Generate Campaign with AI
  generateCampaignAI: async (aiData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.generateCampaignAI(aiData);
      if (response.success) {
        set({ isLoading: false, error: null });
        return { success: true, data: response.data, aiPreview: response.data?.aiPreview };
      }
      throw new Error(response.message || 'Failed to generate campaign with AI');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to generate campaign with AI';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },
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
  fetchCampaigns: async ({ page = 1, limit = 10, lifecycleStage } = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.getCampaigns({ page, limit, lifecycleStage });

      // response shape: { status, message, data: { campaigns, pagination } }
      if (response.status === 'success' || response.success) {
        const campaigns = response.data?.campaigns || [];
        const pagination = response.data?.pagination || { total: 0, page, limit, totalPages: 0 };
        set({ campaigns, pagination, isLoading: false, error: null });
        return { success: true, data: campaigns, pagination };
      }

      throw new Error(response.message || 'Failed to fetch campaigns');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch campaigns';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch Active Campaigns
  fetchActiveCampaigns: async ({ page = 1, limit = 10 } = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.getActiveCampaigns({ page, limit });

      if (response.status === 'success' || response.success) {
        const campaigns = response.data?.campaigns || [];
        const trackingTools = response.data?.trackingTools || null;

        const total =
          response.data?.pagination?.total ??
          trackingTools?.totalActiveCampaigns ??
          campaigns.length;

        const totalPages = response.data?.pagination?.totalPages ?? Math.max(1, Math.ceil(total / limit));

        const pagination = {
          total,
          page: response.data?.pagination?.page ?? page,
          limit: response.data?.pagination?.limit ?? limit,
          totalPages,
        };

        set({ campaigns, activeTrackingTools: trackingTools, pagination, isLoading: false, error: null });
        return { success: true, data: campaigns, trackingTools, pagination };
      }

      throw new Error(response.message || 'Failed to fetch active campaigns');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch active campaigns';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch Campaigns Overview
  fetchCampaignsOverview: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.getCampaignsOverview();
      // response shape: { status, message, data: { totalCampaigns, totalSaved, recentCampaigns } }
      if (response.status === 'success' || response.success) {
        const overview = response.data || null;
        set({ campaignsOverview: overview, isLoading: false, error: null });
        return { success: true, data: overview };
      }

      throw new Error(response.message || 'Failed to fetch campaigns overview');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch campaigns overview';
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
