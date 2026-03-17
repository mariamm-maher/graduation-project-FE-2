import api from '../config/axios';

const collaborationService = {

  // GET /api/collaborations/overview
  // Get collaborations overview metrics for dashboard
  getCollaborationsOverview: async () => {
    try {
      const response = await api.get('/collaborations/overview');
      return response.data;
    } catch (error) {
      console.error('Get collaborations overview error:', error);
      throw error.response?.data?.message || 'Failed to fetch collaborations overview';
    }
  },

  
  // POST /api/collaborations/requests
  // Owner sends a collaboration request to an influencer (alternative endpoint)
  sendCollaborationRequest: async (data) => {
    try {
      const response = await api.post('/collaboration-requests', data);
      return response.data;
    } catch (error) {
      console.error('Send collaboration request error:', error);
      throw error.response?.data?.message || 'Failed to send collaboration request';
    }
  },

  // GET /api/collaborations/requests
  // List collaboration requests for a campaign
  getCampaignRequests: async (params = {}) => {
    try {
      const { campaignId, status, page = 1, limit = 10 } = params;
      const query = new URLSearchParams({ page, limit });
      if (campaignId) query.set('campaignId', campaignId);
      if (status) query.set('status', status);
      const response = await api.get(`/collaborations/requests?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get campaign requests error:', error);
      throw error.response?.data?.message || 'Failed to fetch collaboration requests';
    }
  },

  // GET /api/collaborations/requests/mine/sent
  // Get my sent collaboration requests (Owner)
  getSentRequests: async (params = {}) => {
    try {
      const { page = 1, limit = 10, status } = params;
      const query = new URLSearchParams({ page, limit });
      if (status) query.set('status', status);
      const response = await api.get(`/collaborations/requests/mine/sent?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get sent requests error:', error);
      throw error.response?.data?.message || 'Failed to fetch sent collaboration requests';
    }
  },

  // GET /api/collaborations/requests/mine/received
  // Get my received collaboration requests (Influencer)
  getReceivedRequests: async (params = {}) => {
    try {
      const { page = 1, limit = 10, status } = params;
      const query = new URLSearchParams({ page, limit });
      if (status) query.set('status', status);
      const response = await api.get(`/collaborations/requests/mine/received?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get received requests error:', error);
      throw error.response?.data?.message || 'Failed to fetch received collaboration requests';
    }
  },

  // GET /api/collaborations/requests/{id}
  // Get collaboration request by ID
  getRequestById: async (id) => {
    try {
      const response = await api.get(`/collaborations/requests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get request by ID error:', error);
      throw error.response?.data?.message || 'Failed to fetch collaboration request';
    }
  },

  // PATCH /api/collaborations/requests/{id}/respond
  // Respond to a collaboration request (Influencer: accept/reject/counter)
  respondToRequest: async (id, data) => {
    try {
      const response = await api.patch(`/collaborations/requests/${id}/respond`, data);
      return response.data;
    } catch (error) {
      console.error('Respond to request error:', error);
      throw error.response?.data?.message || 'Failed to respond to collaboration request';
    }
  },

  // PATCH /api/collaborations/requests/{id}/cancel
  // Cancel a collaboration request (Owner)
  cancelRequest: async (id) => {
    try {
      const response = await api.patch(`/collaborations/requests/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Cancel request error:', error);
      throw error.response?.data?.message || 'Failed to cancel collaboration request';
    }
  },

  // GET /api/collaborations/mine/owner
  // Get my collaborations as owner
  getMyOwnerCollaborations: async (params = {}) => {
    try {
      const { page = 1, limit = 10, status } = params;
      const query = new URLSearchParams({ page, limit });
      if (status) query.set('status', status);
      const response = await api.get(`/collaborations/mine/owner?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get owner collaborations error:', error);
      throw error.response?.data?.message || 'Failed to fetch owner collaborations';
    }
  },

  // GET /api/collaborations/mine/influencer
  // Get my collaborations as influencer
  getMyInfluencerCollaborations: async (params = {}) => {
    try {
      const { page = 1, limit = 10, status } = params;
      const query = new URLSearchParams({ page, limit });
      if (status) query.set('status', status);
      const response = await api.get(`/collaborations/mine/influencer?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get influencer collaborations error:', error);
      throw error.response?.data?.message || 'Failed to fetch influencer collaborations';
    }
  },

  // GET /api/collaborations/{id}
  // Get collaboration by ID
  getCollaborationById: async (id) => {
    try {
      const response = await api.get(`/collaborations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get collaboration error:', error);
      throw error.response?.data?.message || 'Failed to fetch collaboration';
    }
  },

  // PATCH /api/collaborations/{id}/cancel
  // Cancel a collaboration
  cancelCollaboration: async (id) => {
    try {
      const response = await api.patch(`/collaborations/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Cancel collaboration error:', error);
      throw error.response?.data?.message || 'Failed to cancel collaboration';
    }
  },

  // PATCH /api/collaborations/{id}/complete
  // Mark collaboration as complete
  completeCollaboration: async (id) => {
    try {
      const response = await api.patch(`/collaborations/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error('Complete collaboration error:', error);
      throw error.response?.data?.message || 'Failed to complete collaboration';
    }
  },

  // POST /api/collaborations/{collaborationId}/contract
  // Create a contract for a collaboration
  createContract: async (collaborationId, data) => {
    try {
      const response = await api.post(`/collaborations/${collaborationId}/contract`, data);
      return response.data;
    } catch (error) {
      console.error('Create contract error:', error);
      throw error.response?.data?.message || 'Failed to create contract';
    }
  },

  // GET /api/collaborations/{collaborationId}/contract
  // Get contract for a collaboration
  getContract: async (collaborationId) => {
    try {
      const response = await api.get(`/collaborations/${collaborationId}/contract`);
      return response.data;
    } catch (error) {
      console.error('Get contract error:', error);
      throw error.response?.data?.message || 'Failed to fetch contract';
    }
  },

  // PATCH /api/collaborations/contracts/{id}
  // Update a contract
  updateContract: async (id, data) => {
    try {
      const response = await api.patch(`/collaborations/contracts/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update contract error:', error);
      throw error.response?.data?.message || 'Failed to update contract';
    }
  },

  // PATCH /api/collaborations/contracts/{id}/send
  // Send contract for signature
  sendContract: async (id) => {
    try {
      const response = await api.patch(`/collaborations/contracts/${id}/send`);
      return response.data;
    } catch (error) {
      console.error('Send contract error:', error);
      throw error.response?.data?.message || 'Failed to send contract';
    }
  },

  // PATCH /api/collaborations/contracts/{id}/sign
  // Sign a contract
  signContract: async (id) => {
    try {
      const response = await api.patch(`/collaborations/contracts/${id}/sign`);
      return response.data;
    } catch (error) {
      console.error('Sign contract error:', error);
      throw error.response?.data?.message || 'Failed to sign contract';
    }
  },

  // GET /api/collaborations/{collaborationId}/tasks
  // Get tasks for a collaboration
  getTasks: async (collaborationId, params = {}) => {
    try {
      const { status } = params;
      const query = new URLSearchParams();
      if (status) query.set('status', status);
      const response = await api.get(`/collaborations/${collaborationId}/tasks?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error.response?.data?.message || 'Failed to fetch tasks';
    }
  },

  // GET /api/collaborations/tasks/{id}
  // Get task by ID
  getTaskById: async (id) => {
    try {
      const response = await api.get(`/collaborations/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get task error:', error);
      throw error.response?.data?.message || 'Failed to fetch task';
    }
  },

  // PATCH /api/collaborations/tasks/{id}
  // Update a task
  updateTask: async (id, data) => {
    try {
      const response = await api.patch(`/collaborations/tasks/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update task error:', error);
      throw error.response?.data?.message || 'Failed to update task';
    }
  },

  // PATCH /api/collaborations/tasks/{id}/start
  // Mark task as started
  startTask: async (id) => {
    try {
      const response = await api.patch(`/collaborations/tasks/${id}/start`);
      return response.data;
    } catch (error) {
      console.error('Start task error:', error);
      throw error.response?.data?.message || 'Failed to start task';
    }
  },

  // PATCH /api/collaborations/tasks/{id}/submit
  // Submit task for review
  submitTask: async (id, data) => {
    try {
      const response = await api.patch(`/collaborations/tasks/${id}/submit`, data);
      return response.data;
    } catch (error) {
      console.error('Submit task error:', error);
      throw error.response?.data?.message || 'Failed to submit task';
    }
  },

  // PATCH /api/collaborations/tasks/{id}/approve
  // Approve a task
  approveTask: async (id, data) => {
    try {
      const response = await api.patch(`/collaborations/tasks/${id}/approve`, data);
      return response.data;
    } catch (error) {
      console.error('Approve task error:', error);
      throw error.response?.data?.message || 'Failed to approve task';
    }
  },

  // PATCH /api/collaborations/tasks/{id}/reject
  // Reject a task
  rejectTask: async (id, data) => {
    try {
      const response = await api.patch(`/collaborations/tasks/${id}/reject`, data);
      return response.data;
    } catch (error) {
      console.error('Reject task error:', error);
      throw error.response?.data?.message || 'Failed to reject task';
    }
  },

  // PATCH /api/collaborations/tasks/{id}/reject-final
  // Terminal reject a task
  finalRejectTask: async (id, data) => {
    try {
      const response = await api.patch(`/collaborations/tasks/${id}/reject-final`, data);
      return response.data;
    } catch (error) {
      console.error('Final reject task error:', error);
      throw error.response?.data?.message || 'Failed to final reject task';
    }
  },
};

export default collaborationService;