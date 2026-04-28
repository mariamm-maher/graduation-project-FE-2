import { create } from 'zustand';
import ownerService from '../api/ownerApi';

const useOwnerStore = create((set) => ({
    // ─── Owner Overview ─────────────────────────────────────────────────────
    ownerOverview: null,
    overviewLoading: false,
    overviewError: null,

    // Fetch owner overview
    fetchOverview: async (params = {}) => {
        set({ overviewLoading: true, overviewError: null });
        try {
            const response = await ownerService.getOverview(params);
            const payload = response?.data ?? response ?? {};
            const ok = response?.success === true || payload?.status === 'success' || payload?.success === true;

            if (!ok && !payload?.overview && !payload?.data) {
                throw new Error(payload?.message || response?.message || 'Failed to fetch owner overview');
            }

            const overview = payload?.overview ?? payload?.data ?? payload;
            set({ ownerOverview: overview, overviewLoading: false });
            return { success: true, data: overview };
        } catch (error) {
            const msg = typeof error === 'string' ? error : error.message || 'Failed to fetch owner overview';
            set({ overviewError: msg, overviewLoading: false });
            return { success: false, error: msg };
        }
    },

    // ─── Influencers ────────────────────────────────────────────────────────
    influencers: [],
    currentInfluencer: null,
    influencerLoading: false,
    influencerError: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    },
    isLoading: false,
    error: null,

    // Fetch influencers (robust to multiple response shapes)
    getInfluencers: async (page = 1, limit = 10) => {
        set({ isLoading: true, error: null });
        try {
            const response = await ownerService.getInfluencers(page, limit);
            // Normalize payload: ownerService may return axios response or a normalized object
            const payload = response?.data ?? response ?? {};
            const ok = response?.success === true || payload?.status === 'success' || payload?.success === true;
            if (response && ok) {
                // influencers array may be at payload.data.influencers or payload.influencers
                const influencers = payload.data?.influencers ?? payload.influencers ?? [];

                // pagination may be nested under payload.data.pagination or payload.pagination
                const paginationSource = payload.data?.pagination ?? payload.pagination ?? payload.data ?? {};

                set({
                    influencers: influencers,
                    pagination: {
                        currentPage: paginationSource.currentPage ?? paginationSource.page ?? page,
                        totalPages: paginationSource.totalPages ?? 1,
                        totalItems: paginationSource.totalItems ?? paginationSource.total ?? (influencers.length || 0),
                        itemsPerPage: paginationSource.itemsPerPage ?? limit
                    },
                    isLoading: false
                });

                return { success: true, data: payload.data ?? payload };
            } else {
                throw new Error(payload?.message || response?.message || 'Failed to fetch influencers');
            }
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch influencers';
            set({ error: errorMessage, isLoading: false });
            return { success: false, error: errorMessage };
        }
    },

    // Fetch single influencer profile
    fetchInfluencerById: async (id) => {
        set({ influencerLoading: true, influencerError: null, currentInfluencer: null });
        try {
            const response = await ownerService.getInfluencerById(id);
            const payload = response?.data ?? response ?? {};
            const ok = response?.success === true || payload?.status === 'success' || payload?.success === true;

            if (response && ok) {
                const influencer = payload.data?.influencer ?? payload.influencer ?? null;
                set({ currentInfluencer: influencer, influencerLoading: false });
                return { success: true, data: influencer };
            } else {
                throw new Error(payload?.message || response?.message || 'Failed to fetch influencer');
            }
        } catch (error) {
            const msg = typeof error === 'string' ? error : error.message || 'Failed to fetch influencer';
            set({ influencerError: msg, influencerLoading: false });
            return { success: false, error: msg };
        }
    },

    // Active influencers
    activeInfluencers: [],
    activeInfluencersLoading: false,
    activeInfluencersError: null,
    activePagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    },

    fetchActiveInfluencers: async (page = 1, limit = 10) => {
        set({ activeInfluencersLoading: true, activeInfluencersError: null });
        try {
            const response = await ownerService.getActiveInfluencers(page, limit);
            const payload = response?.data ?? response ?? {};
            const ok = response?.success === true || payload?.status === 'success' || payload?.success === true;

            if (!ok) {
                throw new Error(payload?.message || response?.message || 'Failed to fetch active influencers');
            }

            // Backend returns: { data: { collaborations: [...] } }
            const collaborations = payload?.data?.collaborations ?? payload?.collaborations ?? [];

            set({
                activeInfluencers: Array.isArray(collaborations) ? collaborations : [],
                activeInfluencersLoading: false
            });

            return { success: true, data: Array.isArray(collaborations) ? collaborations : [] };
        } catch (error) {
            const msg = typeof error === 'string' ? error : error.message || 'Failed to fetch active influencers';
            set({ activeInfluencersError: msg, activeInfluencersLoading: false });
            return { success: false, error: msg };
        }
    },

    // Past influencers
    pastInfluencers: [],
    pastInfluencersLoading: false,
    pastInfluencersError: null,
    pastPagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    },

    fetchPastInfluencers: async (page = 1, limit = 10) => {
        set({ pastInfluencersLoading: true, pastInfluencersError: null });
        try {
            const response = await ownerService.getPastInfluencers(page, limit);
            const payload = response?.data ?? response ?? {};
            const ok = response?.success === true || payload?.status === 'success' || payload?.success === true;

            if (!ok) {
                throw new Error(payload?.message || response?.message || 'Failed to fetch past influencers');
            }

            // Backend returns: { data: { collaborations: [...] } }
            const collaborations = payload?.data?.collaborations ?? payload?.collaborations ?? [];

            set({
                pastInfluencers: Array.isArray(collaborations) ? collaborations : [],
                pastInfluencersLoading: false
            });

            return { success: true, data: Array.isArray(collaborations) ? collaborations : [] };
        } catch (error) {
            const msg = typeof error === 'string' ? error : error.message || 'Failed to fetch past influencers';
            set({ pastInfluencersError: msg, pastInfluencersLoading: false });
            return { success: false, error: msg };
        }
    },

    // ─── Marketplace ────────────────────────────────────────────────────────
    services: [],
    serviceDetail: null,
    marketplacePagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    },
    marketplaceLoading: false,
    marketplaceError: null,
    myOffers: [],

    // Fetch marketplace services
    fetchServices: async (params = {}) => {
        set({ marketplaceLoading: true, marketplaceError: null });
        try {
            const response = await ownerService.getMarketplaceServices(params);
            const data = response?.data || response;
            set({
                services: data.services || data.items || [],
                marketplacePagination: {
                    currentPage: data.currentPage || data.page || params.page || 1,
                    totalPages: data.totalPages || 1,
                    totalItems: data.totalItems || data.total || 0,
                    itemsPerPage: params.limit || 10
                },
                marketplaceLoading: false
            });
            return { success: true };
        } catch (error) {
            const msg = typeof error === 'string' ? error : error.message || 'Failed to fetch services';
            set({ marketplaceError: msg, marketplaceLoading: false });
            return { success: false, error: msg };
        }
    },

    // Fetch single service detail
    fetchServiceDetail: async (serviceId) => {
        set({ marketplaceLoading: true, marketplaceError: null, serviceDetail: null });
        try {
            const response = await ownerService.getServiceDetail(serviceId);
            const data = response?.data || response;
            set({ serviceDetail: data, marketplaceLoading: false });
            return { success: true, data };
        } catch (error) {
            const msg = typeof error === 'string' ? error : error.message || 'Failed to fetch service';
            set({ marketplaceError: msg, marketplaceLoading: false });
            return { success: false, error: msg };
        }
    },

    // Send an offer
    sendOffer: async (data) => {
        try {
            const response = await ownerService.sendOffer(data);
            return { success: true, data: response?.data || response };
        } catch (error) {
            const msg = typeof error === 'string' ? error : error.message || 'Failed to send offer';
            return { success: false, error: msg };
        }
    },

    // Fetch owner's sent offers
    fetchMyOffers: async (params = {}) => {
        set({ marketplaceLoading: true, marketplaceError: null });
        try {
            const response = await ownerService.getMyOffers(params);
            const data = response?.data || response;
            set({ myOffers: data.offers || data || [], marketplaceLoading: false });
            return { success: true };
        } catch (error) {
            const msg = typeof error === 'string' ? error : error.message || 'Failed to fetch offers';
            set({ marketplaceError: msg, marketplaceLoading: false });
            return { success: false, error: msg };
        }
    },

    // Clear errors
    clearError: () => set({
        error: null,
        marketplaceError: null,
        overviewError: null,
        influencerError: null,
        activeInfluencersError: null,
        pastInfluencersError: null
    })
}));

export default useOwnerStore;
