import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import CollaborationRow from './CollaborationRow';
import HistoryStats from './HistoryStats';
import HistorySearchBar from './HistorySearchBar';
import HistoryFiltersPanel from './HistoryFiltersPanel';

const pastCollaborations = [
  {
    id: 1,
    influencerId: 8,
    influencerName: 'Chris Wilson',
    influencerAvatar: 'CW',
    influencerImage: 'https://i.pravatar.cc/150?img=13',
    niche: 'Gaming',
    campaignName: 'Holiday Gaming Setup Launch',
    startDate: 'Oct 1, 2024',
    endDate: 'Dec 15, 2024',
    status: 'completed',
    performance: '4.8',
    roi: '245%',
    engagement: '12.5%',
    revenue: '28,400',
  },
  {
    id: 2,
    influencerId: 9,
    influencerName: 'Maria Garcia',
    influencerAvatar: 'MG',
    influencerImage: 'https://i.pravatar.cc/150?img=26',
    niche: 'Lifestyle',
    campaignName: 'Fall Lifestyle Collection',
    startDate: 'Sep 1, 2024',
    endDate: 'Oct 8, 2024',
    status: 'completed',
    performance: '4.2',
    roi: '180%',
    engagement: '8.7%',
    revenue: '15,600',
  },
  {
    id: 3,
    influencerId: 10,
    influencerName: 'Tom Anderson',
    influencerAvatar: 'TA',
    influencerImage: 'https://i.pravatar.cc/150?img=52',
    niche: 'Tech Reviews',
    campaignName: 'Smart Home Tech Series',
    startDate: 'Sep 15, 2024',
    endDate: 'Nov 22, 2024',
    status: 'completed',
    performance: '4.9',
    roi: '320%',
    engagement: '15.2%',
    revenue: '42,100',
  },
  {
    id: 4,
    influencerId: 11,
    influencerName: 'Sophie Martinez',
    influencerAvatar: 'SM',
    influencerImage: 'https://i.pravatar.cc/150?img=32',
    niche: 'Beauty',
    campaignName: 'Summer Makeup Launch',
    startDate: 'Jun 1, 2024',
    endDate: 'Jul 20, 2024',
    status: 'completed',
    performance: '4.6',
    roi: '210%',
    engagement: '11.3%',
    revenue: '35,800',
  },
  {
    id: 5,
    influencerId: 12,
    influencerName: 'James Taylor',
    influencerAvatar: 'JT',
    influencerImage: 'https://i.pravatar.cc/150?img=15',
    niche: 'Fitness',
    campaignName: 'Spring Fitness Challenge',
    startDate: 'Mar 1, 2024',
    endDate: 'Apr 15, 2024',
    status: 'cancelled',
    performance: '2.8',
    roi: '45%',
    engagement: '4.2%',
    revenue: '8,200',
  },
  {
    id: 6,
    influencerId: 13,
    influencerName: 'Rachel Green',
    influencerAvatar: 'RG',
    influencerImage: 'https://i.pravatar.cc/150?img=44',
    niche: 'Fashion',
    campaignName: 'Winter Fashion Lookbook',
    startDate: 'Nov 1, 2025',
    endDate: 'Dec 31, 2025',
    status: 'completed',
    performance: '4.7',
    roi: '265%',
    engagement: '13.8%',
    revenue: '48,500',
  },
];

function InfluencersHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    minPerformance: 0,
    maxPerformance: 5,
    minROI: 0,
    maxROI: 500,
    year: 'all',
  });

  // Filter logic
  const filteredCollaborations = useMemo(() => {
    return pastCollaborations.filter((collab) => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        collab.influencerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collab.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collab.niche.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = filters.status.length === 0 || filters.status.includes(collab.status);

      // Performance filter
      const performance = parseFloat(collab.performance);
      const matchesPerformance = performance >= filters.minPerformance && performance <= filters.maxPerformance;

      // ROI filter
      const roi = parseFloat(collab.roi.replace(/[^0-9.-]+/g, ''));
      const matchesROI = roi >= filters.minROI && roi <= filters.maxROI;

      // Year filter
      const year = collab.endDate.split(',')[1]?.trim();
      const matchesYear = filters.year === 'all' || year === filters.year;

      return matchesSearch && matchesStatus && matchesPerformance && matchesROI && matchesYear;
    });
  }, [searchQuery, filters]);

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
    setFilters({
      status: [],
      minPerformance: 0,
      maxPerformance: 5,
      minROI: 0,
      maxROI: 500,
      year: 'all',
    });
    setSearchQuery('');
  };

  const hasActiveFilters = filters.status.length > 0 || 
    filters.minPerformance > 0 || 
    filters.maxPerformance < 5 ||
    filters.minROI > 0 ||
    filters.maxROI < 500 ||
    filters.year !== 'all' ||
    searchQuery !== '';

  const activeFiltersCount = filters.status.length + 
    (filters.year !== 'all' ? 1 : 0) + 
    (searchQuery ? 1 : 0);

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
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Past Collaborations</h1>
        <p className="text-gray-400 text-sm sm:text-base">Review completed partnerships and performance history</p>
      </div>

      {/* Stats Cards */}
      <HistoryStats collaborations={pastCollaborations} />

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
        <AnimatePresence>
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
        </AnimatePresence>
      </div>
    </div>
  );
}

export default InfluencersHistory;