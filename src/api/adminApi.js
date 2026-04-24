import api from '../config/axios';

// Admin Service Functions
const adminService = {
  // Get analytics data
  getAnalytics: async () => {
    try {
      const response = await api.get('/admin/analytics');
      console.log('Analytics response:', response);
      return response.data;
    } catch (error) {
      console.error('Analytics error:', error);
      throw error.response?.data?.message || 'Failed to fetch analytics';
    }
  },

  // Get all users (with optional filters: page, limit, role, search)
  getUsers: async (params = {}) => {
    try {
      const { page = 1, limit = 50, role, search } = params;
      const query = new URLSearchParams();
      if (page) query.set('page', page);
      if (limit) query.set('limit', limit);
      if (role) query.set('role', role);
      if (search && search.trim()) query.set('search', search.trim());
      const url = `/admin/users${query.toString() ? `?${query.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Users error:', error);
      throw error.response?.data?.message || 'Failed to fetch users';
    }
  },

  // Get single user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error.response?.data?.message || 'Failed to fetch user';
    }
  },

  // Update user role (body: { role: 'OWNER' | 'INFLUENCER' | 'ADMIN' })
  updateUserRole: async (id, role) => {
    try {
      const response = await api.patch(`/admin/users/${id}/role`, { role });
      return response.data;
    } catch (error) {
      console.error('Update role error:', error);
      throw error.response?.data?.message || 'Failed to update role';
    }
  },

  // Update user status (body: { status: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED' | 'INCOMPLETE' })
  updateUserStatus: async (id, status) => {
    try {
      const response = await api.patch(`/admin/users/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update status error:', error);
      throw error.response?.data?.message || 'Failed to update status';
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error.response?.data?.message || 'Failed to delete user';
    }
  },

  // Get all sessions
  getSessions: async () => {
    try {
      const response = await api.get('/admin/sessions');
      console.log('Sessions response:', response);
      return response.data;
    } catch (error) {
      console.error('Sessions error:', error);
      throw error.response?.data?.message || 'Failed to fetch sessions';
    }
  },

  // Get all collaborations
  getCollaborations: async (params = {}) => {
    try {
      const { page = 1, limit = 50, status } = params;
      const query = new URLSearchParams();
      if (page) query.set('page', page);
      if (limit) query.set('limit', limit);
      if (status) query.set('status', status);
      const url = `/admin/collaborations${query.toString() ? `?${query.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Collaborations error:', error);
      throw error.response?.data?.message || 'Failed to fetch collaborations';
    }
  },

  // Get single collaboration by ID
  getCollaborationById: async (id) => {
    try {
      const response = await api.get(`/admin/collaborations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get collaboration error:', error);
      throw error.response?.data?.message || 'Failed to fetch collaboration';
    }
  },

  // Get all campaigns (params: page, limit, goalType, lifecycleStage)
  getCampaigns: async (params = {}) => {
    try {
      const { page = 1, limit = 50, goalType, lifecycleStage } = params;
      const query = new URLSearchParams();
      if (page) query.set('page', page);
      if (limit) query.set('limit', limit);
      if (goalType) query.set('goalType', goalType);
      if (lifecycleStage) query.set('lifecycleStage', lifecycleStage);
      const url = `/admin/campaigns${query.toString() ? `?${query.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Campaigns error:', error);
      throw error.response?.data?.message || 'Failed to fetch campaigns';
    }
  },

  // Get single campaign by ID
  getCampaignById: async (id) => {
    try {
      const response = await api.get(`/admin/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get campaign error:', error);
      throw error.response?.data?.message || 'Failed to fetch campaign';
    }
  },

  // Update campaign status (body: { status: lifecycleStage })
  updateCampaignStatus: async (id, status) => {
    try {
      const response = await api.patch(`/admin/campaigns/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update campaign status error:', error);
      throw error.response?.data?.message || 'Failed to update campaign status';
    }
  },

  // Delete campaign
  deleteCampaign: async (id) => {
    try {
      const response = await api.delete(`/admin/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete campaign error:', error);
      throw error.response?.data?.message || 'Failed to delete campaign';
    }
  },

  // Get recent activity logs
  getRecentLogs: async () => {
    try {
      const response = await api.get('/admin/logs/recent');
      console.log('Recent logs response:', response);
      return response.data;
    } catch (error) {
      console.error('Recent logs error:', error);
      throw error.response?.data?.message || 'Failed to fetch recent logs';
    }
  },

  // Get paginated logs
  getLogs: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/admin/logs?page=${page}&limit=${limit}`);
      console.log('Logs response:', response);
      return response.data;
    } catch (error) {
      console.error('Logs error:', error);
      throw error.response?.data?.message || 'Failed to fetch logs';
    }
  },

  // Get all collaboration requests
  getCollaborationRequests: async (params = {}) => {
    try {
      const { page = 1, limit = 50, status } = params;
      const query = new URLSearchParams();
      if (page) query.set('page', page);
      if (limit) query.set('limit', limit);
      if (status) query.set('status', status);
      const url = `/admin/collaboration-requests${query.toString() ? `?${query.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Collaboration requests error:', error);
      throw error.response?.data?.message || 'Failed to fetch collaboration requests';
    }
  },

  // Update collaboration request status
  updateCollaborationRequestStatus: async (id, status) => {
    try {
      const response = await api.patch(`/admin/collaboration-requests/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update collaboration request status error:', error);
      throw error.response?.data?.message || 'Failed to update collaboration request status';
    }
  },

  // Update collaboration status
  updateCollaborationStatus: async (id, status) => {
    try {
      const response = await api.patch(`/admin/collaborations/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update collaboration status error:', error);
      throw error.response?.data?.message || 'Failed to update collaboration status';
    }
  },
};

export default adminService;
