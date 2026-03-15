import api from '../config/axios';

const collaborationRequestsService = {
  // POST /api/collaboration-requests
  // Create a new collaboration request
  createRequest: async (data) => {
    try {
      const response = await api.post('/collaboration-requests', data);
      return response.data;
    } catch (error) {
      console.error('Create collaboration request error:', error);
      throw error.response?.data?.message || 'Failed to create collaboration request';
    }
  },

  // GET /api/collaboration-requests
  // List all collaboration requests (paginated)
  getRequests: async (params = {}) => {
    try {
      const { page = 1, limit = 10, status } = params;
      const query = new URLSearchParams({ page, limit });
      if (status) query.set('status', status);
      const response = await api.get(`/collaboration-requests?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get collaboration requests error:', error);
      throw error.response?.data?.message || 'Failed to fetch collaboration requests';
    }
  },

  // GET /api/collaboration-requests/mine/sent
  // Get my sent collaboration requests
  getMySentRequests: async (params = {}) => {
    try {
      const { page = 1, limit = 10, status } = params;
      const query = new URLSearchParams({ page, limit });
      if (status) query.set('status', status);
      const response = await api.get(`/collaboration-requests/mine/sent?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get sent requests error:', error);
      throw error.response?.data?.message || 'Failed to fetch sent requests';
    }
  },

  // GET /api/collaboration-requests/mine/received
  // Get my received collaboration requests
  getMyReceivedRequests: async (params = {}) => {
    try {
      const { page = 1, limit = 10, status } = params;
      const query = new URLSearchParams({ page, limit });
      if (status) query.set('status', status);
      const response = await api.get(`/collaboration-requests/mine/received?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get received requests error:', error);
      throw error.response?.data?.message || 'Failed to fetch received requests';
    }
  },

  // GET /api/collaboration-requests/{id}
  // Get collaboration request by ID
  getRequestById: async (id) => {
    try {
      const response = await api.get(`/collaboration-requests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get request by ID error:', error);
      throw error.response?.data?.message || 'Failed to fetch collaboration request';
    }
  },

  // PATCH /api/collaboration-requests/{id}/respond
  // Respond to a collaboration request
  respondToRequest: async (id, data) => {
    try {
      const response = await api.patch(`/collaboration-requests/${id}/respond`, data);
      return response.data;
    } catch (error) {
      console.error('Respond to request error:', error);
      throw error.response?.data?.message || 'Failed to respond to collaboration request';
    }
  },

  // PATCH /api/collaboration-requests/{id}/cancel
  // Cancel a collaboration request
  cancelRequest: async (id) => {
    try {
      const response = await api.patch(`/collaboration-requests/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Cancel request error:', error);
      throw error.response?.data?.message || 'Failed to cancel collaboration request';
    }
  }
};

export default collaborationRequestsService;
