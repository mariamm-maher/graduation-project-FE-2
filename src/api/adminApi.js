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

  // Normalize GET /admin/sessions body to { sessions, pagination }
  parseSessionsResponse(response) {
    if (!response) return { sessions: [], pagination: null };
    const payload = response.data ?? response;
    const sessions =
      payload?.sessions ??
      response?.sessions ??
      (Array.isArray(payload) ? payload : []);
    const pagination = payload?.pagination ?? response?.pagination ?? null;
    return {
      sessions: Array.isArray(sessions) ? sessions : [],
      pagination,
    };
  },

  // Get all sessions
  getSessions: async (params = {}) => {
    try {
      const { page = 1, limit = 50, active = false } = params;
      const query = new URLSearchParams();
      query.set('page', page);
      query.set('limit', limit);
      if (active) query.set('active', 'true');

      const response = await api.get(`/admin/sessions?${query.toString()}`);
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

  // Get header stats
  getHeaderStats: async () => {
    try {
      const response = await api.get('/admin/header-stats');
      return response.data;
    } catch (error) {
      console.error('Header stats error:', error);
      throw error.response?.data?.message || 'Failed to fetch header stats';
    }
  },

  parseChatroomsResponse(response) {
    if (!response) return { chatrooms: [], pagination: null };
    const payload = response.data ?? response;
    const chatrooms =
      payload?.chatrooms ??
      response?.chatrooms ??
      (Array.isArray(payload) ? payload : []);
    return {
      chatrooms: Array.isArray(chatrooms) ? chatrooms : [],
      pagination: payload?.pagination ?? response?.pagination ?? null,
    };
  },

  parseChatMessagesResponse(response) {
    if (!response) return { messages: [], chatRoom: null, pagination: null };
    const payload = response.data ?? response;
    const messages =
      payload?.messages ??
      response?.messages ??
      (Array.isArray(payload) ? payload : []);
    return {
      messages: Array.isArray(messages) ? messages : [],
      chatRoom: payload?.chatRoom ?? response?.chatRoom ?? null,
      pagination: payload?.pagination ?? response?.pagination ?? null,
    };
  },

  getChatrooms: async (params = {}) => {
    try {
      const { page = 1, limit = 50, collaborationId } = params;
      const query = new URLSearchParams();
      query.set('page', page);
      query.set('limit', limit);
      if (collaborationId) query.set('collaborationId', collaborationId);
      const response = await api.get(`/admin/chatrooms?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Admin chatrooms error:', error);
      throw error.response?.data?.message || 'Failed to fetch chat rooms';
    }
  },

  getChatroomMessages: async (roomId, params = {}) => {
    try {
      const { page = 1, limit = 50 } = params;
      const query = new URLSearchParams();
      query.set('page', page);
      query.set('limit', limit);
      const response = await api.get(`/admin/chatrooms/${roomId}/messages?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Admin chat messages error:', error);
      throw error.response?.data?.message || 'Failed to fetch chat messages';
    }
  },

  // Delete collaboration
  deleteCollaboration: async (id) => {
    try {
      const response = await api.delete(`/admin/collaborations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete collaboration error:', error);
      throw error.response?.data?.message || 'Failed to delete collaboration';
    }
  },

  // Get all announcements
  getAnnouncements: async (params = {}) => {
    try {
      const { page = 1, limit = 50, status } = params;
      const query = new URLSearchParams();
      query.set('page', page);
      query.set('limit', limit);
      if (status) query.set('status', status);
      const response = await api.get(`/admin/announcements?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Announcements error:', error);
      throw error.response?.data?.message || 'Failed to fetch announcements';
    }
  },

  // Create announcement
  createAnnouncement: async (data) => {
    try {
      const response = await api.post('/admin/announcements', data);
      return response.data;
    } catch (error) {
      console.error('Create announcement error:', error);
      throw error.response?.data?.message || 'Failed to create announcement';
    }
  },

  // Update announcement
  updateAnnouncement: async (id, data) => {
    try {
      const response = await api.put(`/admin/announcements/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update announcement error:', error);
      throw error.response?.data?.message || 'Failed to update announcement';
    }
  },

  // Delete announcement
  deleteAnnouncement: async (id) => {
    try {
      const response = await api.delete(`/admin/announcements/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete announcement error:', error);
      throw error.response?.data?.message || 'Failed to delete announcement';
    }
  },

  // Publish announcement
  publishAnnouncement: async (id) => {
    try {
      const response = await api.patch(`/admin/announcements/${id}/publish`);
      return response.data;
    } catch (error) {
      console.error('Publish announcement error:', error);
      throw error.response?.data?.message || 'Failed to publish announcement';
    }
  },

  // Unpublish announcement
  unpublishAnnouncement: async (id) => {
    try {
      const response = await api.patch(`/admin/announcements/${id}/unpublish`);
      return response.data;
    } catch (error) {
      console.error('Unpublish announcement error:', error);
      throw error.response?.data?.message || 'Failed to unpublish announcement';
    }
  },

  // Search across users, sessions, collaborations
  search: async (query) => {
    try {
      const response = await api.get(`/admin/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw error.response?.data?.message || 'Search failed';
    }
  },

};

export default adminService;
