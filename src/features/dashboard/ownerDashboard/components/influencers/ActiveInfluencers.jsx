import { Search, Filter, MessageSquare, Star, Instagram, Youtube, BarChart3, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const influencers = [
  { 
    id: 1, 
    name: 'Sarah Johnson',
    avatar: 'SJ',
    niche: 'Fashion & Lifestyle',
    followers: 2400000,
    followersDisplay: '2.4M',
    engagement: 8.2,
    engagementDisplay: '8.2%',
    platform: 'instagram',
    campaigns: 3,
    revenue: '$45,200',
    rating: 4.9,
    joinedDate: 'Jan 2025',
  },
  { 
    id: 2, 
    name: 'Mike Chen',
    avatar: 'MC',
    niche: 'Tech Reviews',
    followers: 1800000,
    followersDisplay: '1.8M',
    engagement: 6.5,
    engagementDisplay: '6.5%',
    platform: 'youtube',
    campaigns: 2,
    revenue: '$38,500',
    rating: 4.8,
    joinedDate: 'Dec 2024',
  },
  { 
    id: 3, 
    name: 'Emma Davis',
    avatar: 'ED',
    niche: 'Beauty & Wellness',
    followers: 3100000,
    followersDisplay: '3.1M',
    engagement: 9.1,
    engagementDisplay: '9.1%',
    platform: 'instagram',
    campaigns: 5,
    revenue: '$62,800',
    rating: 5.0,
    joinedDate: 'Nov 2024',
  },
  { 
    id: 4, 
    name: 'Alex Rivera',
    avatar: 'AR',
    niche: 'Fitness & Health',
    followers: 1200000,
    followersDisplay: '1.2M',
    engagement: 7.8,
    engagementDisplay: '7.8%',
    platform: 'youtube',
    campaigns: 4,
    revenue: '$52,100',
    rating: 4.7,
    joinedDate: 'Oct 2024',
  },
  { 
    id: 5, 
    name: 'Lisa Wang',
    avatar: 'LW',
    niche: 'Fashion & Lifestyle',
    followers: 5000000,
    followersDisplay: '5.0M',
    engagement: 10.5,
    engagementDisplay: '10.5%',
    platform: 'instagram',
    campaigns: 8,
    revenue: '$95,300',
    rating: 4.9,
    joinedDate: 'Sep 2024',
  },
  { 
    id: 6, 
    name: 'David Kim',
    avatar: 'DK',
    niche: 'Tech Reviews',
    followers: 900000,
    followersDisplay: '900K',
    engagement: 5.2,
    engagementDisplay: '5.2%',
    platform: 'youtube',
    campaigns: 1,
    revenue: '$18,400',
    rating: 4.5,
    joinedDate: 'Jan 2025',
  },
];

function ActiveInfluencers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    minRating: 0,
    maxRating: 5,
    minCampaigns: 0,
    maxCampaigns: 10,
    platforms: [],
    minFollowers: 0,
    maxFollowers: 10000000,
    minEngagement: 0,
    maxEngagement: 15,
  });

  const getPlatformIcon = (platform) => {
    if (platform === 'instagram') return <Instagram className="w-4 h-4 text-pink-400" />;
    if (platform === 'youtube') return <Youtube className="w-4 h-4 text-red-400" />;
    return null;
  };

  // Filter logic
  const filteredInfluencers = useMemo(() => {
    return influencers.filter((influencer) => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        influencer.niche.toLowerCase().includes(searchQuery.toLowerCase()) ||
        influencer.platform.toLowerCase().includes(searchQuery.toLowerCase());

      // Rating filter
      const matchesRating = influencer.rating >= filters.minRating && influencer.rating <= filters.maxRating;

      // Campaigns filter
      const matchesCampaigns = influencer.campaigns >= filters.minCampaigns && influencer.campaigns <= filters.maxCampaigns;

      // Platform filter
      const matchesPlatform = filters.platforms.length === 0 || filters.platforms.includes(influencer.platform);

      // Followers filter
      const matchesFollowers = influencer.followers >= filters.minFollowers && influencer.followers <= filters.maxFollowers;

      // Engagement filter
      const matchesEngagement = influencer.engagement >= filters.minEngagement && influencer.engagement <= filters.maxEngagement;

      return matchesSearch && matchesRating && matchesCampaigns && matchesPlatform && matchesFollowers && matchesEngagement;
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

  const clearFilters = () => {
    setFilters({
      minRating: 0,
      maxRating: 5,
      minCampaigns: 0,
      maxCampaigns: 10,
      platforms: [],
      minFollowers: 0,
      maxFollowers: 10000000,
      minEngagement: 0,
      maxEngagement: 15,
    });
    setSearchQuery('');
  };

  const hasActiveFilters = filters.minRating > 0 || filters.maxRating < 5 || 
    filters.minCampaigns > 0 || filters.maxCampaigns < 10 || 
    filters.platforms.length > 0 || 
    filters.minFollowers > 0 || filters.maxFollowers < 10000000 ||
    filters.minEngagement > 0 || filters.maxEngagement < 15 ||
    searchQuery !== '';

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Active Collaborators</h1>
          <p className="text-gray-400 text-sm sm:text-base">Manage your current influencer partnerships</p>
        </div>
        <button className="px-5 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all whitespace-nowrap">
          Add Collaborator
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, niche, or platform..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 border rounded-xl transition-all flex items-center justify-center gap-2 relative ${
            hasActiveFilters 
              ? 'bg-[#745CB4]/20 border-[#C1B6FD] text-white' 
              : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-400'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span className="text-sm font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C1B6FD] rounded-full flex items-center justify-center text-xs font-bold text-white">
              {filters.platforms.length + (searchQuery ? 1 : 0) + (filters.minRating > 0 || filters.maxRating < 5 ? 1 : 0) + (filters.minCampaigns > 0 || filters.maxCampaigns < 10 ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing <span className="text-white font-semibold">{filteredInfluencers.length}</span> of <span className="text-white font-semibold">{influencers.length}</span> influencers
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-[#C1B6FD] hover:text-white transition-all flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear filters
          </button>
        )}
      </div>

      {/* Main Content: Influencers List + Filters Sidebar */}
      <div className={`grid gap-6 transition-all duration-300 ${
        showFilters 
          ? 'lg:grid-cols-[1fr_320px]' 
          : 'lg:grid-cols-1'
      }`}>
        {/* Influencers List */}
        <div className="space-y-5 order-2 lg:order-1">
        {filteredInfluencers.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">No influencers found</h3>
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
          filteredInfluencers.map((influencer) => (
          <div
            key={influencer.id}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 lg:p-6 hover:bg-white/10 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center font-bold text-white text-xl shrink-0">
                {influencer.avatar}
              </div>

              <div className="flex-1 w-full">
                {/* Name + Status + Message Button */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg sm:text-xl font-bold text-white">{influencer.name}</h3>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 rounded-full">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400 font-semibold">Active</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{influencer.niche}</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold text-white">{influencer.rating}</span>
                      <span className="text-sm text-gray-500">• Joined {influencer.joinedDate}</span>
                    </div>
                  </div>

                  <button className="px-4 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </button>
                </div>

                {/* Stats Grid – Responsive */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
                  <div className="bg-white/5 rounded-lg p-3 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      {getPlatformIcon(influencer.platform)}
                      <p className="text-xs text-gray-400">Followers</p>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-white">{influencer.followersDisplay}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center sm:text-left">
                    <p className="text-xs text-gray-400 mb-1">Engagement</p>
                    <p className="text-base sm:text-lg font-bold text-white">{influencer.engagementDisplay}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center sm:text-left">
                    <p className="text-xs text-gray-400 mb-1">Campaigns</p>
                    <p className="text-base sm:text-lg font-bold text-white">{influencer.campaigns}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center sm:text-left sm:col-span-2">
                    <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
                    <p className="text-base sm:text-lg font-bold text-[#C1B6FD]">{influencer.revenue}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => navigate(`/dashboard/influencers/${influencer.id}/profile`)}
                    className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-all"
                  >
                    View Profile
                  </button>
                  <button className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-all">
                    Campaign History
                  </button>
                  <button className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-all flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          ))
        )}
        </div>

        {/* Filter Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 h-fit lg:sticky lg:top-6 order-1 lg:order-2"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-all lg:hidden"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {/* Rating Filter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-white">Rating (Stars)</label>
                    <span className="text-xs text-gray-400">{filters.minRating.toFixed(1)} - {filters.maxRating.toFixed(1)}</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={filters.minRating}
                      onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C1B6FD]"
                    />
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={filters.maxRating}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxRating: parseFloat(e.target.value) }))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C1B6FD]"
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= filters.maxRating && star >= filters.minRating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Campaigns Filter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-white">Number of Campaigns</label>
                    <span className="text-xs text-gray-400">{filters.minCampaigns} - {filters.maxCampaigns}</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={filters.minCampaigns}
                      onChange={(e) => setFilters(prev => ({ ...prev, minCampaigns: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C1B6FD]"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={filters.maxCampaigns}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxCampaigns: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C1B6FD]"
                    />
                  </div>
                </div>

                {/* Platform Filter */}
                <div>
                  <label className="text-sm font-semibold text-white mb-3 block">Platform</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handlePlatformToggle('instagram')}
                      className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                        filters.platforms.includes('instagram')
                          ? 'bg-[#745CB4]/30 border-[#C1B6FD] text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <Instagram className="w-4 h-4" />
                      <span className="text-sm">Instagram</span>
                    </button>
                    <button
                      onClick={() => handlePlatformToggle('youtube')}
                      className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                        filters.platforms.includes('youtube')
                          ? 'bg-[#745CB4]/30 border-[#C1B6FD] text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <Youtube className="w-4 h-4" />
                      <span className="text-sm">YouTube</span>
                    </button>
                  </div>
                </div>

                {/* Followers Filter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-white">Followers</label>
                    <span className="text-xs text-gray-400">{formatNumber(filters.minFollowers)} - {formatNumber(filters.maxFollowers)}</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="100000"
                      value={filters.minFollowers}
                      onChange={(e) => setFilters(prev => ({ ...prev, minFollowers: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C1B6FD]"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="100000"
                      value={filters.maxFollowers}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxFollowers: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C1B6FD]"
                    />
                  </div>
                </div>

                {/* Engagement Filter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-white">Engagement Rate (%)</label>
                    <span className="text-xs text-gray-400">{filters.minEngagement.toFixed(1)}% - {filters.maxEngagement.toFixed(1)}%</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="0.1"
                      value={filters.minEngagement}
                      onChange={(e) => setFilters(prev => ({ ...prev, minEngagement: parseFloat(e.target.value) }))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C1B6FD]"
                    />
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="0.1"
                      value={filters.maxEngagement}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxEngagement: parseFloat(e.target.value) }))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C1B6FD]"
                    />
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-400 font-medium transition-all"
                >
                  Clear All
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ActiveInfluencers;