import { Search, Filter, Calendar, Users, DollarSign, TrendingUp, MoreVertical } from 'lucide-react';
import { useState } from 'react';

const campaigns = [
  {
    id: 1,
    name: 'Summer Fashion Launch',
    status: 'active',
    influencers: 24,
    budget: '$85,000',
    spent: '$62,400',
    reach: '4.2M',
    engagement: '7.8%',
    startDate: 'Jan 15, 2025',
    endDate: 'Mar 15, 2025',
    progress: 73,
  },
  {
    id: 2,
    name: 'Holiday Collection 2024',
    status: 'active',
    influencers: 32,
    budget: '$120,000',
    spent: '$98,200',
    reach: '6.8M',
    engagement: '8.5%',
    startDate: 'Nov 1, 2024',
    endDate: 'Jan 31, 2025',
    progress: 82,
  },
  {
    id: 3,
    name: 'Spring Wellness Campaign',
    status: 'active',
    influencers: 18,
    budget: '$55,000',
    spent: '$21,300',
    reach: '2.1M',
    engagement: '6.9%',
    startDate: 'Feb 1, 2025',
    endDate: 'Apr 30, 2025',
    progress: 39,
  },
];

function ActiveCampaigns() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Active Campaigns</h1>
          <p className="text-gray-400">Monitor and manage currently running campaigns</p>
        </div>
        <button className="px-6 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
          Create Campaign
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
            placeholder="Search campaigns..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
          />
        </div>
        <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400 font-medium">Filters</span>
        </button>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">{campaign.name}</h3>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold">
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{campaign.startDate} - {campaign.endDate}</span>
                  </div>
                </div>
              </div>
              <button className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-6 gap-4 mb-4">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <p className="text-xs text-gray-400">Influencers</p>
                </div>
                <p className="text-lg font-bold text-white">{campaign.influencers}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Budget</p>
                <p className="text-lg font-bold text-white">{campaign.budget}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Spent</p>
                <p className="text-lg font-bold text-[#C1B6FD]">{campaign.spent}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Reach</p>
                <p className="text-lg font-bold text-white">{campaign.reach}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Engagement</p>
                <p className="text-lg font-bold text-green-400">{campaign.engagement}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Progress</p>
                <p className="text-lg font-bold text-white">{campaign.progress}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD]"
                  style={{ width: `${campaign.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-all">
                View Details
              </button>
              <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-all">
                Edit Campaign
              </button>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-all">
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveCampaigns;
