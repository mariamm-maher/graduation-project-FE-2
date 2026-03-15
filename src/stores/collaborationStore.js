import { create } from 'zustand';
import collaborationService from '../api/collaborationApi';

const useCollaborationStore = create((set) => ({
    collaborations: [],
    currentCollaboration: null,
    isLoading: false,
    error: null,
    
    // Sent requests state
    sentRequests: [],
    sentRequestsPagination: null,
    isSentRequestsLoading: false,
    sentRequestsError: null,

    // Owner collaborations state
    ownerCollaborations: [],
    ownerCollaborationsPagination: null,
    isOwnerCollaborationsLoading: false,
    ownerCollaborationsError: null,

    // Fetch my owner collaborations
    getMyOwnerCollaborations: async (params = {}) => {
        set({ isOwnerCollaborationsLoading: true, ownerCollaborationsError: null });
        try {
            const response = await collaborationService.getMyOwnerCollaborations(params);
            
            const payload = response?.data ?? response ?? {};
            const ok = response?.success === true || payload?.status === 'success' || payload?.success === true || Array.isArray(payload);

            if (!ok && !payload?.collaborations) {
                throw new Error(payload?.message || response?.message || 'Failed to fetch owner collaborations');
            }

            const collaborations = payload?.collaborations || payload?.data || (Array.isArray(payload) ? payload : []);
            const pagination = payload?.pagination || null;

            set({
                ownerCollaborations: collaborations,
                ownerCollaborationsPagination: pagination,
                isOwnerCollaborationsLoading: false
            });
            return { success: true, data: collaborations };
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error?.response?.data?.message || error?.message || 'Failed to fetch owner collaborations';
            set({ ownerCollaborationsError: errorMessage, isOwnerCollaborationsLoading: false });
            return { success: false, error: errorMessage };
        }
    },

    // Fetch sent collaboration requests
    getSentRequests: async (params = {}) => {
        set({ isSentRequestsLoading: true, sentRequestsError: null });
        try {
            const response = await collaborationService.getSentRequests(params);
            
            const payload = response?.data ?? response ?? {};
            const ok = response?.success === true || payload?.status === 'success' || payload?.success === true || Array.isArray(payload);

            if (!ok && !payload?.requests) {
                throw new Error(payload?.message || response?.message || 'Failed to fetch sent requests');
            }

            const requests = payload?.requests || payload?.data || (Array.isArray(payload) ? payload : []);
            const pagination = payload?.pagination || null;

            set({
                sentRequests: requests,
                sentRequestsPagination: pagination,
                isSentRequestsLoading: false
            });
            return { success: true, data: requests };
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error?.response?.data?.message || error?.message || 'Failed to fetch sent requests';
            set({ sentRequestsError: errorMessage, isSentRequestsLoading: false });
            return { success: false, error: errorMessage };
        }
    },

    // Respond to a request (accept, reject, counter)
    respondToRequest: async (id, data = {}) => {
        set({ isSentRequestsLoading: true, sentRequestsError: null });
        try {
            const response = await collaborationService.respondToRequest(id, data);
            const payload = response?.data ?? response ?? {};
            
            const ok = response?.success === true || payload?.status === 'success' || payload?.success === true;
            if (!ok) {
                throw new Error(payload?.message || response?.message || 'Failed to respond to request');
            }

            const updatedRequest = payload.data?.request ?? payload.data ?? payload.request ?? null;

            set((state) => ({
                sentRequests: state.sentRequests.map((r) => (r.id === id ? (updatedRequest && typeof updatedRequest === 'object' ? { ...r, ...updatedRequest } : {
                    ...r,
                    status: data?.action === 'accept' ? 'accepted' : data?.action === 'reject' ? 'rejected' : 'negotiating',
                    counterPrice: data?.newBudget ?? r.counterPrice,
                    responseMessage: data?.responseMessage ?? r.responseMessage
                }) : r)),
                isSentRequestsLoading: false
            }));

            return { success: true, data: updatedRequest };
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error?.response?.data?.message || error?.message || 'Failed to respond to request';
            set({ sentRequestsError: errorMessage, isSentRequestsLoading: false });
            return { success: false, error: errorMessage };
        }
    },

    // Send alternative collaboration request
    sendCollaborationRequest: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const response = await collaborationService.sendCollaborationRequest(payload);

            if (response && response.success) {
                set((state) => ({
                    collaborations: [response.data, ...state.collaborations],
                    currentCollaboration: response.data,
                    isLoading: false
                }));
                return { success: true, data: response.data };
            } else {
                throw new Error(response?.message || 'Failed to send collaboration request');
            }
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to send collaboration request';
            set({ error: errorMessage, isLoading: false });
            return { success: false, error: errorMessage };
        }
    },

    // Create a contract for a collaboration
    createContract: async (collaborationId, payload) => {
        set({ isLoading: true, error: null });
        try {
            const response = await collaborationService.createContract(collaborationId, payload);
            if (response && (response.success || response.status === 'success' || response.data)) {
                set({ isLoading: false });
                return { success: true, data: response.data || response };
            } else {
                throw new Error(response?.message || 'Failed to create contract');
            }
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error?.response?.data?.message || error?.message || 'Failed to create contract';
            set({ error: errorMessage, isLoading: false });
            return { success: false, error: errorMessage };
        }
    },

    clearError: () => set({ error: null })
}));

export default useCollaborationStore;
