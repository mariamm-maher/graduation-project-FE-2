import { create } from 'zustand';
import ownerService from '../api/ownerApi';

const useOwnerStore = create((set) => ({
    // ─── Influencers ────────────────────────────────────────────────────────
    influencers: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    },
    isLoading: false,
    error: null,

    // Fetch influencers
    getInfluencers: async (page = 1, limit = 10) => {
        set({ isLoading: true, error: null });
        try {
            const response = await ownerService.getInfluencers(page, limit);
            if (response && response.success) {
                set({
                    influencers: response.data.influencers || [],
                    pagination: {
                        currentPage: response.data.currentPage || page,
                        totalPages: response.data.totalPages || 1,
                        totalItems: response.data.totalItems || 0,
                        itemsPerPage: limit
                    },
                    isLoading: false
                });
                return response;
            } else {
                throw new Error(response?.message || 'Failed to fetch influencers');
            }
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch influencers';
            set({ error: errorMessage, isLoading: false });
            return { success: false, error: errorMessage };
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
    clearError: () => set({ error: null, marketplaceError: null })
}));

export default useOwnerStore;
