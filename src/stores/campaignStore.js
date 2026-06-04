import { create } from 'zustand';
import campaignService from '../api/campaign';

function extractActiveCampaignsList(response = {}) {
  const payload = response?.data ?? response ?? {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.campaigns)) return payload.campaigns;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.campaigns)) return payload.data.campaigns;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.activeCampaigns)) return payload.activeCampaigns;
  if (Array.isArray(payload.results)) return payload.results;

  return [];
}

function extractActivePagination(response = {}, campaigns = [], page = 1, limit = 10) {
  const payload = response?.data ?? response ?? {};
  const pagination =
    response?.pagination ||
    payload?.pagination ||
    payload?.data?.pagination ||
    null;

  if (pagination) {
    return {
      total: pagination.total ?? campaigns.length,
      page: pagination.page ?? page,
      limit: pagination.limit ?? limit,
      totalPages: pagination.totalPages ?? Math.max(1, Math.ceil((pagination.total ?? campaigns.length) / limit)),
    };
  }

  const trackingTools = payload?.trackingTools || response?.trackingTools || null;
  const total =
    trackingTools?.totalActiveCampaigns ??
    campaigns.length;

  return {
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

function extractCampaignDetail(response = {}) {
  const payload = response?.data ?? response ?? {};

  return (
    payload?.campaign ||
    payload?.data?.campaign ||
    payload?.data ||
    payload
  );
}

const useCampaignStore = create((set) => ({
  // State
  campaigns: [],           // all-campaigns list (AllCampaigns)
  activeCampaigns: [],     // active-campaigns list (ActiveCampaigns)
  draftCampaigns: [],      // draft-campaigns list (DraftCampaigns)
  completedCampaigns: [],  // completed-campaigns list (CompletedCampaigns)
  currentCampaign: null,
  campaignsOverview: null,
  activeTrackingTools: null,
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  activePagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  draftPagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  completedPagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  campaignAnalytics: null,
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
  // generateCampaignAI: async (aiData) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const response = await campaignService.generateCampaignAI(aiData);
  //     if (response.success) {
  //       set({ isLoading: false, error: null });
  //       return { success: true, data: response.data, aiPreview: response.data?.aiPreview };
  //     }
  //     throw new Error(response.message || 'Failed to generate campaign with AI');
  //   } catch (error) {
  //     const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to generate campaign with AI';
  //     set({ error: errorMessage, isLoading: false });
  //     return { success: false, error: errorMessage };
  //   }
  // },
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

  // Fetch Campaigns (all — used by AllCampaigns page)
  fetchCampaigns: async ({ page = 1, limit = 10, lifecycleStage } = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.getCampaigns({ page, limit, lifecycleStage });

      if (response.status === 'success' || response.success) {
        const campaigns = response.data?.campaigns || [];
        const pagination = response.data?.pagination || { total: 0, page, limit, totalPages: 0 };

        // Route to the right slice based on the lifecycle filter
        if (lifecycleStage === 'draft') {
          set({ draftCampaigns: campaigns, draftPagination: pagination, isLoading: false, error: null });
        } else if (lifecycleStage === 'completed') {
          set({ completedCampaigns: campaigns, completedPagination: pagination, isLoading: false, error: null });
        } else {
          set({ campaigns, pagination, isLoading: false, error: null });
        }
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

        const activePagination = {
          total,
          page: response.data?.pagination?.page ?? page,
          limit: response.data?.pagination?.limit ?? limit,
          totalPages,
        };

        set({ activeCampaigns: campaigns, activeTrackingTools: trackingTools, activePagination, isLoading: false, error: null });
        return { success: true, data: campaigns, trackingTools, pagination: activePagination };
      }

      throw new Error(response.message || 'Failed to fetch active campaigns');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch active campaigns';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch Active Campaigns with Smart Tracking (Enhanced)
  fetchActiveCampaignsWithTracking: async ({ page = 1, limit = 10 } = {}) => {
    set({ isLoading: true, error: null });
    try {
      // Try enhanced endpoint first
      const response = await campaignService.getActiveCampaignsWithTracking({ page, limit });

      if (response.status === 'success' || response.success) {
        let campaigns = extractActiveCampaignsList(response);
        let activePagination = extractActivePagination(response, campaigns, page, limit);
        let payload = response?.data ?? response ?? {};
        let trackingTools = payload?.trackingTools || response?.trackingTools || null;

        if (campaigns.length === 0) {
          const legacyResponse = await campaignService.getActiveCampaigns({ page, limit });
          if (legacyResponse.status === 'success' || legacyResponse.success) {
            campaigns = legacyResponse.data?.campaigns || extractActiveCampaignsList(legacyResponse);
            trackingTools = legacyResponse.data?.trackingTools || trackingTools;
            activePagination = extractActivePagination(legacyResponse, campaigns, page, limit);
            payload = legacyResponse?.data ?? legacyResponse ?? {};
          }
        }

        set({
          activeCampaigns: campaigns,
          activeTrackingTools: trackingTools || {
            totalActiveCampaigns: activePagination.total,
            enhanced: true,
          },
          activePagination,
          isLoading: false,
          error: null,
        });
        return { success: true, data: campaigns, pagination: activePagination };
      }

      throw new Error(response.message || 'Failed to fetch enhanced tracking data');
    } catch (error) {
      // Fallback to legacy endpoint if enhanced fails
      console.warn('Enhanced tracking failed, falling back to legacy:', error);
      // Call the legacy action directly
      const fallbackResponse = await campaignService.getActiveCampaigns({ page, limit });
      
      if (fallbackResponse.status === 'success' || fallbackResponse.success) {
        const campaigns = fallbackResponse.data?.campaigns || [];
        const trackingTools = fallbackResponse.data?.trackingTools || null;
        const total = fallbackResponse.data?.pagination?.total ?? trackingTools?.totalActiveCampaigns ?? campaigns.length;
        const totalPages = fallbackResponse.data?.pagination?.totalPages ?? Math.max(1, Math.ceil(total / limit));
        
        set({ 
          activeCampaigns: campaigns, 
          activeTrackingTools: trackingTools, 
          activePagination: {
            total,
            page: fallbackResponse.data?.pagination?.page ?? page,
            limit: fallbackResponse.data?.pagination?.limit ?? limit,
            totalPages,
          }, 
          isLoading: false, 
          error: null 
        });
        return { success: true, data: campaigns, trackingTools };
      }
      
      throw new Error(fallbackResponse.message || 'Failed to fetch campaigns');
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
    set({ isLoading: true, error: null, currentCampaign: null });
    try {
      const response = await campaignService.getCampaignById(id);
      console.log('Campaign Detail API Response:', response);
      
      if (response.status === 'success' || response.success || response.status === 200) {
        const campaign = extractCampaignDetail(response);
        console.log('Normalized Campaign Detail:', campaign);
        set({ 
          currentCampaign: campaign,
          isLoading: false,
          error: null 
        });
        return { success: true, data: campaign };
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

  // Fetch Campaign Analytics (overview or single campaign)
  fetchCampaignAnalytics: async (campaignId = null) => {
    set({ isLoading: true, error: null });
    try {
      const response = campaignId 
        ? await campaignService.getCampaignAnalytics(campaignId)
        : await campaignService.getCampaignAnalytics();
      if (response.status === 'success' || response.success) {
        set({ campaignAnalytics: response.data, isLoading: false, error: null });
        return { success: true, data: response.data };
      }
      throw new Error(response.message || 'Failed to fetch campaign analytics');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch campaign analytics';
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
