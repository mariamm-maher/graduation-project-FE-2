import { Search, Bell, MessageSquare, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  // Mock search suggestions - replace with actual data
  const searchSuggestions = [
    { type: 'account', name: 'James Radcliffe', role: 'Owner' },
    { type: 'account', name: 'Sarah Johnson', role: 'Influencer' },
    { type: 'session', name: 'Alex Martinez', status: 'Active' },
    { type: 'collaboration', name: 'Summer Fashion Launch', status: 'Active' },
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
              {showSearchResults && filteredSuggestions.length > 0 && (
                <motion.div
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
                      <motion.button
                        key={index}
                        whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-3 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group"
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
                </motion.div>
              )}
              {showSearchResults && searchQuery && filteredSuggestions.length === 0 && (
                <motion.div
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
              <div className="w-8 h-8 rounded-full bg-[#745CB4] border-2 border-[#000000]"></div>
              <div className="w-8 h-8 rounded-full bg-[#5D459D] border-2 border-[#000000]"></div>
              <div className="w-8 h-8 rounded-full bg-[#C1B6FD] border-2 border-[#000000]"></div>
              <div className="w-8 h-8 rounded-full bg-[#745CB4] border-2 border-[#000000] flex items-center justify-center text-xs">+9</div>
            </div>
            <span className="text-sm"><span className="font-bold">12</span> of <span className="font-bold">15</span> <span className="text-gray-400">active</span></span>
          </motion.div>

          {/* Notifications */}
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 hover:bg-white/5 rounded-lg transition-all duration-200"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#C1B6FD] rounded-full shadow-lg shadow-[#C1B6FD]/50"></span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold text-[10px] sm:text-xs">3</span>
          </motion.button>

          {/* Messages/Chat */}
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 hover:bg-white/5 rounded-lg transition-all duration-200"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
            <span className="absolute -top-1 -right-1 bg-[#745CB4] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold text-[10px] sm:text-xs">7</span>
          </motion.button>

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
