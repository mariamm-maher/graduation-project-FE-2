import { Zap, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import InfluencerCard from './InfluencerCard';
import SearchFilters from './SearchFilters';
import Pagination from './Pagination';
import useOwnerStore from '../../../../../../stores/ownerStore';

function DiscoverInfluencers() {
  const initialFilters = {
    categories: [],
    location: '',
    platform: '',
    minFollowers: '',
    minEngagement: '',
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  // Use store
  const { influencers, pagination, isLoading, getInfluencers } = useOwnerStore();
  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;

  console.log('Influencers Data:', influencers[0]?.id ,influencers[0]?.userId);
  useEffect(() => {
    getInfluencers(currentPage);
  }, [getInfluencers, currentPage]);

  const handlePageChange = (page) => {
    getInfluencers(page);
  };

  // Map API data to component props
  const mappedInfluencers = influencers.map(inf => ({
    profileId: inf.id || null,
    userId: inf.userId || null,
    name: `${inf.user?.firstName || 'Unknown'} ${inf.user?.lastName || ''}`,
    image: inf.image || null,
    location: inf.location || 'Unknown Location',
    categories: Array.isArray(inf.categories) && inf.categories.length > 0 ? inf.categories : ['General'],
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

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredInfluencers = mappedInfluencers.filter((influencer) => {
    const matchesSearch =
      !normalizedQuery ||
      [
        influencer.name,
        ...(influencer.categories || []),
        influencer.location,
        influencer.primaryPlatform,
        ...(influencer.contentTypes || []),
        ...(influencer.collaborationTypes || []),
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);

    const selectedCategories = (filters.categories || []).map((category) => category.toLowerCase());

    const matchesCategories =
      selectedCategories.length === 0 ||
      (influencer.categories || []).some((category) =>
        selectedCategories.includes((category || '').toLowerCase())
      );

    const matchesLocation =
      !filters.location ||
      (influencer.location || '').toLowerCase().includes(filters.location.toLowerCase());

    const matchesPlatform =
      !filters.platform ||
      (influencer.primaryPlatform || '').toLowerCase() === filters.platform.toLowerCase();

    const matchesMinFollowers =
      !filters.minFollowers || influencer.followersCount >= Number(filters.minFollowers);

    const matchesMinEngagement =
      !filters.minEngagement || influencer.engagementRate >= Number(filters.minEngagement);

    return (
      matchesSearch &&
      matchesCategories &&
      matchesLocation &&
      matchesPlatform &&
      matchesMinFollowers &&
      matchesMinEngagement
    );
  });

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setSearchQuery('');
  };

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
        filters={filters}
        setFilters={setFilters}
        onClearFilters={handleClearFilters}
      />



      {/* Influencers List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-gray-300">
            Showing <span className="font-semibold text-white">{filteredInfluencers.length}</span>
            {' '}of <span className="font-semibold text-white">{mappedInfluencers.length}</span> influencers
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : filteredInfluencers.length > 0 ? (
          filteredInfluencers.map((influencer, index) => (
            <InfluencerCard key={index} influencer={influencer} />
          ))
        ) : (
          <div className="text-center py-10 text-gray-400">
            No influencers found for the selected search and filters.
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