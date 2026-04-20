import { Search, Loader } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import CollaborationCard from './CollaborationCard';
import SearchBar from './SearchBar';
import useOwnerStore from '../../../../../../stores/ownerStore';

function ActiveInfluencers() {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    activeInfluencers,
    activeInfluencersLoading,
    activeInfluencersError,
    fetchActiveInfluencers
  } = useOwnerStore();

  console.log('Active Influencers Data:', activeInfluencers);
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

  const filteredCollaborations = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return activeCollaborations;
    }

    return activeCollaborations.filter((collab) =>
      [collab.influencerName, collab.campaignName, collab.platform, collab.status]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [activeCollaborations, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Active Collaborations</h1>
          <p className="text-gray-400 text-sm sm:text-base">Track progress, manage tasks, and communicate with your influencers</p>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Collaboration Board */}
      <div>
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
                <p className="text-sm text-gray-400">Try adjusting your search</p>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-[#745CB4] text-white rounded-lg text-sm font-medium hover:bg-[#5D459D] transition-all"
                >
                  Clear search
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActiveInfluencers;