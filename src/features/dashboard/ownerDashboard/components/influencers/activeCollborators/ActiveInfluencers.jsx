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

  useEffect(() => {
    fetchActiveInfluencers();
  }, [fetchActiveInfluencers]);

  const activeCollaborations = useMemo(() => {
    return (activeInfluencers || []).map((collab, index) => {
      // Backend shape from getActiveInfluencers:
      // { collaborationId, status, startDate, endDate,
      //   influencer: { id, firstName, lastName, email, profileImage, primaryPlatform, followersCount },
      //   campaign: { id, title } }
      const influencer = collab?.influencer || {};
      const influencerName = `${influencer.firstName || ''} ${influencer.lastName || ''}`.trim() || 'Unknown Influencer';
      const avatarName = influencerName.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

      const status = collab?.status || 'pending';

      return {
        id: collab?.collaborationId ?? collab?.id ?? index + 1,
        influencerId: influencer?.id ?? null,
        influencerName,
        influencerAvatar: avatarName || 'NA',
        influencerImage: influencer?.profileImage || null,
        campaignId: collab?.campaign?.id ?? null,
        campaignName: collab?.campaign?.title || 'General Collaboration',
        platform: (influencer?.primaryPlatform || 'instagram').toLowerCase(),
        followersCount: influencer?.followersCount ?? 0,
        status,
        progress: Number(collab?.progress ?? 0),
        currentTasks: [],
        deadline: collab?.endDate || collab?.startDate || new Date().toISOString(),
        budget: collab?.proposedBudget != null ? `$${Number(collab.proposedBudget).toLocaleString()}` : '$0',
        unreadMessages: Number(collab?.unreadMessages || 0),
        lastActivity: collab?.updatedAt || 'N/A'
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