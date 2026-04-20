import { create } from 'zustand';
import collaborationService from '../api/collaborationApi';

const useCollaborationStore = create((set) => ({
    collaborations: [],
    currentCollaboration: null,
    isLoading: false,
    error: null,

    // Overview state
    collaborationsOverview: null,
    isCollaborationsOverviewLoading: false,
    collaborationsOverviewError: null,
    
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

    // Influencer collaborations state
    influencerCollaborations: [],
    influencerCollaborationsPagination: null,
    isInfluencerCollaborationsLoading: false,
    influencerCollaborationsError: null,

    // Single collaboration state
    isCurrentCollaborationLoading: false,
    currentCollaborationError: null,

    // Aggregated workspace state
    collaborationWorkspace: null,
    isCollaborationWorkspaceLoading: false,
    collaborationWorkspaceError: null,

    // Fetch collaborations overview
    getCollaborationsOverview: async () => {
        set({ isCollaborationsOverviewLoading: true, collaborationsOverviewError: null });
        try {
            const response = await collaborationService.getCollaborationsOverview();

            const payload = response?.data ?? response ?? {};
            const ok = response?.success === true || payload?.status === 'success' || payload?.success === true || typeof payload === 'object';

            if (!ok) {
                throw new Error(payload?.message || response?.message || 'Failed to fetch collaborations overview');
            }

            const overview = payload?.overview || payload?.data || payload;

            set({
                collaborationsOverview: overview,
                isCollaborationsOverviewLoading: false
            });

            return { success: true, data: overview };
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error?.response?.data?.message || error?.message || 'Failed to fetch collaborations overview';
            set({ collaborationsOverviewError: errorMessage, isCollaborationsOverviewLoading: false });
            return { success: false, error: errorMessage };
        }
    },

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

    // Fetch my influencer collaborations
    getMyInfluencerCollaborations: async (params = {}) => {
        set({ isInfluencerCollaborationsLoading: true, influencerCollaborationsError: null });
        try {
            const response = await collaborationService.getMyInfluencerCollaborations(params);

            const payload = response?.data ?? response ?? {};
            const ok = response?.success === true || payload?.status === 'success' || payload?.success === true || Array.isArray(payload);

            if (!ok && !payload?.collaborations) {
                throw new Error(payload?.message || response?.message || 'Failed to fetch influencer collaborations');
            }

            const collaborations = payload?.collaborations || payload?.data || (Array.isArray(payload) ? payload : []);
            const pagination = payload?.pagination || null;

            set({
                influencerCollaborations: collaborations,
                influencerCollaborationsPagination: pagination,
                isInfluencerCollaborationsLoading: false
            });
            return { success: true, data: collaborations };
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error?.response?.data?.message || error?.message || 'Failed to fetch influencer collaborations';
            set({ influencerCollaborationsError: errorMessage, isInfluencerCollaborationsLoading: false });
            return { success: false, error: errorMessage };
        }
    },

    // Fetch collaboration by ID
    getCollaborationById: async (id) => {
        set({ isCurrentCollaborationLoading: true, currentCollaborationError: null });
        try {
            const response = await collaborationService.getCollaborationById(id);

            const payload = response?.data ?? response ?? {};
            const ok = response?.success === true || payload?.status === 'success' || payload?.success === true || typeof payload === 'object';

            if (!ok) {
                throw new Error(payload?.message || response?.message || 'Failed to fetch collaboration');
            }

            const collaboration = payload?.collaboration || payload?.data || payload;

            set({
                currentCollaboration: collaboration,
                isCurrentCollaborationLoading: false
            });

            return { success: true, data: collaboration };
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error?.response?.data?.message || error?.message || 'Failed to fetch collaboration';
            set({ currentCollaborationError: errorMessage, isCurrentCollaborationLoading: false });
            return { success: false, error: errorMessage };
        }
    },

    // Fetch one-page collaboration workspace
    fetchCollaborationWorkspace: async (id) => {
        set({ isCollaborationWorkspaceLoading: true, collaborationWorkspaceError: null });
        try {
            const response = await collaborationService.getCollaborationWorkspace(id);

            const payload = response?.data ?? response ?? {};
            const ok = response?.success === true || payload?.status === 'success' || payload?.success === true || typeof payload === 'object';

            if (!ok) {
                throw new Error(payload?.message || response?.message || 'Failed to fetch collaboration workspace');
            }

            const workspace = payload?.workspace || payload?.data || payload;

            set({
                collaborationWorkspace: workspace,
                isCollaborationWorkspaceLoading: false
            });

            return { success: true, data: workspace };
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error?.response?.data?.message || error?.message || 'Failed to fetch collaboration workspace';
            set({ collaborationWorkspaceError: errorMessage, isCollaborationWorkspaceLoading: false });
            return { success: false, error: errorMessage };
        }
    },

    // Cancel a collaboration
    cancelCollaboration: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await collaborationService.cancelCollaboration(id);

            const payload = response?.data ?? response ?? {};
            const ok = response?.success === true || payload?.status === 'success' || payload?.success === true;

            if (!ok) {
                throw new Error(payload?.message || response?.message || 'Failed to cancel collaboration');
            }

            set((state) => ({
                ownerCollaborations: state.ownerCollaborations.map((collab) =>
                    (collab?.id === id || collab?._id === id)
                        ? { ...collab, status: 'cancelled' }
                        : collab
                ),
                influencerCollaborations: state.influencerCollaborations.map((collab) =>
                    (collab?.id === id || collab?._id === id)
                        ? { ...collab, status: 'cancelled' }
                        : collab
                ),
                currentCollaboration:
                    state.currentCollaboration && (state.currentCollaboration?.id === id || state.currentCollaboration?._id === id)
                        ? { ...state.currentCollaboration, status: 'cancelled' }
                        : state.currentCollaboration,
                isLoading: false
            }));

            return { success: true, data: payload };
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error?.response?.data?.message || error?.message || 'Failed to cancel collaboration';
            set({ error: errorMessage, isLoading: false });
            return { success: false, error: errorMessage };
        }
    },

    // Complete a collaboration
    completeCollaboration: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await collaborationService.completeCollaboration(id);

            const payload = response?.data ?? response ?? {};
            const ok = response?.success === true || payload?.status === 'success' || payload?.success === true;

            if (!ok) {
                throw new Error(payload?.message || response?.message || 'Failed to complete collaboration');
            }

            set((state) => ({
                ownerCollaborations: state.ownerCollaborations.map((collab) =>
                    (collab?.id === id || collab?._id === id)
                        ? { ...collab, status: 'completed' }
                        : collab
                ),
                influencerCollaborations: state.influencerCollaborations.map((collab) =>
                    (collab?.id === id || collab?._id === id)
                        ? { ...collab, status: 'completed' }
                        : collab
                ),
                currentCollaboration:
                    state.currentCollaboration && (state.currentCollaboration?.id === id || state.currentCollaboration?._id === id)
                        ? { ...state.currentCollaboration, status: 'completed' }
                        : state.currentCollaboration,
                isLoading: false
            }));

            return { success: true, data: payload };
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error?.response?.data?.message || error?.message || 'Failed to complete collaboration';
            set({ error: errorMessage, isLoading: false });
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

    clearError: () => set({
        error: null,
        collaborationsOverviewError: null,
        sentRequestsError: null,
        ownerCollaborationsError: null,
        influencerCollaborationsError: null,
        currentCollaborationError: null,
        collaborationWorkspaceError: null
    })
}));

export default useCollaborationStore;
