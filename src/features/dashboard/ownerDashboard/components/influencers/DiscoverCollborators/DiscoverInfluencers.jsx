import { Zap } from 'lucide-react';
import { useState } from 'react';
import InfluencerCard from './InfluencerCard';
import SearchFilters from './SearchFilters';
import Pagination from './Pagination';

const influencers = [
  {
    id: 4,
    name: 'Alex Rivera',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop',
    location: 'Los Angeles, CA',
    niche: 'Fitness & Sports',
    primaryPlatform: 'Instagram',
    followersCount: 890000,
    engagementRate: 7.8,
    matchScore: 95,
    avgViews: '125K',
    rating: 4.7,
    contentTypes: ['Reels', 'Stories', 'Posts'],
    collaborationTypes: ['Sponsored Posts', 'Product Reviews', 'Brand Ambassador'],
  },
  {
    id: 5,
    name: 'Jessica Lee',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    location: 'New York, NY',
    niche: 'Travel & Adventure',
    primaryPlatform: 'YouTube',
    followersCount: 1200000,
    engagementRate: 8.9,
    matchScore: 92,
    avgViews: '280K',
    rating: 4.9,
    contentTypes: ['Vlogs', 'Tutorials', 'Reviews'],
    collaborationTypes: ['Sponsored Videos', 'Travel Partnerships', 'Affiliate Marketing'],
  },
  {
    id: 6,
    name: 'David Park',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    location: 'San Francisco, CA',
    niche: 'Food & Cooking',
    primaryPlatform: 'TikTok',
    followersCount: 650000,
    engagementRate: 10.2,
    matchScore: 88,
    avgViews: '95K',
    rating: 4.6,
    contentTypes: ['Short Videos', 'Recipes', 'Live Streams'],
    collaborationTypes: ['Recipe Features', 'Restaurant Reviews', 'Product Placements'],
  },
  {
    id: 7,
    name: 'Sophie Taylor',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    location: 'Miami, FL',
    niche: 'Fashion & Style',
    primaryPlatform: 'Instagram',
    followersCount: 2100000,
    engagementRate: 7.5,
    matchScore: 90,
    avgViews: '180K',
    rating: 4.8,
    contentTypes: ['Fashion Posts', 'Hauls', 'Lookbooks'],
    collaborationTypes: ['Brand Collaborations', 'Sponsored Content', 'Giveaways'],
  },
  {
    id: 8,
    name: 'Marcus Johnson',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    location: 'Chicago, IL',
    niche: 'Tech & Gaming',
    primaryPlatform: 'YouTube',
    followersCount: 1500000,
    engagementRate: 9.1,
    matchScore: 94,
    avgViews: '320K',
    rating: 4.9,
    contentTypes: ['Reviews', 'Unboxing', 'Gaming Streams'],
    collaborationTypes: ['Tech Reviews', 'Sponsored Streams', 'Product Launches'],
  },
  {
    id: 9,
    name: 'Emily Chen',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    location: 'Seattle, WA',
    niche: 'Beauty & Lifestyle',
    primaryPlatform: 'Instagram',
    followersCount: 980000,
    engagementRate: 8.4,
    matchScore: 91,
    avgViews: '145K',
    rating: 4.7,
    contentTypes: ['Makeup Tutorials', 'Skincare', 'GRWM'],
    collaborationTypes: ['Product Reviews', 'Brand Partnerships', 'Tutorials'],
  },
];

function DiscoverInfluencers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(influencers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInfluencers = influencers.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Discover Talent</h1>
        <p className="text-gray-400 text-sm sm:text-base">Find influencers that match your campaign goals</p>
      </div>

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
          <p className="text-sm text-gray-300">Showing {currentInfluencers.length} influencers matched to your campaign history and target audience</p>
        </div>
      </div>

      {/* Influencers List */}
      <div className="space-y-4">
        {currentInfluencers.map((influencer) => (
          <InfluencerCard key={influencer.id} influencer={influencer} />
        ))}
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalItems={influencers.length}
        startIndex={startIndex}
        endIndex={endIndex}
      />
    </div>
  );
}

export default DiscoverInfluencers;