import { create } from 'zustand';
import { toast } from 'react-toastify';
import notificationsService from '../api/notificationsApi';
import { acquireChatSocket, getChatSocket, releaseChatSocket } from '../utils/chatSocket';
import { isValidNotificationType } from '../constants/notificationTypes';

const getNotificationId = (notification) => String(notification?.id ?? notification?._id ?? '');

const normalizeNotification = (notification) => {
  if (!notification || typeof notification !== 'object') return null;

  const type = notification.type;
  if (!isValidNotificationType(type)) {
    return null;
  }

  return {
    ...notification,
    type
  };
};

const sortByCreatedAtDesc = (notifications = []) => {
  return [...notifications].sort((a, b) => {
    const aDate = new Date(a?.createdAt || 0).getTime();
    const bDate = new Date(b?.createdAt || 0).getTime();
    return bDate - aDate;
  });
};

const mergeUniqueNotifications = (current = [], incoming = []) => {
  const map = new Map();

  for (const notification of current) {
    const normalized = normalizeNotification(notification);
    if (!normalized) continue;

    const id = getNotificationId(normalized);
    if (!id) continue;
    map.set(id, normalized);
  }

  for (const notification of incoming) {
    const normalized = normalizeNotification(notification);
    if (!normalized) continue;

    const id = getNotificationId(normalized);
    if (!id) continue;
    const previous = map.get(id);
    map.set(id, { ...(previous || {}), ...normalized });
  }

  return sortByCreatedAtDesc(Array.from(map.values()));
};

const safeNotificationId = (notification) => {
  const normalized = normalizeNotification(notification);
  if (!normalized) return '';
  return getNotificationId(normalized);
};

let notificationSocketListenersAttached = false;

const useNotificationsStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const data = await notificationsService.getNotifications({ page, limit });
      const list = Array.isArray(data)
        ? data
        : data?.notifications || data?.items || data?.list || [];

      set((state) => ({
        notifications: mergeUniqueNotifications(state.notifications, list),
        loading: false
      }));

      return { success: true, data: list };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch notifications';
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  fetchUnreadCount: async () => {
    try {
      const data = await notificationsService.getUnreadCount();
      const unreadCount = Number(data?.unreadCount ?? data?.count ?? 0);
      get().setUnreadCount(unreadCount);
      return { success: true, data: unreadCount };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch unread count';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  addNotification: (notification) => {
    const normalized = normalizeNotification(notification);
    if (!normalized) return;

    set((state) => ({
      notifications: mergeUniqueNotifications(state.notifications, [normalized])
    }));
  },

  setUnreadCount: (count) => {
    set({ unreadCount: Math.max(0, Number(count) || 0) });
  },

  markAsRead: async (notificationId, options = { syncWithServer: true }) => {
    if (!notificationId) return { success: false, error: 'Notification id is required' };

    const { syncWithServer = true } = options;

    try {
      if (syncWithServer) {
        await notificationsService.markAsRead(notificationId);
      }

      set((state) => ({
        notifications: state.notifications.map((n) => {
          const id = getNotificationId(n);
          return id === String(notificationId) ? { ...n, isRead: true } : n;
        })
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to mark notification as read';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  markAllAsRead: async (options = { syncWithServer: true }) => {
    const { syncWithServer = true } = options;

    try {
      if (syncWithServer) {
        await notificationsService.markAllAsRead();
      }

      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true }))
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to mark all as read';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  deleteNotification: async (id) => {
    if (!id) return { success: false, error: 'Notification id is required' };

    try {
      await notificationsService.deleteNotification(id);

      set((state) => ({
        notifications: state.notifications.filter((n) => getNotificationId(n) !== String(id))
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to delete notification';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  initRealtimeNotifications: () => {
    (async () => {
      const socket = getChatSocket() || await acquireChatSocket();
      if (!socket || notificationSocketListenersAttached) return;

      notificationSocketListenersAttached = true;

      socket.on('notification', (notification) => {
        const normalized = normalizeNotification(notification);
        if (!normalized) return;

        const notificationId = safeNotificationId(normalized);
        const exists = useNotificationsStore.getState().notifications.some(
          (item) => getNotificationId(item) === notificationId
        );

        useNotificationsStore.getState().addNotification(normalized);

        if (!exists) {
          toast.info(normalized?.title || normalized?.message || 'You have a new notification', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      });

      socket.on('notification_count_updated', ({ unreadCount }) => {
        useNotificationsStore.getState().setUnreadCount(unreadCount);
      });

      socket.on('notification_read', ({ notificationId }) => {
        useNotificationsStore.getState().markAsRead(notificationId, { syncWithServer: false });
      });

      socket.on('all_notifications_read', () => {
        useNotificationsStore.getState().markAllAsRead({ syncWithServer: false });
      });
    })();
  },

  cleanupRealtimeNotifications: () => {
    const socket = getChatSocket();
    if (socket && notificationSocketListenersAttached) {
      socket.off('notification');
      socket.off('notification_count_updated');
      socket.off('notification_read');
      socket.off('all_notifications_read');
      notificationSocketListenersAttached = false;
      releaseChatSocket();
    }
  },

  clearError: () => set({ error: null })
}));

export default useNotificationsStore;
