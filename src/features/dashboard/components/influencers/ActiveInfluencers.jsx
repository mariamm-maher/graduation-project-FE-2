import { Search, Filter, MessageSquare, Star, Instagram, Youtube, BarChart3 } from 'lucide-react';
import { useState } from 'react';

const influencers = [
  { 
    id: 1, 
    name: 'Sarah Johnson',
    avatar: 'SJ',
    niche: 'Fashion & Lifestyle',
    followers: '2.4M',
    engagement: '8.2%',
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
    followers: '1.8M',
    engagement: '6.5%',
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
    followers: '3.1M',
    engagement: '9.1%',
    platform: 'instagram',
    campaigns: 5,
    revenue: '$62,800',
    rating: 5.0,
    joinedDate: 'Nov 2024',
  },
];

function ActiveInfluencers() {
  const [searchQuery, setSearchQuery] = useState('');

  const getPlatformIcon = (platform) => {
    if (platform === 'instagram') return <Instagram className="w-4 h-4" />;
    if (platform === 'youtube') return <Youtube className="w-4 h-4" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Active Collaborators</h1>
          <p className="text-gray-400">Manage your current influencer partnerships</p>
        </div>
        <button className="px-6 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
          Add Collaborator
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, niche, or platform..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
          />
        </div>
        <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400 font-medium">Filters</span>
        </button>
      </div>

      {/* Influencers List */}
      <div className="space-y-4">
        {influencers.map((influencer) => (
          <div
            key={influencer.id}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center font-bold text-white text-xl shrink-0">
                {influencer.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white">{influencer.name}</h3>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 rounded-full">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-green-400 font-semibold">Active</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{influencer.niche}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold text-white">{influencer.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">• Joined {influencer.joinedDate}</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      {getPlatformIcon(influencer.platform)}
                      <p className="text-xs text-gray-400">Followers</p>
                    </div>
                    <p className="text-lg font-bold text-white">{influencer.followers}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Engagement</p>
                    <p className="text-lg font-bold text-white">{influencer.engagement}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Campaigns</p>
                    <p className="text-lg font-bold text-white">{influencer.campaigns}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 col-span-2">
                    <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
                    <p className="text-lg font-bold text-[#C1B6FD]">{influencer.revenue}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-all">
                    View Profile
                  </button>
                  <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-all">
                    Campaign History
                  </button>
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-all">
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveInfluencers;
