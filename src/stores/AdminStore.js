import { create } from 'zustand';
import adminService from '../api/adminApi';

const useAdminStore = create((set) => ({
  // State
  analytics: null,
  users: [],
  sessions: [],
  sessionsPagination: null,
  collaborations: [],
  campaigns: [],
  announcements: [],
  announcementsLoading: false,
  announcementsError: null,
  recentLogs: [],
  logs: [],
  logsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalLogs: 0,
    limit: 20
  },
  activeSessionsCount: null,
  isLoading: false,
  error: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  clearError: () => set({ error: null }),

  // Fetch Analytics
  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getAnalytics();
      
      if (response.success) {
        set({ 
          analytics: response.data,
          isLoading: false,
          error: null 
        });
        return { success: true, data: response.data };
      }
      
      throw new Error(response.message || 'Failed to fetch analytics');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch analytics';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch Users (params: page, limit, role, search) — always from backend GET /api/admin/users
  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getUsers(params);
      const users = response.data?.users ?? response.users ?? (Array.isArray(response.data) ? response.data : []);
      const list = Array.isArray(users) ? users : [];
      set({
        users: list,
        isLoading: false,
        error: null
      });
      return { success: true, data: list };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch users';
      set({ users: [], error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Delete user (calls API then removes from state)
  deleteUser: async (id) => {
    set({ error: null });
    try {
      await adminService.deleteUser(id);
      set((state) => ({
        users: state.users.filter((u) => String(u.id) !== String(id)),
        error: null
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to delete user';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch Sessions (params: page, limit, active)
  fetchSessions: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getSessions(params);
      const { sessions, pagination } = adminService.parseSessionsResponse(response);
      set({
        sessions,
        sessionsPagination: pagination,
        isLoading: false,
        error: null,
      });
      return { success: true, data: sessions, pagination };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch sessions';
      set({ sessions: [], error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch count of active sessions only (for Overview Dashboard)
  fetchActiveSessionsCount: async () => {
    try {
      const response = await adminService.getSessions({ active: true, page: 1, limit: 1 });
      const { pagination } = adminService.parseSessionsResponse(response);
      const count =
        pagination?.total ??
        pagination?.totalSessions ??
        pagination?.totalCount ??
        pagination?.count ??
        null;
      if (count !== null) set({ activeSessionsCount: Number(count) });
      return { success: true, data: count };
    } catch (error) {
      return { success: false };
    }
  },

  // Fetch Collaborations
  fetchCollaborations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getCollaborations();
      const list = response.data?.collaborations ?? response.collaborations ?? (Array.isArray(response.data) ? response.data : []);
      set({
        collaborations: Array.isArray(list) ? list : [],
        isLoading: false,
        error: null
      });
      return { success: true, data: Array.isArray(list) ? list : response.data };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch collaborations';
      set({ collaborations: [], error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch Campaigns (params: page, limit, goalType, lifecycleStage)
  fetchCampaigns: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getCampaigns(params);
      const list = response.data?.campaigns ?? response.campaigns ?? (Array.isArray(response.data) ? response.data : []);
      const campaigns = Array.isArray(list) ? list : [];
      set({
        campaigns,
        isLoading: false,
        error: null
      });
      return { success: true, data: campaigns };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch campaigns';
      set({ campaigns: [], error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Delete campaign
  deleteCampaign: async (id) => {
    set({ error: null });
    try {
      await adminService.deleteCampaign(id);
      set((state) => ({
        campaigns: state.campaigns.filter((c) => String(c.id) !== String(id)),
        error: null
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to delete campaign';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Update campaign status (lifecycleStage)
  updateCampaignStatus: async (id, status) => {
    set({ error: null });
    try {
      await adminService.updateCampaignStatus(id, status);
      set((state) => ({
        campaigns: state.campaigns.map((c) =>
          String(c.id) === String(id) ? { ...c, lifecycleStage: status } : c
        ),
        error: null
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to update campaign status';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch Recent Logs
  fetchRecentLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getRecentLogs();
      
      if (response.success) {
        set({ 
          recentLogs: response.data || [],
          isLoading: false,
          error: null 
        });
        return { success: true, data: response.data };
      }
      
      throw new Error(response.message || 'Failed to fetch recent logs');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch recent logs';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch Logs with pagination
  fetchLogs: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getLogs(page, limit);
      
      if (response.success) {
        set({ 
          logs: response.data?.logs || [],
          logsPagination: {
            currentPage: response.data?.currentPage || page,
            totalPages: response.data?.totalPages || 1,
            totalLogs: response.data?.totalLogs || 0,
            limit: response.data?.limit || limit
          },
          isLoading: false,
          error: null 
        });
        return { success: true, data: response.data };
      }
      
      throw new Error(response.message || 'Failed to fetch logs');
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch logs';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch Collaboration Requests
  fetchCollaborationRequests: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getCollaborationRequests(params);
      const list = response.data?.requests ?? response.requests ?? (Array.isArray(response.data) ? response.data : []);
      set({
        collaborationRequests: Array.isArray(list) ? list : [],
        isLoading: false,
        error: null
      });
      return { success: true, data: Array.isArray(list) ? list : response.data };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch collaboration requests';
      set({ collaborationRequests: [], error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Update collaboration request status
  updateCollaborationRequestStatus: async (id, status) => {
    set({ error: null });
    try {
      await adminService.updateCollaborationRequestStatus(id, status);
      set((state) => ({
        collaborationRequests: state.collaborationRequests.map((r) =>
          String(r.id) === String(id) ? { ...r, status } : r
        ),
        error: null
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to update request status';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Update collaboration status
  updateCollaborationStatus: async (id, status) => {
    set({ error: null });
    try {
      await adminService.updateCollaborationStatus(id, status);
      set((state) => ({
        collaborations: state.collaborations.map((c) =>
          String(c.id) === String(id) ? { ...c, status } : c
        ),
        error: null
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to update collaboration status';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Update user role
  updateUserRole: async (id, role) => {
    set({ error: null });
    try {
      await adminService.updateUserRole(id, role);
      set((state) => ({
        users: state.users.map((u) =>
          String(u.id) === String(id) ? { ...u, role } : u
        ),
        error: null
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to update user role';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Update user status
  updateUserStatus: async (id, status) => {
    set({ error: null });
    try {
      await adminService.updateUserStatus(id, status);
      set((state) => ({
        users: state.users.map((u) =>
          String(u.id) === String(id) ? { ...u, status } : u
        ),
        error: null
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to update user status';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Delete collaboration
  deleteCollaboration: async (id) => {
    set({ error: null });
    try {
      await adminService.deleteCollaboration(id);
      set((state) => ({
        collaborations: state.collaborations.filter((c) => String(c.id) !== String(id)),
        error: null
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to delete collaboration';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch Announcements
  fetchAnnouncements: async (params = {}) => {
    set({ announcementsLoading: true, announcementsError: null });
    try {
      const response = await adminService.getAnnouncements(params);
      const list = response.data?.announcements ?? response.announcements ?? (Array.isArray(response.data) ? response.data : []);
      set({
        announcements: Array.isArray(list) ? list : [],
        announcementsLoading: false,
        announcementsError: null
      });
      return { success: true, data: Array.isArray(list) ? list : [] };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to fetch announcements';
      set({ announcements: [], announcementsError: errorMessage, announcementsLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Create Announcement
  createAnnouncement: async (data) => {
    set({ announcementsError: null });
    try {
      const response = await adminService.createAnnouncement(data);
      const created = response.data?.announcement ?? response.announcement ?? response.data ?? response;
      if (created && created.id) {
        set((state) => ({
          announcements: [created, ...state.announcements],
        }));
      }
      return { success: true, data: created };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to create announcement';
      set({ announcementsError: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Update Announcement
  updateAnnouncement: async (id, data) => {
    set({ announcementsError: null });
    try {
      const response = await adminService.updateAnnouncement(id, data);
      const updated = response.data?.announcement ?? response.announcement ?? response.data ?? response;
      set((state) => ({
        announcements: state.announcements.map((a) =>
          String(a.id) === String(id) ? { ...a, ...updated } : a
        ),
      }));
      return { success: true, data: updated };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to update announcement';
      set({ announcementsError: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Delete Announcement
  deleteAnnouncement: async (id) => {
    set({ announcementsError: null });
    try {
      await adminService.deleteAnnouncement(id);
      set((state) => ({
        announcements: state.announcements.filter((a) => String(a.id) !== String(id)),
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to delete announcement';
      set({ announcementsError: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Publish Announcement
  publishAnnouncement: async (id) => {
    set({ announcementsError: null });
    try {
      const response = await adminService.publishAnnouncement(id);
      const updated = response.data?.announcement ?? response.announcement ?? null;
      set((state) => ({
        announcements: state.announcements.map((a) =>
          String(a.id) === String(id)
            ? { ...a, ...(updated || {}), status: 'published', publishedAt: updated?.publishedAt || new Date().toISOString() }
            : a
        ),
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to publish announcement';
      set({ announcementsError: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Unpublish Announcement
  unpublishAnnouncement: async (id) => {
    set({ announcementsError: null });
    try {
      await adminService.unpublishAnnouncement(id);
      set((state) => ({
        announcements: state.announcements.map((a) =>
          String(a.id) === String(id) ? { ...a, status: 'draft', publishedAt: null } : a
        ),
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to unpublish announcement';
      set({ announcementsError: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Clear all data
  clearAdminData: () => set({ 
    analytics: null,
    users: [],
    sessions: [],
    sessionsPagination: null,
    collaborations: [],
    campaigns: [],
    announcements: [],
    announcementsError: null,
    recentLogs: [],
    logs: [],
    collaborationRequests: [],
    activeSessionsCount: null,
    logsPagination: {
      currentPage: 1,
      totalPages: 1,
      totalLogs: 0,
      limit: 20
    },
    error: null 
  }),
}));

export default useAdminStore;
