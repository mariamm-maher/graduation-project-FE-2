import { create } from 'zustand';
import ownerService from '../api/ownerApi';

const useOwnerStore = create((set) => ({
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

    // Clear error
    clearError: () => set({ error: null })
}));

export default useOwnerStore;
