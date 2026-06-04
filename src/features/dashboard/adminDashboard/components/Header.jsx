import { Bell, Menu, Loader2, Check, Trash2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import notificationsService from '../../../../api/notificationsApi';

const OVERLAY_Z = 110;

function Header({ isMobileMenuOpen, onOpenMenu }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    setNotifLoading(true);
    try {
      const data = await notificationsService.getNotifications({ page: 1, limit: 10 });
      const list = data?.notifications ?? data?.data ?? (Array.isArray(data) ? data : []);
      setNotifications(Array.isArray(list) ? list : []);
      const unread = list.filter((n) => !n.isRead && !n.read).length;
      setUnreadNotifCount(unread);
    } catch (e) {
      console.error('Notif fetch failed', e);
    } finally {
      setNotifLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!showNotifications) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showNotifications]);

  const closeNotifications = () => setShowNotifications(false);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          (n.id === notificationId || n._id === notificationId)
            ? { ...n, isRead: true, read: true }
            : n
        )
      );
      setUnreadNotifCount((c) => Math.max(0, c - 1));
      toast.success('Marked as read');
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllNotifRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, read: true })));
      setUnreadNotifCount(0);
      toast.success('All notifications marked as read');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationsService.deleteNotification(notificationId);
      setNotifications((prev) => {
        const next = prev.filter((n) => n.id !== notificationId && n._id !== notificationId);
        setUnreadNotifCount(next.filter((n) => !n.isRead && !n.read).length);
        return next;
      });
      toast.success('Notification deleted');
    } catch (e) {
      console.error(e);
    }
  };

  const notificationOverlay =
    typeof document !== 'undefined' &&
    createPortal(
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
            style={{ zIndex: OVERLAY_Z }}
            role="dialog"
            aria-modal="true"
            aria-label="Notifications"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeNotifications}
              aria-label="Close notifications"
            />
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-white/20 bg-linear-to-br from-[#1a0933]/98 to-[#2d1b4e]/98 shadow-2xl backdrop-blur-md max-h-[min(85vh,32rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 p-4 shrink-0">
                <h3 className="text-white font-bold text-sm">Notifications</h3>
                {unreadNotifCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllNotifRead}
                    className="text-xs text-[#C1B6FD] hover:text-white transition"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {notifLoading ? (
                  <div className="p-6 flex justify-center">
                    <Loader2 className="w-5 h-5 text-[#C1B6FD] animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-sm">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id || notif.id}
                      className={`p-4 border-b border-white/5 hover:bg-white/5 transition ${
                        !notif.isRead && !notif.read ? 'bg-white/10' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium break-words">
                            {notif.title || notif.message || notif.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 break-words">
                            {notif.description || notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ''}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {!notif.isRead && !notif.read && (
                            <button
                              type="button"
                              onClick={() => handleMarkAsRead(notif._id || notif.id)}
                              title="Mark as read"
                              className="p-1 rounded hover:bg-white/10 text-[#C1B6FD]"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteNotification(notif._id || notif.id)}
                            title="Delete"
                            className="p-1 rounded hover:bg-red-500/20 text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );

  return (
    <>
      {notificationOverlay}

      <div className="relative z-0 flex items-center gap-2 sm:gap-3 flex-nowrap min-h-[44px] mb-6 sm:mb-8">
        {!isMobileMenuOpen ? (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={onOpenMenu}
            className="md:hidden shrink-0 p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-white/20 transition-all"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        ) : (
          <div className="md:hidden shrink-0 w-9 h-9" aria-hidden="true" />
        )}

        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl sm:text-2xl lg:text-3xl font-bold truncate min-w-0 shrink"
        >
          <span className="text-[#C1B6FD]">Campaign</span>
          <span className="text-white">Craft</span>
        </motion.h1>

        <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0 flex-nowrap">
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNotifications((v) => !v)}
            className="relative p-2 hover:bg-white/5 rounded-lg transition-all duration-200 shrink-0"
            aria-expanded={showNotifications}
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold text-[10px] sm:text-xs">
                {unreadNotifCount > 99 ? '99+' : unreadNotifCount}
              </span>
            )}
          </motion.button>

          <div className="hidden sm:block w-px h-8 bg-white/10 shrink-0" />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 backdrop-blur-sm border border-[#745CB4]/30 rounded-full shrink-0"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm font-medium">Admin</span>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Header;
