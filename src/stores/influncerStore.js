import { create } from 'zustand';
import collaborationService from '../api/collaborationApi';

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
      const ok = response?.success === true || payload?.status === 'success' || payload?.success === true;

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
  }
}));

export default useInfluncerStore;
