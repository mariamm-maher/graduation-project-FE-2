import { Search, Filter, Calendar, Users, DollarSign, TrendingUp, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaigns } from './campaignsData';

function ActiveCampaigns() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Active Campaigns</h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Monitor and manage currently running campaigns
          </p>
        </div>
        <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
          + Create Campaign
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-transparent transition-all"
          />
        </div>
        <button className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-400 hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Campaigns List – Full responsive without overflow */}
      <div className="space-y-5">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300"
          >
            {/* Top Section */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 
                    onClick={() => navigate(`/dashboard/campaigns/${campaign.id}`)}
                    className="text-xl font-bold text-white truncate cursor-pointer hover:text-[#C1B6FD] transition-colors"
                  >
                    {campaign.name}
                  </h3>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold whitespace-nowrap">
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">
                    {campaign.startDate} - {campaign.endDate}
                  </span>
                </div>
              </div>
              <button className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Stats Grid – Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
              <div className="bg-white/5 rounded-xl p-4 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <p className="text-xs text-gray-400">Influencers</p>
                </div>
                <p className="text-lg font-bold text-white">{campaign.influencers}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center sm:text-left">
                <p className="text-xs text-gray-400 mb-1">Budget</p>
                <p className="text-lg font-bold text-white">{campaign.budget}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center sm:text-left">
                <p className="text-xs text-gray-400 mb-1">Spent</p>
                <p className="text-lg font-bold text-[#C1B6FD]">{campaign.spent}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center sm:text-left">
                <p className="text-xs text-gray-400 mb-1">Reach</p>
                <p className="text-lg font-bold text-white">{campaign.reach}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center sm:text-left">
                <p className="text-xs text-gray-400 mb-1">Engagement</p>
                <p className="text-lg font-bold text-green-400">{campaign.engagement}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center sm:text-left">
                <p className="text-xs text-gray-400 mb-1">Progress</p>
                <p className="text-lg font-bold text-white">{campaign.progress}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-5">
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-full transition-all duration-700"
                  style={{ width: `${campaign.progress}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button 
                onClick={() => navigate(`/dashboard/campaigns/${campaign.id}`)}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white font-medium transition-all"
              >
                View Details
              </button>
              <button className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white font-medium transition-all">
                Edit Campaign
              </button>
              <button className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl flex items-center justify-center transition-all">
                <TrendingUp className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveCampaigns;