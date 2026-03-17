import { Zap, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import InfluencerCard from './InfluencerCard';
import SearchFilters from './SearchFilters';
import Pagination from './Pagination';
import useOwnerStore from '../../../../../../stores/ownerStore';

function DiscoverInfluencers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Use store
  const { influencers, pagination, isLoading, getInfluencers } = useOwnerStore();
  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;

  useEffect(() => {
    getInfluencers(currentPage);
  }, [getInfluencers, currentPage]);

  const handlePageChange = (page) => {
    getInfluencers(page);
  };

  // Map API data to component props
  const mappedInfluencers = influencers.map(inf => ({
    id: inf.userId ,
    name: `${inf.user?.firstName || 'Unknown'} ${inf.user?.lastName || ''}`,
    image: inf.image || null,
    location: inf.location || 'Unknown Location',
    niche: inf.categories ? inf.categories[0] : 'General',
    primaryPlatform: inf.primaryPlatform || 'Instagram',
    followersCount: inf.followersCount || 0,
    engagementRate: inf.engagementRate || 0,
    matchScore: 0, // Mock or calculate
    avgViews: '0', // Mock
    rating: 0, // Mock
    contentTypes: inf.contentTypes || [],
    collaborationTypes: inf.collaborationTypes || [],
    email: inf.user?.email,
    completionPercentage: inf.completionPercentage
  }));

  if (isLoading && influencers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-10 h-10 text-white animate-spin" />
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="space-y-6 lg:space-y-8">
   

      {/* Search & Filter Component */}
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-[#745CB4]/10 to-[#C1B6FD]/10 border border-[#C1B6FD]/30 rounded-xl p-4 flex items-start gap-3 shadow-lg shadow-[#745CB4]/5">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold mb-1">Smart AI Recommendations</p>
          <p className="text-sm text-gray-300">Showing {totalItems} influencers matched to your campaign history and target audience</p>
        </div>
      </div>

      {/* Influencers List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : mappedInfluencers.length > 0 ? (
          mappedInfluencers.map((influencer, index) => (
            <InfluencerCard key={index} influencer={influencer} />
          ))
        ) : (
          <div className="text-center py-10 text-gray-400">
            No influencers found.
          </div>
        )}
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
      />
    </div>
  );
}

export default DiscoverInfluencers;