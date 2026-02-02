import api from '../config/axios';

const ownerService = {
    // Get influencers
    getInfluencers: async (page = 1, limit = 10) => {
        try {
            const response = await api.get(`/owner/influencers?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch influencers';
        }
    },
};

export default ownerService;
