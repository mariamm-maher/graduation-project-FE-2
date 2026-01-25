import { Search, Bell, MessageSquare, ChevronDown, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CreateOwnerProfile from './createOwnerProfile';

function Header() {
  const navigate = useNavigate();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [activeRole, setActiveRole] = useState('Influencer');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showOwnerProfileModal, setShowOwnerProfileModal] = useState(false);
  const searchRef = useRef(null);

  // Mock user roles - replace with actual user data from auth/context
  const [userRoles, setUserRoles] = useState(['Influencer']); // ['Influencer', 'Owner'] if user has both

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
    if (role === 'Owner') {
      navigate('/dashboard/owner');
    }
  };

  const handleGeneratePlanAI = () => {
    // Check if user has Owner role
    const hasOwnerRole = userRoles.includes('Owner');
    
    if (!hasOwnerRole) {
      // Show modal to prompt user to add Owner role
      setShowOwnerProfileModal(true);
    } else {
      // Navigate to campaign creation
      navigate('/dashboard/owner/campaigns/create');
    }
  };

  const handleContinueToOwnerSetup = () => {
    setShowOwnerProfileModal(false);
    // Navigate to owner profile creation/onboarding
    navigate('/onboarding/owner');
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
          {/* AI Campaign Plan Button */}
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGeneratePlanAI}
            className="relative px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white rounded-lg overflow-hidden group flex-1 sm:flex-initial"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-400"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            <span className="relative flex items-center justify-center sm:justify-start space-x-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="hidden sm:inline">Generate Campaign Plan with AI</span>
              <span className="sm:hidden">AI Plan</span>
            </span>
          </motion.button>

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
                <span className="text-xs sm:text-sm font-medium">Active: <span className="text-[#C1B6FD]">{activeRole}</span></span>
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
                  className="absolute right-0 mt-2 w-56 bg-[#1a1a3e] backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-2">
                    <motion.button
                      whileHover={{ x: 4 }}
                      onClick={() => switchRole('Owner')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeRole === 'Owner'
                          ? 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="font-medium">Switch to Owner</div>
                      <div className="text-xs text-gray-400 mt-1">Manage campaigns & team</div>
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 4 }}
                      onClick={() => switchRole('Influencer')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 mt-1 ${
                        activeRole === 'Influencer'
                          ? 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="font-medium">Switch to Influencer</div>
                      <div className="text-xs text-gray-400 mt-1">View offers & collaborations</div>
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
            onContinue={handleContinueToOwnerSetup}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
