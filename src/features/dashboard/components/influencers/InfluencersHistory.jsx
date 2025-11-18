import { Search, Filter, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const pastCollaborations = [
  {
    id: 8,
    name: 'Chris Wilson',
    avatar: 'CW',
    niche: 'Gaming',
    campaigns: 2,
    totalRevenue: '$28,400',
    lastCampaign: 'Q4 2024',
    performance: 'Excellent',
    completionDate: 'Dec 15, 2024',
  },
  {
    id: 9,
    name: 'Maria Garcia',
    avatar: 'MG',
    niche: 'Lifestyle',
    campaigns: 1,
    totalRevenue: '$15,600',
    lastCampaign: 'Q3 2024',
    performance: 'Good',
    completionDate: 'Oct 8, 2024',
  },
  {
    id: 10,
    name: 'Tom Anderson',
    avatar: 'TA',
    niche: 'Tech',
    campaigns: 3,
    totalRevenue: '$42,100',
    lastCampaign: 'Q4 2024',
    performance: 'Excellent',
    completionDate: 'Nov 22, 2024',
  },
];

function InfluencersHistory() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Past Collaborations</h1>
          <p className="text-gray-400">Review completed partnerships and performance history</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <p className="text-sm text-gray-400 mb-1">Total Completed</p>
          <p className="text-3xl font-bold text-white">6</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <p className="text-sm text-gray-400 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-[#C1B6FD]">$86,100</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <p className="text-sm text-gray-400 mb-1">Avg Performance</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-white">4.7</p>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past collaborations..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
          />
        </div>
        <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400 font-medium">Filters</span>
        </button>
      </div>

      {/* Past Collaborations List */}
      <div className="space-y-4">
        {pastCollaborations.map((influencer) => (
          <div
            key={influencer.id}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center font-bold text-white text-lg shrink-0">
                {influencer.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{influencer.name}</h3>
                    <p className="text-sm text-gray-400">{influencer.niche}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400 mb-1">Last Campaign</p>
                    <p className="text-sm font-semibold text-white">{influencer.lastCampaign}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Campaigns</p>
                    <p className="text-lg font-bold text-white">{influencer.campaigns}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
                    <p className="text-lg font-bold text-[#C1B6FD]">{influencer.totalRevenue}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Performance</p>
                    <p className="text-lg font-bold text-green-400">{influencer.performance}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Completed</p>
                    <p className="text-sm font-semibold text-white">{influencer.completionDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-all">
                    View Details
                  </button>
                  <button className="flex-1 px-4 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all">
                    Reconnect & Start New Campaign
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

export default InfluencersHistory;
