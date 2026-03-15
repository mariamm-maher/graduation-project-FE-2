import { create } from 'zustand';
import collaborationRequestsService from '../api/CollaborationRequestsApi';

const useCollaborationRequestsStore = create((set) => ({
  requests: [],
  sentRequests: [],
  receivedRequests: [],
  currentRequest: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  },

  // Fetch all collaboration requests
  getRequests: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationRequestsService.getRequests(params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || Array.isArray(payload);

      if (!ok && !payload?.requests) {
        throw new Error(payload?.message || 'Failed to fetch collaboration requests');
      }

      const requests = payload?.requests || payload?.data || (Array.isArray(payload) ? payload : []);
      const pagination = payload?.pagination || null;

      set({
        requests,
        pagination: pagination || { currentPage: 1, totalPages: 1, totalItems: requests.length, itemsPerPage: 10 },
        isLoading: false
      });
      return { success: true, data: requests };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch collaboration requests';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch sent requests
  getMySentRequests: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationRequestsService.getMySentRequests(params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || Array.isArray(payload);

      if (!ok && !payload?.requests) {
        throw new Error(payload?.message || 'Failed to fetch sent requests');
      }

      const requests = payload?.requests || payload?.data || (Array.isArray(payload) ? payload : []);
      const pagination = payload?.pagination || null;

      set({ sentRequests: requests, pagination: pagination || {}, isLoading: false });
      return { success: true, data: requests };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch sent requests';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch received requests
  getMyReceivedRequests: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationRequestsService.getMyReceivedRequests(params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || Array.isArray(payload);

      if (!ok && !payload?.requests) {
        throw new Error(payload?.message || 'Failed to fetch received requests');
      }

      const requests = payload?.requests || payload?.data || (Array.isArray(payload) ? payload : []);
      const pagination = payload?.pagination || null;

      set({ receivedRequests: requests, pagination: pagination || {}, isLoading: false });
      return { success: true, data: requests };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch received requests';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Create a new request
  createRequest: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationRequestsService.createRequest(data);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to create request');
      }

      const request = payload?.request || payload?.data || payload;
      set((state) => ({
        sentRequests: [request, ...state.sentRequests],
        isLoading: false
      }));
      return { success: true, data: request };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to create request';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Respond to a request
  respondToRequest: async (id, data = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationRequestsService.respondToRequest(id, data);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to respond to request');
      }

      const request = payload?.request || payload?.data || payload;
      set((state) => ({
        receivedRequests: state.receivedRequests.map((r) => (r.id === id || r._id === id ? { ...r, ...request } : r)),
        isLoading: false
      }));
      return { success: true, data: request };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to respond to request';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Cancel a request
  cancelRequest: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationRequestsService.cancelRequest(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to cancel request');
      }

      set((state) => ({
        sentRequests: state.sentRequests.filter((r) => r.id !== id && r._id !== id),
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to cancel request';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  clearError: () => set({ error: null })
}));

export default useCollaborationRequestsStore;
