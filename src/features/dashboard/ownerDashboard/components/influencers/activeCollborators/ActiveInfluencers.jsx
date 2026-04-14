import { MessageSquare, Search, Loader } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import CollaborationCard from './CollaborationCard';
import ChatPanel from './ChatPanel';
import FiltersPanel from './FiltersPanel';
import StatsOverview from './StatsOverview';
import SearchBar from './SearchBar';
import useOwnerStore from '../../../../../../stores/ownerStore';

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

  const {
    activeInfluencers,
    activeInfluencersLoading,
    activeInfluencersError,
    fetchActiveInfluencers
  } = useOwnerStore();

  useEffect(() => {
    fetchActiveInfluencers();
  }, [fetchActiveInfluencers]);

  const activeCollaborations = useMemo(() => {
    return (activeInfluencers || []).map((collab, index) => {
      const influencer = collab?.influencer || collab?.influencerId || {};
      const influencerFirstName = influencer?.firstName || influencer?.user?.firstName || '';
      const influencerLastName = influencer?.lastName || influencer?.user?.lastName || '';
      const influencerName = `${influencerFirstName} ${influencerLastName}`.trim() || influencer?.name || 'Unknown Influencer';
      const avatarName = influencerName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

      const collaborationStatus = collab?.status || collab?.collaborationStatus || 'pending';
      const status = collaborationStatus === 'active' ? 'in-progress' : collaborationStatus;

      const tasks = (collab?.tasks || []).map((task, taskIndex) => ({
        id: task?.id ?? task?._id ?? taskIndex + 1,
        title: task?.title || task?.name || `Task ${taskIndex + 1}`,
        completed: task?.completed === true || task?.status === 'completed'
      }));

      const budgetValue = collab?.proposedBudget ?? collab?.budget;

      return {
        id: collab?.id ?? collab?._id ?? index + 1,
        influencerId: influencer?.id ?? influencer?._id ?? null,
        influencerName,
        influencerAvatar: avatarName || 'NA',
        influencerImage: influencer?.image || influencer?.avatar || influencer?.profileImage || null,
        campaignId: collab?.campaign?.id ?? collab?.campaignId ?? null,
        campaignName: collab?.campaign?.campaignName || collab?.campaign?.name || collab?.campaignName || 'General Collaboration',
        platform: (influencer?.primaryPlatform || collab?.platform || 'instagram').toLowerCase(),
        status,
        progress: Number(collab?.progress ?? collab?.completionPercentage ?? 0),
        currentTasks: tasks,
        deadline: collab?.deadline || collab?.dueDate || collab?.endDate || new Date().toISOString(),
        budget: budgetValue !== undefined && budgetValue !== null ? `$${Number(budgetValue).toLocaleString()}` : '$0',
        unreadMessages: Number(collab?.unreadMessages || 0),
        lastActivity: collab?.lastActivity || collab?.updatedAt || 'N/A'
      };
    });
  }, [activeInfluencers]);

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
      {/* <StatsOverview collaborations={activeCollaborations} /> */}

      {/* Main Content: Collaboration Board + Chat/Filters */}
      <div className={`grid gap-6 transition-all duration-300 ${
        showChat || showFilters
          ? 'lg:grid-cols-[1fr_380px]' 
          : 'lg:grid-cols-1'
      }`}>
        {/* Collaboration Cards Board */}
        <div className="order-2 lg:order-1">
        {activeInfluencersLoading ? (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <Loader className="w-8 h-8 text-white animate-spin" />
              <p className="text-sm text-gray-400">Loading active collaborations...</p>
            </div>
          </div>
        ) : activeInfluencersError ? (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-lg font-semibold text-white">Failed to load active collaborations</h3>
              <p className="text-sm text-gray-400">{activeInfluencersError}</p>
              <button
                onClick={() => fetchActiveInfluencers()}
                className="px-4 py-2 bg-[#745CB4] text-white rounded-lg text-sm font-medium hover:bg-[#5D459D] transition-all"
              >
                Retry
              </button>
            </div>
          </div>
        ) : filteredCollaborations.length === 0 ? (
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