import { Search, Bell, MessageSquare, ChevronDown, X, Trash2, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import CreateOwnerProfile from './createOwnerProfile';
import useAuthStore from '../../../../stores/authStore';
import useNotificationsStore from '../../../../stores/NotificationsStore';
import useChatStore from '../../../../stores/ChatStore';

// Hide scrollbar globally for notifications panel
const hideScrollbarStyle = document.createElement('style');
hideScrollbarStyle.textContent = `
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('hide-scrollbar-style')) {
  hideScrollbarStyle.id = 'hide-scrollbar-style';
  document.head.appendChild(hideScrollbarStyle);
}

function Header() {
  const navigate = useNavigate();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [showOwnerProfileModal, setShowOwnerProfileModal] = useState(false);

  const user = useAuthStore((s) => s.user);
  const switchRole = useAuthStore((s) => s.switchRole);
  const addRole = useAuthStore((s) => s.addRole);
  const totalUnreadCount = useChatStore((s) => s.totalUnreadCount);
  const fetchChatUnreadCount = useChatStore((s) => s.fetchUnreadCount);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  const {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount: fetchNotifUnreadCount,
    resetNotifications,
    reconnectNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotificationsStore();

  // Mock search suggestions - replace with actual data
  const searchSuggestions = [
    { type: 'campaign', name: 'Summer Fashion Campaign', budget: '$5,000', brand: 'FashionCo' },
    { type: 'campaign', name: 'Tech Product Launch', budget: '$8,000', brand: 'TechBrand' },
    { type: 'brand', name: 'EcoLife Products', campaigns: '3 active' },
    { type: 'brand', name: 'Urban Style Co', campaigns: '2 active' },
    { type: 'campaign', name: 'Holiday Sale Campaign', budget: '$3,500', brand: 'RetailHub' },
  ];

  const filteredSuggestions = searchQuery.trim()
    ? searchSuggestions.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    resetNotifications();
    fetchNotifications(1, 10);
    fetchNotifUnreadCount();
    fetchChatUnreadCount();
  }, [resetNotifications, fetchNotifications, fetchNotifUnreadCount, fetchChatUnreadCount]);

  const handleMarkAsRead = async (notificationId) => {
    const res = await markAsRead(notificationId);
    if (res?.success) {
      toast.success('Marked as read');
    } else {
      toast.error(res?.error || 'Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    const res = await markAllAsRead();
    if (res?.success) {
      toast.success('All notifications marked as read');
    } else {
      toast.error(res?.error || 'Failed to mark notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    const res = await deleteNotification(notificationId);
    if (res?.success) {
      toast.success('Notification deleted');
    } else {
      toast.error(res?.error || 'Failed to delete notification');
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close notifications panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationsPanel(false);
      }
    };

    if (showNotificationsPanel) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotificationsPanel]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(true);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement actual search navigation here
      setShowSearchResults(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSearchResults(false);
    // Navigate to the selected item
    console.log('Selected:', suggestion);
  };

  const handleSwitchRole = async (role) => {
    setShowRoleDropdown(false);
    if (role === 'OWNER') {
      const userRoles = (user?.roles || []).map(r => typeof r === 'string' ? r : r?.name).filter(Boolean);
      const hasOwnerRole = userRoles.some(r => r.toUpperCase() === 'OWNER');
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

  const handleCloseOwnerModal = () => {
    setShowOwnerProfileModal(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold"
          >
            <span className="text-[#C1B6FD]">Ad</span>
            <span className="text-white">Sphere</span>
          </motion.h1>
          
          {/* Enhanced Search Bar */}
          <motion.div 
            ref={searchRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative flex-1 sm:flex-initial"
          >
            <form onSubmit={handleSearchSubmit}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                placeholder="Search available campaigns, brands..."
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full pl-9 sm:pl-10 pr-10 py-2 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD] text-white placeholder:text-gray-500 transition-all duration-200"
              />
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  type="button"
                  onClick={handleSearchClear}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors duration-200 z-10"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </form>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showSearchResults && filteredSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 w-full sm:w-80 bg-[#10121f] border border-white/10 rounded-lg shadow-xl max-h-56 overflow-y-auto z-50"
                >
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs text-gray-400 font-medium uppercase tracking-wide border-b border-white/10 mb-1">
                      Search Results
                    </div>
                    {filteredSuggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ x: 4 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150 flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            suggestion.type === 'campaign' ? 'bg-[#C1B6FD]' : 'bg-green-400'
                          }`}></div>
                          <div>
                            <div className="font-medium text-white text-sm">{suggestion.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {suggestion.type === 'campaign' 
                                ? `Campaign • ${suggestion.budget} • ${suggestion.brand}`
                                : `Brand • ${suggestion.campaigns}`
                              }
                            </div>
                          </div>
                        </div>
                        <Search className="w-4 h-4 text-gray-600 group-hover:text-[#C1B6FD] transition-colors duration-200" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              {showSearchResults && searchQuery && filteredSuggestions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 w-full sm:w-80 bg-[#10121f] border border-white/10 rounded-lg shadow-xl max-h-56 overflow-y-auto z-50"
                >
                  <div className="p-6 text-center">
                    <Search className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No results found</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap w-full sm:w-auto">
          {/* Notifications */}
          <motion.div ref={notificationRef} className="relative">
            <motion.button
              type="button"
              onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-4 h-4 px-1 sm:min-w-5 sm:h-5 sm:px-1.5 flex items-center justify-center font-bold text-[10px] sm:text-xs">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </motion.button>

            {/* Notifications Panel */}
            <AnimatePresence>
              {showNotificationsPanel && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-16 -right-2 w-72 sm:w-80 md:w-96 bg-linear-to-b from-[#241A3A]/70 to-[#1A112C]/70 backdrop-blur-md border border-[#745CB4]/25 rounded-lg shadow-2xl z-50"
                >
                  <div className="p-4 border-b border-[#745CB4]/25 flex items-center justify-between">
                    <h3 className="text-white font-bold">Notifications</h3>
                    <div className="flex gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-[#C1B6FD] hover:text-white transition"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  <div 
                    className="max-h-96 overflow-y-auto hide-scrollbar"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                    }}
                  >
                    {notifications?.length === 0 ? (
                      <div className="p-4 text-center text-gray-400 text-sm">No notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id || notif.id}
                          className={`p-4 border-b border-[#745CB4]/15 hover:bg-[#745CB4]/10 transition ${
                            !notif.isRead ? 'bg-[#745CB4]/20' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-sm text-white font-medium">{notif.title || notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notif.description || notif.message}</p>
                              <p className="text-xs text-gray-500 mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                              {!notif.isRead && (
                                <button
                                  onClick={() => handleMarkAsRead(notif._id || notif.id)}
                                  title="Mark as read"
                                  className="p-1 rounded hover:bg-[#745CB4]/20 text-[#C1B6FD]"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
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
              )}
            </AnimatePresence>
          </motion.div>

          {/* Messages/Chat */}
          <motion.button 
            onClick={() => navigate('/dashboard/influencer/messages')}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 hover:bg-white/5 rounded-lg transition-all duration-200"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
            {totalUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#745CB4] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold text-[10px] sm:text-xs">
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </span>
            )}
          </motion.button>

          <div className="hidden sm:block w-px h-8 bg-white/10"></div>

          {/* Role Switcher */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="relative w-full sm:w-auto"
          >
            <motion.button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 bg-white/5 backdrop-blur-sm border border-[#745CB4]/30 rounded-full hover:bg-white/10 transition-all duration-200 w-full sm:w-auto"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium">Active: <span className="text-[#C1B6FD]">Influencer</span></span>
              </div>
              <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform duration-200 ${showRoleDropdown ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {showRoleDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-56 max-w-xs bg-[#10121f] border border-white/10 rounded-lg shadow-xl max-h-56 overflow-y-auto z-50"
                >
                  <div className="p-2">
                    <motion.button
                      whileHover={{ x: 4 }}
                      onClick={() => handleSwitchRole('OWNER')}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 text-gray-200 hover:bg-white/10 rounded-lg"
                    >
                      <div className="font-medium">Switch to Owner</div>
                      <div className="text-xs text-gray-500 mt-1">Manage campaigns & team</div>
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 4 }}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 mt-1 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg"
                    >
                      <div className="font-medium">Influencer</div>
                      <div className="text-xs text-gray-300 mt-1">View offers & collaborations</div>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Owner Profile Creation Modal */}
      <AnimatePresence>
        {showOwnerProfileModal && (
          <CreateOwnerProfile
            onClose={handleCloseOwnerModal}
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
