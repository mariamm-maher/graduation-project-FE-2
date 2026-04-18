import api from '../config/axios';

const ownerService = {
    // Get owner overview dashboard data
    getOverview: async (params = {}) => {
        try {
            const query = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    query.set(key, value);
                }
            });

            const endpoint = query.toString()
                ? `/owner/overview?${query.toString()}`
                : '/owner/overview';

            const response = await api.get(endpoint);
            console.log('Owner overview response:', response);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch owner overview';
        }
    },

    // Get influencers
    getInfluencers: async (page = 1, limit = 10) => {
        try {
            const response = await api.get(`/owner/influencers?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch influencers';
        }
    },

    // Get single influencer profile
    getInfluencerById: async (id) => {
        try {
            const response = await api.get(`/owner/influencers/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch influencer';
        }
    },

    // Get active influencers
    getActiveInfluencers: async (page = 1, limit = 10) => {
        try {
            const response = await api.get(`/owner/influencers/active?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch active influencers';
        }
    },

    // Get past influencers
    getPastInfluencers: async (page = 1, limit = 10) => {
        try {
            const response = await api.get(`/owner/influencers/past?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch past influencers';
        }
    },

    // ─── Marketplace ────────────────────────────────────────────────────────

    // Get all influencer services (marketplace listing)
    getMarketplaceServices: async (params = {}) => {
        try {
            const { page = 1, limit = 10, category, platform, minPrice, maxPrice, search } = params;
            const query = new URLSearchParams({ page, limit });
            if (category) query.set('category', category);
            if (platform) query.set('platform', platform);
            if (minPrice !== undefined) query.set('minPrice', minPrice);
            if (maxPrice !== undefined) query.set('maxPrice', maxPrice);
            if (search) query.set('search', search);
            const response = await api.get(`/marketplace/services?${query.toString()}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch marketplace services';
        }
    },

    // Get single service detail
    getServiceDetail: async (serviceId) => {
        try {
            const response = await api.get(`/marketplace/services/${serviceId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch service detail';
        }
    },

    // Send an offer to an influencer for their service
    sendOffer: async (data) => {
        try {
            const response = await api.post('/marketplace/offers', data);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to send offer';
        }
    },

    // Get offers sent by owner
    getMyOffers: async (params = {}) => {
        try {
            const { page = 1, limit = 10, status } = params;
            const query = new URLSearchParams({ page, limit });
            if (status) query.set('status', status);
            const response = await api.get(`/marketplace/offers/mine?${query.toString()}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch your offers';
        }
    },
};

export default ownerService;
