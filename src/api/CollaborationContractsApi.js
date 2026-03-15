import api from '../config/axios';

const collaborationContractsService = {
  // POST /api/collaboration-contracts/collaboration/{collaborationId}
  // Create a contract for a collaboration
  createContract: async (collaborationId, data) => {
    try {
      const response = await api.post(`/collaboration-contracts/collaboration/${collaborationId}`, data);
      return response.data;
    } catch (error) {
      console.error('Create contract error:', error);
      throw error.response?.data?.message || 'Failed to create contract';
    }
  },

  // GET /api/collaboration-contracts/collaboration/{collaborationId}
  // Get contract for a collaboration
  getContractByCollaboration: async (collaborationId) => {
    try {
      const response = await api.get(`/collaboration-contracts/collaboration/${collaborationId}`);
      return response.data;
    } catch (error) {
      console.error('Get contract by collaboration error:', error);
      throw error.response?.data?.message || 'Failed to fetch contract';
    }
  },

  // PATCH /api/collaboration-contracts/{id}
  // Update a contract
  updateContract: async (id, data) => {
    try {
      const response = await api.patch(`/collaboration-contracts/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update contract error:', error);
      throw error.response?.data?.message || 'Failed to update contract';
    }
  },

  // PATCH /api/collaboration-contracts/{id}/send
  // Send contract for signature
  sendContract: async (id) => {
    try {
      const response = await api.patch(`/collaboration-contracts/${id}/send`);
      return response.data;
    } catch (error) {
      console.error('Send contract error:', error);
      throw error.response?.data?.message || 'Failed to send contract';
    }
  },

  // PATCH /api/collaboration-contracts/{id}/sign
  // Sign a contract
  signContract: async (id) => {
    try {
      const response = await api.patch(`/collaboration-contracts/${id}/sign`);
      return response.data;
    } catch (error) {
      console.error('Sign contract error:', error);
      throw error.response?.data?.message || 'Failed to sign contract';
    }
  }
};

export default collaborationContractsService;
