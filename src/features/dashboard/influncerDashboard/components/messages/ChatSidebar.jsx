import { Search, Plus, Filter, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ChatSidebar({ conversations, selectedChat, onSelectChat, showMobile, className = '' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, unread, active

  const filteredConversations = conversations.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         chat.campaign.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeFilter === 'unread') return chat.unread > 0;
    if (activeFilter === 'active') return chat.active; // Assuming 'active' property exists or derived
    return true;
  });

  return (
    <div className={`
      flex-col w-full md:w-80 lg:w-96 bg-black/20 border-r border-white/10 flex overflow-hidden
      ${selectedChat && !showMobile ? 'hidden md:flex' : 'flex'}
      ${className}
    `}>
      {/* Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Messages</h2>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
              <Plus className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="w-4 h-4 text-gray-500 group-focus-within:text-[#C1B6FD] absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
          <input
            type="text"
            placeholder="Search campaigns or people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C1B6FD]/30 focus:bg-white/10 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['all', 'unread', 'active'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`
                px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all
                ${activeFilter === filter 
                  ? 'bg-[#C1B6FD] text-black shadow-lg shadow-[#C1B6FD]/20' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {filteredConversations.map((chat) => (
          <motion.button
            key={chat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => onSelectChat(chat.id)}
            className={`
              w-full p-3 rounded-xl flex items-start gap-3 transition-all duration-200 group relative overflow-hidden
              ${selectedChat === chat.id 
                ? 'bg-white/10 shadow-inner' 
                : 'hover:bg-white/5'
              }
            `}
          >
            {/* Active Indicator Bar for Selected */}
            {selectedChat === chat.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#C1B6FD] rounded-r-full" />
            )}

            <div className="relative shrink-0">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${chat.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/10 group-hover:ring-white/20 transition-all`}>
                {chat.avatar}
              </div>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black" />
              )}
            </div>
            
            <div className="flex-1 text-left min-w-0 py-0.5">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className={`font-semibold truncate transition-colors ${selectedChat === chat.id ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                  {chat.name}
                </span>
                <span className="text-[10px] text-gray-500 whitespace-nowrap font-medium">{chat.timestamp}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#C1B6FD]/10 text-[#C1B6FD] border border-[#C1B6FD]/10 truncate max-w-[120px]">
                  {chat.campaign}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <p className={`text-xs truncate ${chat.unread > 0 ? 'text-gray-100 font-medium' : 'text-gray-500'}`}>
                  {chat.lastMessage}
                </p>
                {chat.unread > 0 && (
                  <span className="shrink-0 w-5 h-5 bg-[#C1B6FD] text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-[#C1B6FD]/20">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
