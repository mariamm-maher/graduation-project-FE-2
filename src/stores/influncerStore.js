import { create } from 'zustand';
import collaborationService from '../api/collaborationApi';
import influncerService from '../api/influncerApi';
import { normalizeExploreCampaign } from '../features/dashboard/influncerDashboard/utils/collaborationUtils';

const useInfluncerStore = create((set) => ({
  // Received collaboration requests (for influencer)
  receivedRequests: [],
  receivedRequestsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  },
  receivedRequestsLoading: false,
  receivedRequestsError: null,
  respondingId: null,
  respondError: null,

  // General influencer collaborations
  influencerCollaborations: [],
  influencerCollaborationsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  },
  influencerCollaborationsLoading: false,
  influencerCollaborationsError: null,

  // Influencer overview
  overview: null,
  overviewLoading: false,
  overviewError: null,

  // Explore campaigns
  exploreCampaigns: [],
  exploreCampaignsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  },
  exploreCampaignsLoading: false,
  exploreCampaignsError: null,

  // Single campaign
  selectedCampaign: null,
  selectedCampaignLoading: false,
  selectedCampaignError: null,

  // Apply to campaign
  applyingCampaignId: null,
  applyCampaignError: null,

  // Contact owner
  contactOwnerLoading: false,
  contactOwnerError: null,
  contactOwnerSuccess: false,

  // Single collaboration detail
  selectedCollaboration: null,
  selectedCollaborationLoading: false,
  selectedCollaborationError: null,

  fetchInfluencerOverview: async (params = {}) => {
    set({ overviewLoading: true, overviewError: null });
    try {
      const response = await influncerService.getOverview(params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.success === true || response?.status === 200;

      if (!ok && !payload?.kpis) {
        throw new Error(response?.message || payload?.message || 'Failed to fetch influencer overview');
      }

      const overview = payload?.kpis || payload?.performanceSeries || payload?.activeCampaigns
        ? payload
        : payload?.data ?? {};

      set({ overview, overviewLoading: false });
      return { success: true, data: overview };
    } catch (error) {
      const errorMessage = typeof error === 'string'
        ? error
        : error?.response?.data?.message || error?.message || 'Failed to fetch influencer overview';
      set({ overviewError: errorMessage, overviewLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  fetchInfluencerOverviewStats: async (params = {}) => {
    set({ overviewLoading: true, overviewError: null });
    try {
      const response = await influncerService.getOverviewStats(params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.success === true || payload?.status === 'success' || response?.status === 200;

      if (!ok && !payload?.overview && !payload?.stats && !payload?.data) {
        throw new Error(response?.message || payload?.message || 'Failed to fetch influencer overview stats');
      }

      const overview = payload?.overview ?? payload?.stats ?? payload?.data ?? payload;

      set({ overview, overviewLoading: false });
      return { success: true, data: overview };
    } catch (error) {
      const errorMessage = typeof error === 'string'
        ? error
        : error?.response?.data?.message || error?.message || 'Failed to fetch influencer overview stats';
      set({ overviewError: errorMessage, overviewLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  fetchExploreCampaigns: async (params = {}) => {
    set({ exploreCampaignsLoading: true, exploreCampaignsError: null });
    try {
      const response = await influncerService.getExploreCampaigns(params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.success === true || response?.status === 200
        || Array.isArray(payload) || payload?.campaigns || payload?.items;

      if (!ok) {
        throw new Error(response?.message || payload?.message || 'Failed to fetch discover campaigns');
      }

      const rawCampaigns = payload?.campaigns || payload?.items
        || payload?.data?.campaigns || payload?.data?.items
        || payload?.data?.data?.campaigns || payload?.data?.data?.items
        || (Array.isArray(payload) ? payload : []);
      const campaigns = rawCampaigns.map(normalizeExploreCampaign);
      const paginationSource = payload?.pagination || payload?.data?.pagination || {};

      set({
        exploreCampaigns: campaigns,
        exploreCampaignsPagination: {
          currentPage: paginationSource.currentPage ?? paginationSource.page ?? params.page ?? 1,
          totalPages: paginationSource.totalPages ?? 1,
          totalItems: paginationSource.totalItems ?? paginationSource.total ?? campaigns.length,
          itemsPerPage: paginationSource.itemsPerPage ?? params.limit ?? 10
        },
        exploreCampaignsLoading: false
      });

      return { success: true, data: campaigns };
    } catch (error) {
      const errorMessage = typeof error === 'string'
        ? error
        : error?.response?.data?.message || error?.message || 'Failed to fetch discover campaigns';
      set({ exploreCampaignsError: errorMessage, exploreCampaignsLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  fetchCampaignById: async (id) => {
    set({ selectedCampaignLoading: true, selectedCampaignError: null });
    try {
      const response = await influncerService.getCampaignById(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.success === true || response?.status === 200;

      if (!ok && !payload?.id && !payload?.campaign && !payload?.data) {
        throw new Error(response?.message || payload?.message || 'Failed to fetch campaign details');
      }

      const campaign = payload?.campaign || payload?.data || payload;
      set({ selectedCampaign: campaign, selectedCampaignLoading: false });
      return { success: true, data: campaign };
    } catch (error) {
      const errorMessage = typeof error === 'string'
        ? error
        : error?.response?.data?.message || error?.message || 'Failed to fetch campaign details';
      set({ selectedCampaignError: errorMessage, selectedCampaignLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  applyToCampaign: async (id, applyData = {}) => {
    set({ applyingCampaignId: id, applyCampaignError: null });
    try {
      const response = await influncerService.applyToCampaign(id, applyData);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.success === true || response?.status === 200 || response?.status === 201;

      if (!ok) {
        throw new Error(response?.message || payload?.message || 'Failed to apply to campaign');
      }

      const applicationData = payload?.application || payload?.data || payload;

      set((state) => ({
        exploreCampaigns: state.exploreCampaigns.map((campaign) =>
          String(campaign.id || campaign._id) === String(id)
            ? {
                ...campaign,
                hasApplied: true,
                applied: true,
                applicationStatus: applicationData?.status || 'applied'
              }
            : campaign
        ),
        selectedCampaign: String(state.selectedCampaign?.id || state.selectedCampaign?._id) === String(id)
          ? {
              ...state.selectedCampaign,
              hasApplied: true,
              applicationStatus: applicationData?.status || 'applied'
            }
          : state.selectedCampaign,
        applyingCampaignId: null
      }));

      return { success: true, data: applicationData };
    } catch (error) {
      const errorMessage = typeof error === 'string'
        ? error
        : error?.response?.data?.message || error?.message || 'Failed to apply to campaign';
      set({ applyCampaignError: errorMessage, applyingCampaignId: null });
      return { success: false, error: errorMessage };
    }
  },

  contactOwner: async (campaignId, message) => {
    set({ contactOwnerLoading: true, contactOwnerError: null, contactOwnerSuccess: false });
    try {
      const response = await influncerService.contactOwner(campaignId, message);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.success === true || response?.status === 200;

      if (!ok && !payload?.sent) {
        throw new Error(response?.message || payload?.message || 'Failed to send message');
      }

      set({ contactOwnerLoading: false, contactOwnerSuccess: true });
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string'
        ? error
        : error?.response?.data?.message || error?.message || 'Failed to send message';
      set({ contactOwnerError: errorMessage, contactOwnerLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  resetContactOwner: () => set({ contactOwnerLoading: false, contactOwnerError: null, contactOwnerSuccess: false }),

  fetchCollaborationById: async (id) => {
    set({ selectedCollaborationLoading: true, selectedCollaborationError: null });
    try {
      const response = await collaborationService.getCollaborationById(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.success === true
        || payload?.collaboration || payload?._id || payload?.id;

      if (!ok && !payload?.collaboration) {
        throw new Error(payload?.message || response?.message || 'Failed to fetch collaboration');
      }

      const collab = payload?.collaboration ?? payload?.data ?? payload;
      set({ selectedCollaboration: collab, selectedCollaborationLoading: false });
      return { success: true, data: collab };
    } catch (error) {
      const errorMessage = typeof error === 'string'
        ? error
        : error?.response?.data?.message || error?.message || 'Failed to fetch collaboration';
      set({ selectedCollaborationError: errorMessage, selectedCollaborationLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch my influencer collaborations
  getMyInfluencerCollaborations: async (params = {}) => {
    set({ influencerCollaborationsLoading: true, influencerCollaborationsError: null });
    try {
      const response = await collaborationService.getMyInfluencerCollaborations(params);
      
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.success === true || Array.isArray(payload);

      if (!ok && !payload?.collaborations) {
        throw new Error(payload?.message || response?.message || 'Failed to fetch influencer collaborations');
      }

      const collaborations = payload?.collaborations || payload?.data || (Array.isArray(payload) ? payload : []);
      const paginationSource = payload?.pagination || payload?.data?.pagination || {};

      set({
        influencerCollaborations: collaborations,
        influencerCollaborationsPagination: {
          currentPage: paginationSource.currentPage ?? paginationSource.page ?? params.page ?? 1,
          totalPages: paginationSource.totalPages ?? 1,
          totalItems: paginationSource.totalItems ?? paginationSource.total ?? collaborations.length,
          itemsPerPage: paginationSource.itemsPerPage ?? params.limit ?? 10
        },
        influencerCollaborationsLoading: false
      });
      return { success: true, data: collaborations };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.response?.data?.message || error?.message || 'Failed to fetch influencer collaborations';
      set({ influencerCollaborationsError: errorMessage, influencerCollaborationsLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch received collaboration requests (robust to multiple response shapes)
  getReceivedRequests: async (page = 1, limit = 10) => {
    set({ receivedRequestsLoading: true, receivedRequestsError: null });
    try {
      const response = await collaborationService.getReceivedRequests({ page, limit });
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.success === true
        || Array.isArray(payload) || payload?.requests || payload?.data?.requests;

      if (response && ok) {
        // Requests may be in payload.data.requests or payload.requests
        const requests = payload.data?.requests ?? payload.requests ?? payload.data?.receivedRequests ?? payload.receivedRequests ?? [];
        const paginationSource = payload.data?.pagination ?? payload.pagination ?? payload.data ?? {};

        set({
          receivedRequests: requests,
          receivedRequestsPagination: {
            currentPage: paginationSource.currentPage ?? paginationSource.page ?? page,
            totalPages: paginationSource.totalPages ?? 1,
            totalItems: paginationSource.totalItems ?? paginationSource.total ?? (requests.length || 0),
            itemsPerPage: paginationSource.itemsPerPage ?? limit
          },
          receivedRequestsLoading: false
        });

        return { success: true, data: requests };
      } else {
        throw new Error(payload?.message || response?.message || 'Failed to fetch received requests');
      }
    } catch (error) {
      const msg = typeof error === 'string' ? error : error.message || 'Failed to fetch received requests';
      set({ receivedRequestsError: msg, receivedRequestsLoading: false });
      return { success: false, error: msg };
    }
  }
,

  // Respond to a received collaboration request (accept/reject/counter)
  respondToRequest: async (id, data = {}) => {
    set({ respondingId: id, respondError: null });
    try {
      const response = await collaborationService.respondToRequest(id, data);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.success === true;

      if (!ok) {
        throw new Error(payload?.message || response?.message || 'Failed to respond to request');
      }

      // Try to find updated request from response payload
      const updatedRequest = payload.data?.request ?? payload.data ?? payload.request ?? null;

      set((state) => ({
        receivedRequests: state.receivedRequests.map((r) => (r.id === id ? (updatedRequest && typeof updatedRequest === 'object' ? { ...r, ...updatedRequest } : { ...r,
          status: data?.action === 'accept' ? 'accepted' : data?.action === 'reject' ? 'rejected' : r.status,
          counterPrice: data?.newBudget ?? r.counterPrice,
          responseMessage: data?.responseMessage ?? r.responseMessage
        }) : r)),
        respondingId: null
      }));

      return { success: true, data: updatedRequest };
    } catch (error) {
      const msg = typeof error === 'string' ? error : error?.message || 'Failed to respond to request';
      set({ respondError: msg, respondingId: null });
      return { success: false, error: msg };
    }
  },

  clearErrors: () => set({
    receivedRequestsError: null,
    respondError: null,
    influencerCollaborationsError: null,
    overviewError: null,
    exploreCampaignsError: null,
    selectedCampaignError: null,
    applyCampaignError: null
  })
}));

export default useInfluncerStore;
