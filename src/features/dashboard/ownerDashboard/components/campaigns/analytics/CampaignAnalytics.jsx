import { BarChart3, TrendingUp, TrendingDown, Users, Eye, Heart, MessageCircle, Share2, Calendar, DollarSign } from 'lucide-react';
import { useState } from 'react';

function CampaignAnalytics() {
  const [timeRange, setTimeRange] = useState('30days');

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-indigo-400" />
            Campaign Analytics
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Detailed performance insights and metrics
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 backdrop-blur-md border border-indigo-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Eye className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="flex items-center gap-1 text-green-400 text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Reach</p>
          <p className="text-2xl font-bold text-white">8.4M</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-md border border-purple-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-400" />
            </div>
            <span className="flex items-center gap-1 text-green-400 text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              +8.3%
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Engagement Rate</p>
          <p className="text-2xl font-bold text-white">4.8%</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-md border border-blue-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <span className="flex items-center gap-1 text-red-400 text-sm font-semibold">
              <TrendingDown className="w-4 h-4" />
              -2.1%
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Active Influencers</p>
          <p className="text-2xl font-bold text-white">156</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-md border border-green-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <span className="flex items-center gap-1 text-green-400 text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              +15.7%
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">ROI</p>
          <p className="text-2xl font-bold text-white">342%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Campaign Performance</h3>
          <div className="h-64 flex items-center justify-center border border-white/10 rounded-xl bg-white/5">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </div>

        {/* Engagement Distribution */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Engagement Distribution</h3>
          <div className="h-64 flex items-center justify-center border border-white/10 rounded-xl bg-white/5">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Engagement Metrics</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-5 h-5 text-red-400" />
              <p className="text-sm text-gray-400">Likes</p>
            </div>
            <p className="text-2xl font-bold text-white">542K</p>
            <p className="text-xs text-green-400 mt-1">+12.5% from last month</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="w-5 h-5 text-blue-400" />
              <p className="text-sm text-gray-400">Comments</p>
            </div>
            <p className="text-2xl font-bold text-white">24.8K</p>
            <p className="text-xs text-green-400 mt-1">+8.3% from last month</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Share2 className="w-5 h-5 text-purple-400" />
              <p className="text-sm text-gray-400">Shares</p>
            </div>
            <p className="text-2xl font-bold text-white">18.2K</p>
            <p className="text-xs text-green-400 mt-1">+15.7% from last month</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-indigo-400" />
              <p className="text-sm text-gray-400">Impressions</p>
            </div>
            <p className="text-2xl font-bold text-white">2.4M</p>
            <p className="text-xs text-red-400 mt-1">-2.1% from last month</p>
          </div>
        </div>
      </div>

      {/* Top Performing Campaigns */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Top Performing Campaigns</h3>
        <div className="space-y-4">
          {[
            { name: 'Summer Fashion Launch', reach: '3.2M', engagement: '5.8%', roi: '+425%', color: 'indigo' },
            { name: 'Holiday Collection 2024', reach: '2.8M', engagement: '4.9%', roi: '+380%', color: 'purple' },
            { name: 'Spring Wellness Series', reach: '1.9M', engagement: '4.2%', roi: '+315%', color: 'blue' },
          ].map((campaign, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-10 h-10 rounded-xl bg-${campaign.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                  <BarChart3 className={`w-5 h-5 text-${campaign.color}-400`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate">{campaign.name}</h4>
                  <p className="text-sm text-gray-400">Active Campaign</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-right">
                  <p className="text-gray-400">Reach</p>
                  <p className="font-semibold text-white">{campaign.reach}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400">Engagement</p>
                  <p className="font-semibold text-green-400">{campaign.engagement}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400">ROI</p>
                  <p className="font-semibold text-green-400">{campaign.roi}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CampaignAnalytics;
