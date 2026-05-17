import { Search, Bell, MessageSquare, X, Loader2, Check, CheckCheck, MessageCircle } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import adminService from '../../../../api/adminApi';
import notificationsService from '../../../../api/notificationsApi';
import chatService from '../../../../api/chatApi';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [headerStats, setHeaderStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchRef = useRef(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  const [showMessages, setShowMessages] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);

  const notifRef = useRef(null);
  const msgRef = useRef(null);

  // Fetch header stats on mount
  useEffect(() => {
    const fetchHeaderStats = async () => {
      try {
        const response = await adminService.getHeaderStats();
        if (response.success) {
          setHeaderStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch header stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHeaderStats();

    // Refresh every 30 seconds
    const interval = setInterval(fetchHeaderStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Search debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await adminService.search(searchQuery);
        if (response.success) {
          setSearchResults(response.data?.results || []);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const filteredSuggestions = searchResults;

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
    console.log('Selected:', suggestion);
  };

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

  const fetchChatRooms = useCallback(async () => {
    setMsgLoading(true);
    try {
      const data = await chatService.getMyChatRooms();
      const rooms = data?.data?.chatRooms ?? data?.chatRooms ?? (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
      setChatRooms(Array.isArray(rooms) ? rooms : []);
      const unread = (Array.isArray(rooms) ? rooms : []).reduce((s, r) => s + (r.unreadCount || 0), 0);
      setUnreadMsgCount(unread);
    } catch (e) {
      console.error('Chat rooms fetch failed', e);
    } finally {
      setMsgLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchChatRooms();
  }, [fetchNotifications, fetchChatRooms]);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (msgRef.current && !msgRef.current.contains(e.target)) setShowMessages(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAllNotifRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, read: true })));
      setUnreadNotifCount(0);
    } catch (e) { console.error(e); }
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
                placeholder="Search accounts, sessions..."
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
              {showSearchResults && searchQuery.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 w-full sm:w-80 bg-[#10121f] border border-white/10 rounded-lg shadow-xl max-h-56 overflow-y-auto z-50"
                >
                  {isSearching ? (
                    <div className="p-6 text-center">
                      <Loader2 className="w-6 h-6 text-[#C1B6FD] animate-spin mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Searching...</p>
                    </div>
                  ) : filteredSuggestions.length > 0 ? (
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
                              suggestion.type === 'account' ? 'bg-[#C1B6FD]' : suggestion.type === 'session' ? 'bg-green-400' : 'bg-[#745CB4]'
                            }`}></div>
                            <div>
                              <div className="font-medium text-white text-sm">{suggestion.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {suggestion.type === 'account' 
                                  ? `Account • ${suggestion.role}`
                                  : suggestion.type === 'session'
                                  ? `Session • ${suggestion.status}`
                                  : `Collaboration • ${suggestion.status}`
                                }
                              </div>
                            </div>
                          </div>
                          <Search className="w-4 h-4 text-gray-600 group-hover:text-[#C1B6FD] transition-colors duration-200" />
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <Search className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No results found</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap w-full sm:w-auto">
          {/* Team Status */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2 hidden sm:flex"
          >
            <div className="flex -space-x-2">
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-[#745CB4] border-2 border-[#000000] flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                <>
                  {headerStats?.onlineUsers?.slice(0, 4).map((user, idx) => (
                    <div 
                      key={user.id} 
                      className={`w-8 h-8 rounded-full border-2 border-[#000000] flex items-center justify-center text-xs text-white font-medium ${
                        idx === 0 ? 'bg-[#745CB4]' : idx === 1 ? 'bg-[#5D459D]' : idx === 2 ? 'bg-[#C1B6FD]' : 'bg-[#745CB4]'
                      }`}
                      title={`${user.firstName} ${user.lastName}`}
                    >
                      {(user.firstName?.[0] || user.email?.[0] || '?').toUpperCase()}
                    </div>
                  ))}
                  {headerStats?.onlineUsers?.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-[#745CB4] border-2 border-[#000000] flex items-center justify-center text-xs text-white">
                      +{headerStats.onlineUsers.length - 4}
                    </div>
                  )}
                </>
              )}
            </div>
            <span className="text-sm">
              <span className="font-bold">{Math.min(headerStats?.activeSessions || 0, headerStats?.totalUsers || 0)}</span>
              <span className="text-gray-400"> of {headerStats?.totalUsers || 0} active</span>
            </span>
          </motion.div>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setShowNotifications((v) => !v); setShowMessages(false); }}
              className="relative p-2 hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold text-[10px] sm:text-xs">
                  {unreadNotifCount > 99 ? '99+' : unreadNotifCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-[#10121f] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <span className="text-sm font-semibold text-white">Notifications</span>
                    {unreadNotifCount > 0 && (
                      <button onClick={handleMarkAllNotifRead} className="text-xs text-[#C1B6FD] hover:underline flex items-center gap-1">
                        <CheckCheck className="w-3 h-3" /> Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifLoading ? (
                      <div className="p-6 flex justify-center"><Loader2 className="w-5 h-5 text-[#C1B6FD] animate-spin" /></div>
                    ) : notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-sm">No notifications</div>
                    ) : notifications.map((n) => (
                      <div key={n.id} className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.isRead && !n.read ? 'bg-[#745CB4]/10' : ''}`}>
                        <p className="text-sm text-white leading-snug">{n.message || n.title || n.content}</p>
                        <p className="text-xs text-gray-500 mt-1">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Messages/Chat */}
          <div ref={msgRef} className="relative">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setShowMessages((v) => !v); setShowNotifications(false); }}
              className="relative p-2 hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
              {unreadMsgCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#745CB4] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold text-[10px] sm:text-xs">
                  {unreadMsgCount > 99 ? '99+' : unreadMsgCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showMessages && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-[#10121f] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <span className="text-sm font-semibold text-white">Messages</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {msgLoading ? (
                      <div className="p-6 flex justify-center"><Loader2 className="w-5 h-5 text-[#C1B6FD] animate-spin" /></div>
                    ) : chatRooms.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-sm">No messages</div>
                    ) : chatRooms.map((room) => {
                      const partner = room.participants?.find((p) => !p.isAdmin) || room.participants?.[0];
                      const name = partner ? [partner.firstName, partner.lastName].filter(Boolean).join(' ').trim() || partner.email : room.name || 'Chat Room';
                      return (
                        <div key={room.id} className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${room.unreadCount > 0 ? 'bg-[#745CB4]/10' : ''}`}>
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center shrink-0">
                            <MessageCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{name}</p>
                            <p className="text-xs text-gray-400 truncate mt-0.5">{room.lastMessage?.content || 'No messages yet'}</p>
                          </div>
                          {room.unreadCount > 0 && (
                            <span className="bg-[#745CB4] text-white text-xs rounded-full px-2 py-0.5 font-medium shrink-0">{room.unreadCount}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden sm:block w-px h-8 bg-white/10"></div>

          {/* Admin Badge */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 backdrop-blur-sm border border-[#745CB4]/30 rounded-full w-full sm:w-auto"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm font-medium">Admin</span>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Header;
