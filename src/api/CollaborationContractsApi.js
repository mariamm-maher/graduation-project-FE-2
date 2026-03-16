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

  // GET /api/collaboration-contracts/mine/owner
  // Get contracts for current owner
  getMyOwnerContracts: async () => {
    try {
      const response = await api.get('/collaboration-contracts/mine/owner');
      return response.data;
    } catch (error) {
      console.error('Get my owner contracts error:', error);
      throw error.response?.data?.message || 'Failed to fetch owner contracts';
    }
  },

  // GET /api/collaboration-contracts/mine/influencer
  // Get contracts for current influencer
  getMyInfluencerContracts: async () => {
    try {
      const response = await api.get('/collaboration-contracts/mine/influencer');
      return response.data;
    } catch (error) {
      console.error('Get my influencer contracts error:', error);
      throw error.response?.data?.message || 'Failed to fetch influencer contracts';
    }
  },

  // PATCH /api/collaboration-contracts/{id}/sign/owner
  // Owner signs contract
  signContractAsOwner: async (id) => {
    try {
      const response = await api.patch(`/collaboration-contracts/${id}/sign/owner`);
      return response.data;
    } catch (error) {
      console.error('Sign contract as owner error:', error);
      throw error.response?.data?.message || 'Failed to sign contract as owner';
    }
  },

  // PATCH /api/collaboration-contracts/{id}/sign/influencer
  // Influencer signs contract
  signContractAsInfluencer: async (id) => {
    try {
      const response = await api.patch(`/collaboration-contracts/${id}/sign/influencer`);
      return response.data;
    } catch (error) {
      console.error('Sign contract as influencer error:', error);
      throw error.response?.data?.message || 'Failed to sign contract as influencer';
    }
  },




};

export default collaborationContractsService;
