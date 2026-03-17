import { Search, Bell, MessageSquare, ChevronDown, X, Trash2, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import useAuthStore from '../../../../stores/authStore';
import useNotificationsStore from '../../../../stores/NotificationsStore';
import CreateInfluencerProfile from './createInfluncerProfile';

function Header() {
  const navigate = useNavigate();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [activeRole, setActiveRole] = useState('Owner');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const searchRef = useRef(null);
  const [showInfluencerModal, setShowInfluencerModal] = useState(false);

  const user = useAuthStore((s) => s.user);
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    initRealtimeNotifications,
    cleanupRealtimeNotifications
  } = useNotificationsStore();

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications(1, 10);
    fetchUnreadCount();
    initRealtimeNotifications();

    return () => {
      cleanupRealtimeNotifications();
    };
  }, [fetchNotifications, fetchUnreadCount, initRealtimeNotifications, cleanupRealtimeNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    const res = await markAsRead(notificationId);
    if (res?.success) {
      toast.success('Marked as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    const res = await markAllAsRead();
    if (res?.success) {
      toast.success('All notifications marked as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    const res = await deleteNotification(notificationId);
    if (res?.success) {
      toast.success('Notification deleted');
    }
  };

  const hasInfluencerRole = Boolean(
    user && (
      (Array.isArray(user.roles) && user.roles.some(r => String(r).toUpperCase().includes('INFLUENCER'))) ||
      (typeof user.role === 'string' && String(user.role).toUpperCase().includes('INFLUENCER'))
    )
  );

  // Mock search suggestions - replace with actual data
  const searchSuggestions = [
    { type: 'campaign', name: 'Summer Fashion Campaign', status: 'Active' },
    { type: 'campaign', name: 'Tech Product Launch', status: 'Pending' },
    { type: 'influencer', name: 'Sarah Johnson', followers: '125K' },
    { type: 'influencer', name: 'Mike Chen', followers: '89K' },
    { type: 'campaign', name: 'Holiday Sale Campaign', status: 'Completed' },
  ];

  const filteredSuggestions = searchQuery.trim()
    ? searchSuggestions.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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

  const switchRole = (role) => {
    setActiveRole(role);
    setShowRoleDropdown(false);
    if (role === 'Influencer') {
      navigate('/dashboard/influencer');
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto">
          <Motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold"
          >
            <span className="text-[#C1B6FD]">Ad</span>
            <span className="text-white">Sphere</span>
          </Motion.h1>
          
          {/* Enhanced Search Bar */}
          <Motion.div 
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
                placeholder="Search campaigns, influencers..."
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full pl-9 sm:pl-10 pr-10 py-2 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD] text-white placeholder:text-gray-500 transition-all duration-200"
              />
              {searchQuery && (
                <Motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  type="button"
                  onClick={handleSearchClear}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors duration-200 z-10"
                >
                  <X className="w-4 h-4" />
                </Motion.button>
              )}
            </form>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showSearchResults && filteredSuggestions.length > 0 && (
                <Motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 w-full sm:w-80 bg-[#1a1a3e] backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-2 max-h-80 overflow-y-auto">
                    <div className="px-3 py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">
                      Search Results
                    </div>
                    {filteredSuggestions.map((suggestion, index) => (
                      <Motion.button
                        key={index}
                        whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-3 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            suggestion.type === 'campaign' ? 'bg-[#C1B6FD]' : 'bg-green-400'
                          }`}></div>
                          <div>
                            <div className="font-medium text-white text-sm">{suggestion.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {suggestion.type === 'campaign' 
                                ? `Campaign • ${suggestion.status}`
                                : `Influencer • ${suggestion.followers} followers`
                              }
                            </div>
                          </div>
                        </div>
                        <Search className="w-4 h-4 text-gray-600 group-hover:text-[#C1B6FD] transition-colors duration-200" />
                      </Motion.button>
                    ))}
                  </div>
                </Motion.div>
              )}
              {showSearchResults && searchQuery && filteredSuggestions.length === 0 && (
                <Motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 w-full sm:w-80 bg-[#1a1a3e] backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-6 text-center">
                    <Search className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No results found for "{searchQuery}"</p>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </Motion.div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap w-full sm:w-auto">
    

          {/* Join as Influencer Promotion Button (shows when user is not an influencer) */}
          {!hasInfluencerRole && (
            <>
            <Motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowInfluencerModal(true)}
              className="relative px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white rounded-lg overflow-hidden group flex-1 sm:flex-initial bg-linear-to-r from-green-400 via-teal-300 to-cyan-400"
            >
              <div className="absolute inset-0 opacity-20"></div>
              <span className="relative flex items-center justify-center sm:justify-start space-x-2">
                <span className="hidden sm:inline">Join as Influencer — get campaign opportunities</span>
                <span className="sm:hidden">Become Influencer</span>
              </span>
            </Motion.button>
            </>
          )}

          {/* Team Status */}
          <Motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden items-center gap-2 sm:flex"
          >
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#745CB4] border-2 border-[#000000]"></div>
              <div className="w-8 h-8 rounded-full bg-[#5D459D] border-2 border-[#000000]"></div>
              <div className="w-8 h-8 rounded-full bg-[#C1B6FD] border-2 border-[#000000]"></div>
              <div className="w-8 h-8 rounded-full bg-[#745CB4] border-2 border-[#000000] flex items-center justify-center text-xs">+9</div>
            </div>
            <span className="text-sm"><span className="font-bold">12</span> of <span className="font-bold">15</span> <span className="text-gray-400">active</span></span>
          </Motion.div>

          {/* Notifications */}
          <Motion.button
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
          </Motion.button>

          {/* Notifications Panel */}
          <AnimatePresence>
            {showNotificationsPanel && (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-16 right-0 w-96 bg-linear-to-br from-[#1a0933] to-[#2d1b4e] border border-white/20 rounded-xl shadow-2xl z-50"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
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
                <div className="max-h-96 overflow-y-auto">
                  {notifications?.length === 0 ? (
                    <div className="p-4 text-center text-gray-400 text-sm">No notifications</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id || notif.id}
                        className={`p-4 border-b border-white/5 hover:bg-white/5 transition ${
                          !notif.isRead ? 'bg-white/10' : ''
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
                                className="p-1 rounded hover:bg-white/10 text-[#C1B6FD]"
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
              </Motion.div>
            )}
          </AnimatePresence>

          {/* Messages/Chat */}
          <Motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 hover:bg-white/5 rounded-lg transition-all duration-200"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
            <span className="absolute -top-1 -right-1 bg-[#745CB4] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold text-[10px] sm:text-xs">7</span>
          </Motion.button>

          <div className="hidden sm:block w-px h-8 bg-white/10"></div>

          {/* Role Switcher */}
          <Motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="relative w-full sm:w-auto"
          >
            <Motion.button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 bg-white/5 backdrop-blur-sm border border-[#745CB4]/30 rounded-full hover:bg-white/10 transition-all duration-200 w-full sm:w-auto"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium">Active: <span className="text-[#C1B6FD]">{activeRole}</span></span>
              </div>
              <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform duration-200 ${showRoleDropdown ? 'rotate-180' : ''}`} />
            </Motion.button>

            <AnimatePresence>
              {showRoleDropdown && (
                <Motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-[#1a1a3e] backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-2">
                    <Motion.button
                      whileHover={{ x: 4 }}
                      onClick={() => switchRole('Owner')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeRole === 'Owner'
                          ? 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="font-medium">Switch to Owner</div>
                      <div className="text-xs text-gray-600 mt-1">Manage campaigns & team</div>
                    </Motion.button>
                    <Motion.button
                      whileHover={{ x: 4 }}
                      onClick={() => switchRole('Influencer')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 mt-1 ${
                        activeRole === 'Influencer'
                          ? 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="font-medium">Switch to Influencer</div>
                      <div className="text-xs text-gray-600 mt-1">View offers & collaborations</div>
                    </Motion.button>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </Motion.div>
        </div>
      </div>
      <AnimatePresence>
        {showInfluencerModal && (
          <CreateInfluencerProfile
            onClose={() => setShowInfluencerModal(false)}
            onContinue={() => {
              setShowInfluencerModal(false);
              navigate('/onboarding/influencer');
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
