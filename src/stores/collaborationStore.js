import { create } from 'zustand';
import collaborationService from '../api/collaborationApi';

const useCollaborationStore = create((set) => ({
    collaborations: [],
    currentCollaboration: null,
    isLoading: false,
    error: null,

    // Create Collaboration
    createCollaboration: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await collaborationService.createCollaboration(data);

            if (response && response.success) {
                set((state) => ({
                    collaborations: [response.data, ...state.collaborations],
                    isLoading: false
                }));
                return { success: true, data: response.data };
            } else {
                throw new Error(response?.message || 'Failed to create collaboration');
            }
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to create collaboration';
            set({ error: errorMessage, isLoading: false });
            return { success: false, error: errorMessage };
        }
    },

    clearError: () => set({ error: null })
}));

export default useCollaborationStore;
