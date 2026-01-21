import { Search, Filter, Plus, Star, Zap } from 'lucide-react';
import { useState } from 'react';

const influencers = [
  {
    id: 4,
    name: 'Alex Rivera',
    avatar: 'AR',
    niche: 'Fitness & Sports',
    followers: '890K',
    engagement: '7.8%',
    matchScore: 95,
    avgViews: '125K',
    rating: 4.7,
  },
  {
    id: 5,
    name: 'Jessica Lee',
    avatar: 'JL',
    niche: 'Travel & Adventure',
    followers: '1.2M',
    engagement: '8.9%',
    matchScore: 92,
    avgViews: '280K',
    rating: 4.9,
  },
  {
    id: 6,
    name: 'David Park',
    avatar: 'DP',
    niche: 'Food & Cooking',
    followers: '650K',
    engagement: '10.2%',
    matchScore: 88,
    avgViews: '95K',
    rating: 4.6,
  },
  {
    id: 7,
    name: 'Sophie Taylor',
    avatar: 'ST',
    niche: 'Fashion & Style',
    followers: '2.1M',
    engagement: '7.5%',
    matchScore: 90,
    avgViews: '180K',
    rating: 4.8,
  },
];

function DiscoverInfluencers() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Discover Talent</h1>
        <p className="text-gray-400 text-sm sm:text-base">Find influencers that match your campaign goals</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by niche, location, or keywords..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
          />
        </div>
        <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400 font-medium">Advanced Filters</span>
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-[#745CB4]/10 border border-[#C1B6FD]/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Zap className="w-6 h-6 text-[#C1B6FD] shrink-0" />
        <div>
          <p className="text-white font-semibold mb-1">Smart Recommendations</p>
          <p className="text-sm text-gray-400">These influencers are matched based on your campaign history and target audience</p>
        </div>
      </div>

      {/* Influencers Grid – Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {influencers.map((influencer) => (
          <div
            key={influencer.id}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all relative group"
          >
            {/* Match Score Badge */}
            <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-[#C1B6FD] rounded-lg flex items-center gap-1">
              <Zap className="w-3 h-3 text-black" />
              <span className="text-xs font-bold text-black">{influencer.matchScore}% Match</span>
            </div>

            {/* Avatar + Name + Niche */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center font-bold text-white text-lg shrink-0">
                {influencer.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate">{influencer.name}</h3>
                <p className="text-sm text-gray-400 truncate">{influencer.niche}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-white">{influencer.rating}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Followers</span>
                <span className="text-white font-semibold">{influencer.followers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Engagement</span>
                <span className="text-[#C1B6FD] font-semibold">{influencer.engagement}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg Views</span>
                <span className="text-white font-semibold">{influencer.avgViews}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2.5 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Collaborate
              </button>
              <button className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-all">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiscoverInfluencers;