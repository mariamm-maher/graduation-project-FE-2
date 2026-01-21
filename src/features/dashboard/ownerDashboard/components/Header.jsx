import { Search, Bell, MessageSquare, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
  const navigate = useNavigate();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [activeRole, setActiveRole] = useState('Owner');

  const switchRole = (role) => {
    setActiveRole(role);
    setShowRoleDropdown(false);
    if (role === 'Influencer') {
      navigate('/dashboard/influencer');
    }
  };

  const handleCreateCampaignAI = () => {
    navigate('/dashboard/campaigns/create-ai');
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
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative flex-1 sm:flex-initial"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search campaigns, influencers..."
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full pl-9 sm:pl-10 pr-4 py-2 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] text-white placeholder:text-gray-500"
            />
          </motion.div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap w-full sm:w-auto">
          {/* AI Campaign Button */}
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateCampaignAI}
            className="relative px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white rounded-lg overflow-hidden group flex-1 sm:flex-initial"
          >
            <div className="absolute inset-0 bg-linear-to-r from-purple-400 via-purple-300 to-indigo-400"></div>
            <div className="absolute inset-0 bg-linear-to-r from-purple-400 via-purple-300 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            <span className="relative flex items-center justify-center sm:justify-start space-x-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="hidden sm:inline">Create Campaign with AI</span>
              <span className="sm:hidden">AI Campaign</span>
            </span>
          </motion.button>

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
                      <div className="text-xs text-gray-600 mt-1">Manage campaigns & team</div>
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
                      <div className="text-xs text-gray-600 mt-1">View offers & collaborations</div>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Header;
