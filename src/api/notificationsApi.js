import api from '../config/axios';

const notificationsService = {

  // GET /api/notifications
  // Get all user notifications (paginated)
  getNotifications: async (params = {}) => {
    try {
      const { page = 1, limit = 10 } = params;
      const query = new URLSearchParams({ page, limit });
      const response = await api.get(`/notifications?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error.response?.data?.message || 'Failed to fetch notifications';
    }
  },

  // GET /api/notifications/unread
  // Get unread notifications count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread');
      return response.data;
    } catch (error) {
      console.error('Get unread count error:', error);
      throw error.response?.data?.message || 'Failed to fetch unread notifications count';
    }
  },

  // PATCH /api/notifications/{id}/read
  // Mark a single notification as read
  markAsRead: async (id) => {
    try {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error.response?.data?.message || 'Failed to mark notification as read';
    }
  },

  // PATCH /api/notifications/read-all
  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.patch('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error.response?.data?.message || 'Failed to mark all notifications as read';
    }
  },

  // DELETE /api/notifications/{id}
  // Delete a notification
  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error.response?.data?.message || 'Failed to delete notification';
    }
  },
};

export default notificationsService;