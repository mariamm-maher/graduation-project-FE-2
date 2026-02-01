import { MessageSquare, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import CollaborationCard from './CollaborationCard';
import ChatPanel from './ChatPanel';
import FiltersPanel from './FiltersPanel';
import StatsOverview from './StatsOverview';
import SearchBar from './SearchBar';

const activeCollaborations = [
  {
    id: 1,
    influencerId: 1,
    influencerName: 'Sarah Johnson',
    influencerAvatar: 'SJ',
    influencerImage: 'https://i.pravatar.cc/150?img=5',
    campaignId: 101,
    campaignName: 'Summer Fashion Collection 2026',
    platform: 'instagram',
    status: 'in-progress',
    progress: 65,
    currentTasks: [
      { id: 1, title: 'Create mood board', completed: true },
      { id: 2, title: 'Product photoshoot', completed: true },
      { id: 3, title: 'Edit and post content', completed: false },
      { id: 4, title: 'Engagement monitoring', completed: false },
    ],
    deadline: '2026-02-15',
    budget: '$12,500',
    unreadMessages: 3,
    lastActivity: '2 hours ago',
  },
  {
    id: 2,
    influencerId: 2,
    influencerName: 'Mike Chen',
    influencerAvatar: 'MC',
    influencerImage: 'https://i.pravatar.cc/150?img=12',
    campaignId: 102,
    campaignName: 'Tech Product Launch Review',
    platform: 'youtube',
    status: 'pending',
    progress: 25,
    currentTasks: [
      { id: 1, title: 'Unboxing video script', completed: true },
      { id: 2, title: 'Record unboxing', completed: false },
      { id: 3, title: 'Edit video', completed: false },
      { id: 4, title: 'Publish & promote', completed: false },
    ],
    deadline: '2026-02-20',
    budget: '$8,000',
    unreadMessages: 0,
    lastActivity: '1 day ago',
  },
  {
    id: 3,
    influencerId: 3,
    influencerName: 'Emma Davis',
    influencerAvatar: 'ED',
    influencerImage: 'https://i.pravatar.cc/150?img=9',
    campaignId: 103,
    campaignName: 'Wellness Brand Partnership',
    platform: 'instagram',
    status: 'in-progress',
    progress: 80,
    currentTasks: [
      { id: 1, title: 'Product testing', completed: true },
      { id: 2, title: 'Create Reels content', completed: true },
      { id: 3, title: 'Story highlights', completed: true },
      { id: 4, title: 'Final report', completed: false },
    ],
    deadline: '2026-02-10',
    budget: '$15,000',
    unreadMessages: 1,
    lastActivity: '30 minutes ago',
  },
  {
    id: 4,
    influencerId: 4,
    influencerName: 'Alex Rivera',
    influencerAvatar: 'AR',
    influencerImage: 'https://i.pravatar.cc/150?img=14',
    campaignId: 104,
    campaignName: 'Fitness Equipment Showcase',
    platform: 'youtube',
    status: 'completed',
    progress: 100,
    currentTasks: [
      { id: 1, title: 'Equipment demo video', completed: true },
      { id: 2, title: 'Tutorial series', completed: true },
      { id: 3, title: 'Community Q&A', completed: true },
      { id: 4, title: 'Performance report', completed: true },
    ],
    deadline: '2026-01-25',
    budget: '$10,500',
    unreadMessages: 0,
    lastActivity: '3 days ago',
  },
  {
    id: 5,
    influencerId: 5,
    influencerName: 'Lisa Wang',
    influencerAvatar: 'LW',
    influencerImage: 'https://i.pravatar.cc/150?img=45',
    campaignId: 105,
    campaignName: 'Luxury Brand Ambassador',
    platform: 'instagram',
    status: 'in-progress',
    progress: 50,
    currentTasks: [
      { id: 1, title: 'Brand photoshoot', completed: true },
      { id: 2, title: 'Feed posts series', completed: true },
      { id: 3, title: 'Influencer event', completed: false },
      { id: 4, title: 'Story takeover', completed: false },
    ],
    deadline: '2026-02-28',
    budget: '$25,000',
    unreadMessages: 5,
    lastActivity: '15 minutes ago',
  },
  {
    id: 6,
    influencerId: 6,
    influencerName: 'David Kim',
    influencerAvatar: 'DK',
    influencerImage: 'https://i.pravatar.cc/150?img=33',
    campaignId: 106,
    campaignName: 'Gaming Gear Review Series',
    platform: 'youtube',
    status: 'pending',
    progress: 10,
    currentTasks: [
      { id: 1, title: 'Product briefing', completed: true },
      { id: 2, title: 'Testing period', completed: false },
      { id: 3, title: 'Video production', completed: false },
      { id: 4, title: 'Channel promotion', completed: false },
    ],
    deadline: '2026-03-05',
    budget: '$6,500',
    unreadMessages: 2,
    lastActivity: '5 hours ago',
  },
];

function ActiveInfluencers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [filters, setFilters] = useState({
    status: [],
    platforms: [],
    minProgress: 0,
    maxProgress: 100,
  });

  // Filter logic
  const filteredCollaborations = useMemo(() => {
    return activeCollaborations.filter((collab) => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        collab.influencerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collab.campaignName.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = filters.status.length === 0 || filters.status.includes(collab.status);

      // Platform filter
      const matchesPlatform = filters.platforms.length === 0 || filters.platforms.includes(collab.platform);

      // Progress filter
      const matchesProgress = collab.progress >= filters.minProgress && collab.progress <= filters.maxProgress;

      return matchesSearch && matchesStatus && matchesPlatform && matchesProgress;
    });
  }, [searchQuery, filters]);

  const handlePlatformToggle = (platform) => {
    setFilters(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleStatusToggle = (status) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      platforms: [],
      minProgress: 0,
      maxProgress: 100,
    });
    setSearchQuery('');
  };

  const hasActiveFilters = filters.status.length > 0 || 
    filters.platforms.length > 0 || 
    filters.minProgress > 0 || 
    filters.maxProgress < 100 ||
    searchQuery !== '';

  const handleOpenChat = (collab) => {
    setSelectedCollab(collab);
    setShowChat(true);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log('Sending message:', chatMessage, 'to collab:', selectedCollab.id);
      setChatMessage('');
    }
  };

  const handleFilterChange = (newFilterValues) => {
    setFilters(prev => ({ ...prev, ...newFilterValues }));
  };

  const activeFiltersCount = filters.status.length + filters.platforms.length + (searchQuery ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Active Collaborations</h1>
          <p className="text-gray-400 text-sm sm:text-base">Track progress, manage tasks, and communicate with your influencers</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              showChat 
                ? 'bg-white/10 border border-white/20 text-white' 
                : 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white hover:shadow-lg hover:shadow-purple-500/50'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="hidden sm:inline">Messages</span>
            {activeCollaborations.filter(c => c.unreadMessages > 0).length > 0 && (
              <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                {activeCollaborations.reduce((sum, c) => sum + c.unreadMessages, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleFilters={() => setShowFilters(!showFilters)}
        hasActiveFilters={hasActiveFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Stats Overview */}
      <StatsOverview collaborations={activeCollaborations} />

      {/* Main Content: Collaboration Board + Chat/Filters */}
      <div className={`grid gap-6 transition-all duration-300 ${
        showChat || showFilters
          ? 'lg:grid-cols-[1fr_380px]' 
          : 'lg:grid-cols-1'
      }`}>
        {/* Collaboration Cards Board */}
        <div className="order-2 lg:order-1">
        {filteredCollaborations.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">No collaborations found</h3>
                <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-[#745CB4] text-white rounded-lg text-sm font-medium hover:bg-[#5D459D] transition-all"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCollaborations.map((collab) => (
              <CollaborationCard
                key={collab.id}
                collab={collab}
                onOpenChat={handleOpenChat}
              />
            ))}
          </div>
        )}
        </div>

        {/* Chat Panel / Filters Sidebar */}
        <AnimatePresence mode="wait">
          {showChat && selectedCollab && (
            <ChatPanel
              selectedCollab={selectedCollab}
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
              onClose={() => setShowChat(false)}
              onSendMessage={handleSendMessage}
            />
          )}

          {showFilters && !showChat && (
            <FiltersPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onStatusToggle={handleStatusToggle}
              onPlatformToggle={handlePlatformToggle}
              onClearFilters={clearFilters}
              onClose={() => setShowFilters(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ActiveInfluencers;