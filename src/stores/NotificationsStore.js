import { create } from 'zustand';
import notificationsService from '../api/notificationsApi';

const useNotificationsStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  // Get all notifications
  getNotifications: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationsService.getNotifications(params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || Array.isArray(payload);

      if (!ok && !payload?.notifications) {
        throw new Error(payload?.message || 'Failed to fetch notifications');
      }

      const notifications = payload?.notifications || payload?.data || (Array.isArray(payload) ? payload : []);
      set({ notifications, isLoading: false });
      return { success: true, data: notifications };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch notifications';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get unread notifications
  getUnreadNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationsService.getUnreadNotifications();
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || Array.isArray(payload);

      if (!ok && !payload?.notifications) {
        throw new Error(payload?.message || 'Failed to fetch unread notifications');
      }

      const notifications = payload?.notifications || payload?.data || (Array.isArray(payload) ? payload : []);
      set({ 
        notifications, 
        unreadCount: notifications.length,
        isLoading: false 
      });
      return { success: true, data: notifications };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch unread notifications';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      const response = await notificationsService.markAsRead(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to mark notification as read');
      }

      set((state) => ({
        notifications: state.notifications.map((n) => 
          (n.id === id || n._id === id) ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to mark as read';
      return { success: false, error: errorMessage };
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationsService.markAllAsRead();
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to mark all as read');
      }

      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to mark all as read';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Delete a notification
  deleteNotification: async (id) => {
    try {
      const response = await notificationsService.deleteNotification(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to delete notification');
      }

      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id && n._id !== id)
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to delete notification';
      return { success: false, error: errorMessage };
    }
  },

  clearError: () => set({ error: null })
}));

export default useNotificationsStore;
