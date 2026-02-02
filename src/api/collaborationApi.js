import api from '../config/axios';

const collaborationService = {
    // Create a new collaboration proposal
    createCollaboration: async (data) => {
        try {
            const response = await api.post('/collaborations', data);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to create collaboration request';
        }
    },
};

export default collaborationService;
