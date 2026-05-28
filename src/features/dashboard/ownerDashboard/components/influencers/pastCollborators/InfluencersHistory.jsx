import { Search, Loader } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import CollaborationRow from './CollaborationRow';
import HistoryStats from './HistoryStats';
import HistorySearchBar from './HistorySearchBar';
import HistoryFiltersPanel from './HistoryFiltersPanel';
import useOwnerStore from '../../../../../../stores/ownerStore';

function InfluencersHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    year: 'all',
  });

  const {
    pastInfluencers,
    pastInfluencersLoading,
    pastInfluencersError,
    fetchPastInfluencers
  } = useOwnerStore();

  useEffect(() => {
    fetchPastInfluencers();
  }, [fetchPastInfluencers]);

  const pastCollaborations = useMemo(() => {
    const formatDate = (value) => {
      if (!value) return 'N/A';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return String(value);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (pastInfluencers || []).map((collab, index) => {
      // Backend shape from getPastInfluencers:
      // { collaborationId, status, completedAt, startDate, endDate,
      //   influencer: { id, firstName, lastName, email, profileImage, primaryPlatform, followersCount },
      //   campaign: { id, title } }
      const influencer = collab?.influencer || {};
      const influencerName = `${influencer.firstName || ''} ${influencer.lastName || ''}`.trim() || 'Unknown Influencer';
      const influencerAvatar = influencerName.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase() || 'NA';

      const endDateSource = collab?.endDate || collab?.completedAt || collab?.updatedAt;
      const startDateSource = collab?.startDate || collab?.createdAt;

      const endYear = endDateSource ? String(new Date(endDateSource).getFullYear()) : 'N/A';

      const status = collab?.status || 'completed';

      return {
        id: collab?.collaborationId ?? collab?.id ?? index + 1,
        influencerId: influencer?.id ?? null,
        influencerName,
        influencerAvatar,
        influencerImage: influencer?.profileImage || null,
        email: influencer?.email || null,
        platform: influencer?.primaryPlatform || null,
        followersCount: influencer?.followersCount ?? null,
        campaignName: collab?.campaign?.title || '—',
        campaignId: collab?.campaign?.id || null,
        startDate: formatDate(startDateSource),
        endDate: formatDate(endDateSource),
        completedAt: formatDate(collab?.completedAt),
        endYear,
        status,
      };
    });
  }, [pastInfluencers]);

  const filteredCollaborations = useMemo(() => {
    return pastCollaborations.filter((collab) => {
      const matchesSearch = searchQuery === '' ||
        collab.influencerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collab.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (collab.platform || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status.length === 0 || filters.status.includes(collab.status);
      const matchesYear = filters.year === 'all' || collab.endYear === filters.year;
      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [pastCollaborations, searchQuery, filters]);

  const handleStatusToggle = (status) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const handleFilterChange = (newFilterValues) => {
    setFilters(prev => ({ ...prev, ...newFilterValues }));
  };

  const clearFilters = () => {
    setFilters({ status: [], year: 'all' });
    setSearchQuery('');
  };

  const hasActiveFilters = filters.status.length > 0 || filters.year !== 'all' || searchQuery !== '';
  const activeFiltersCount = filters.status.length + (filters.year !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0);

  const handleViewDetails = (collaboration) => {
    console.log('View details for:', collaboration);
    // Navigate to details page or open modal
  };

  const handleReEngage = (collaboration) => {
    console.log('Re-engage with:', collaboration);
    // Navigate to re-engagement flow
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Previous Collaborators</h1>
        <p className="text-gray-400 text-sm sm:text-base">Review completed partnerships and performance history</p>
      </div>

      {/* Stats Cards */}
      {/* <HistoryStats collaborations={pastCollaborations} /> */}

      {/* Search & Filter */}
      <HistorySearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleFilters={() => setShowFilters(!showFilters)}
        hasActiveFilters={hasActiveFilters}
        activeFiltersCount={activeFiltersCount}
        onClearFilters={clearFilters}
      />

      {/* Main Content: List + Filters */}
      <div className={`grid gap-6 transition-all duration-300 ${
        showFilters 
          ? 'lg:grid-cols-[1fr_320px]' 
          : 'lg:grid-cols-1'
      }`}>
        {/* Collaborations List */}
        <div className="space-y-4 order-2 lg:order-1">
          {pastInfluencersLoading ? (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <Loader className="w-8 h-8 text-white animate-spin" />
                <p className="text-sm text-gray-400">Loading past collaborations...</p>
              </div>
            </div>
          ) : pastInfluencersError ? (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <h3 className="text-lg font-semibold text-white">Failed to load past collaborations</h3>
                <p className="text-sm text-gray-400">{pastInfluencersError}</p>
                <button
                  onClick={() => fetchPastInfluencers()}
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
            <>
              {filteredCollaborations.map((collaboration) => (
                <CollaborationRow
                  key={collaboration.id}
                  collaboration={collaboration}
                  onViewDetails={handleViewDetails}
                  onReEngage={handleReEngage}
                />
              ))}
            </>
          )}
        </div>

        {/* Filters Panel */}
        {/* <AnimatePresence>
          {showFilters && (
            <div className="order-1 lg:order-2">
              <HistoryFiltersPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onStatusToggle={handleStatusToggle}
                onClearFilters={clearFilters}
                onClose={() => setShowFilters(false)}
              />
            </div>
          )}
        </AnimatePresence> */}
      </div>
    </div>
  );
}

export default InfluencersHistory;