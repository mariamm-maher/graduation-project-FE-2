import { Bell, MessageSquare, ChevronDown, Menu, Trash2, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import CreateOwnerProfile from './createOwnerProfile';
import useAuthStore from '../../../../stores/authStore';
import useNotificationsStore from '../../../../stores/NotificationsStore';
import useChatStore from '../../../../stores/ChatStore';

const OVERLAY_Z = 110;

function Header({ isMobileMenuOpen, onOpenMenu }) {
  const navigate = useNavigate();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [showOwnerProfileModal, setShowOwnerProfileModal] = useState(false);
  const roleRef = useRef(null);

  const user = useAuthStore((s) => s.user);
  const switchRole = useAuthStore((s) => s.switchRole);
  const addRole = useAuthStore((s) => s.addRole);
  const totalUnreadCount = useChatStore((s) => s.totalUnreadCount);
  const fetchChatUnreadCount = useChatStore((s) => s.fetchUnreadCount);
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    resetNotifications,
    reconnectNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationsStore();

  useEffect(() => {
    resetNotifications();
    fetchNotifications(1, 10);
    fetchUnreadCount();
    fetchChatUnreadCount();
  }, [resetNotifications, fetchNotifications, fetchUnreadCount, fetchChatUnreadCount]);

  useEffect(() => {
    if (!showNotificationsPanel) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showNotificationsPanel]);

  useEffect(() => {
    if (!showRoleDropdown) return undefined;
    const handler = (e) => {
      if (roleRef.current && !roleRef.current.contains(e.target)) {
        setShowRoleDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showRoleDropdown]);

  const closeRoleDropdown = () => setShowRoleDropdown(false);
  const closeNotifications = () => setShowNotificationsPanel(false);

  const handleMarkAsRead = async (notificationId) => {
    const res = await markAsRead(notificationId);
    if (res?.success) toast.success('Marked as read');
    else toast.error(res?.error || 'Failed to mark notification as read');
  };

  const handleMarkAllAsRead = async () => {
    const res = await markAllAsRead();
    if (res?.success) toast.success('All notifications marked as read');
    else toast.error(res?.error || 'Failed to mark notifications as read');
  };

  const handleDeleteNotification = async (notificationId) => {
    const res = await deleteNotification(notificationId);
    if (res?.success) toast.success('Notification deleted');
    else toast.error(res?.error || 'Failed to delete notification');
  };

  const handleSwitchRole = async (role) => {
    closeRoleDropdown();
    if (role === 'OWNER') {
      const userRoles = (user?.roles || []).map((r) => (typeof r === 'string' ? r : r?.name)).filter(Boolean);
      const hasOwnerRole = userRoles.some((r) => r.toUpperCase() === 'OWNER');
      if (hasOwnerRole) {
        const result = await switchRole('OWNER');
        if (result.success) {
          await reconnectNotifications();
          toast.success('Switched to Owner');
          navigate('/dashboard/owner');
        } else {
          toast.error(result.error || 'Failed to switch role');
        }
      } else {
        setShowOwnerProfileModal(true);
      }
    }
  };

  const openNotifications = () => {
    closeRoleDropdown();
    setShowNotificationsPanel((v) => !v);
  };

  const openRoleDropdown = () => {
    closeNotifications();
    setShowRoleDropdown((v) => !v);
  };

  const notificationOverlay =
    typeof document !== 'undefined' &&
    createPortal(
      <AnimatePresence>
        {showNotificationsPanel && (
          <Motion.div
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
            <Motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-[#745CB4]/25 bg-linear-to-b from-[#241A3A]/98 to-[#1A112C]/98 shadow-2xl backdrop-blur-md max-h-[min(85vh,32rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#745CB4]/25 p-4 shrink-0">
                <h3 className="text-white font-bold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-[#C1B6FD] hover:text-white transition"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {notifications?.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-sm">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id || notif.id}
                      className={`p-4 border-b border-[#745CB4]/15 hover:bg-[#745CB4]/10 transition ${
                        !notif.isRead ? 'bg-[#745CB4]/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium break-words">
                            {notif.title || notif.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 break-words">
                            {notif.description || notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notif.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {!notif.isRead && (
                            <button
                              type="button"
                              onClick={() => handleMarkAsRead(notif._id || notif.id)}
                              title="Mark as read"
                              className="p-1 rounded hover:bg-[#745CB4]/20 text-[#C1B6FD]"
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
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>,
      document.body
    );

  return (
    <>
      {notificationOverlay}

      <div className={`relative flex items-center gap-2 sm:gap-3 flex-nowrap min-h-[44px] mb-6 sm:mb-8 ${showRoleDropdown ? 'z-[110]' : 'z-0'}`}>
        {!isMobileMenuOpen ? (
          <Motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={onOpenMenu}
            className="md:hidden shrink-0 p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-white/20 transition-all"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </Motion.button>
        ) : (
          <div className="md:hidden shrink-0 w-9 h-9" aria-hidden="true" />
        )}

        <Motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl sm:text-2xl lg:text-3xl font-bold truncate min-w-0 shrink"
        >
          <span className="text-[#C1B6FD]">Campaign</span>
          <span className="text-white">Craft</span>
        </Motion.h1>

        <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0 flex-nowrap">
          <Motion.button
            type="button"
            onClick={openNotifications}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 hover:bg-white/5 rounded-lg transition-all duration-200 shrink-0"
            aria-expanded={showNotificationsPanel}
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-4 h-4 px-1 sm:min-w-5 sm:h-5 sm:px-1.5 flex items-center justify-center font-bold text-[10px] sm:text-xs">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Motion.button>

          <Motion.button
            type="button"
            onClick={() => navigate('/dashboard/influencer/messages')}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 hover:bg-white/5 rounded-lg transition-all duration-200 shrink-0"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
            {totalUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#745CB4] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold text-[10px] sm:text-xs">
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </span>
            )}
          </Motion.button>

          <div className="hidden sm:block w-px h-8 bg-white/10 shrink-0" />

          <Motion.div
            ref={roleRef}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className={`relative shrink-0 ${showRoleDropdown ? 'z-[110]' : ''}`}
          >
            <Motion.button
              type="button"
              onClick={openRoleDropdown}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-sm border border-[#745CB4]/30 rounded-full hover:bg-white/10 transition-all duration-200"
              aria-expanded={showRoleDropdown}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                Active: <span className="text-[#C1B6FD]">Influencer</span>
              </span>
              <ChevronDown
                className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
                  showRoleDropdown ? 'rotate-180' : ''
                }`}
              />
            </Motion.button>

            <AnimatePresence>
              {showRoleDropdown && (
                <Motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-[#10121f] border border-white/10 rounded-lg shadow-xl z-[110] overflow-hidden"
                >
                  <div className="p-2">
                    <Motion.button
                      type="button"
                      whileHover={{ x: 4 }}
                      onClick={() => handleSwitchRole('OWNER')}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 rounded-lg"
                    >
                      <div className="font-medium">Switch to Owner</div>
                      <div className="text-xs text-gray-500 mt-1">Manage campaigns & team</div>
                    </Motion.button>
                    <Motion.button
                      type="button"
                      whileHover={{ x: 4 }}
                      className="w-full text-left px-4 py-2.5 text-sm mt-1 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg"
                    >
                      <div className="font-medium">Influencer</div>
                      <div className="text-xs text-gray-300 mt-1">View offers & collaborations</div>
                    </Motion.button>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </Motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showOwnerProfileModal && (
          <CreateOwnerProfile
            onClose={() => setShowOwnerProfileModal(false)}
            onContinue={async () => {
              setShowOwnerProfileModal(false);
              const result = await addRole('OWNER');
              if (result.success) {
                toast.success('Owner role added! Complete your profile.');
                navigate('/onboarding/owner');
              } else {
                toast.error(result.error || 'Failed to add owner role');
              }
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
