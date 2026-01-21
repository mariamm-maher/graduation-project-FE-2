import { BarChart3, TrendingUp, Users, Eye, ArrowRight, DollarSign, Target, Zap, Download, Calendar, TrendingDown, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

function AnalyticsOverview() {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Agency Performance Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-400">Unified overview of all campaigns, influencers, and social channels</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all w-full sm:w-auto">
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          Generate Report
        </button>
      </div>

      {/* Agency Performance Overview - Top Level Summary */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-white">Agency Performance Overview</h2>
          <span className="text-xs text-gray-400">Real-time Health Check</span>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Campaigns */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-green-400/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs text-green-400 font-semibold">Active</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">24</p>
            <p className="text-xs sm:text-sm text-gray-400">Active Campaigns</p>
          </div>

          {/* Budget Spent */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-blue-400/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Allocated</p>
                <p className="text-xs text-white font-semibold">$850K</p>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">$627K</p>
            <p className="text-xs sm:text-sm text-gray-400">Budget Spent (74%)</p>
            <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-linear-to-r from-blue-500 to-blue-400 w-[74%]"></div>
            </div>
          </div>

          {/* Total Reach */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-purple-400/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs text-green-400 font-semibold">+24%</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">18.4M</p>
            <p className="text-xs sm:text-sm text-gray-400">Total Reach & Engagement</p>
          </div>

          {/* Average ROI */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-yellow-400/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-xs text-green-400 font-semibold">+32%</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">412%</p>
            <p className="text-xs sm:text-sm text-gray-400">Average ROI</p>
          </div>
        </div>
      </div>

      {/* Campaign Analytics */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-white">Campaign Analytics</h2>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold">Active</button>
            <button className="px-3 py-1.5 bg-white/5 text-gray-400 rounded-lg text-xs font-semibold hover:bg-white/10 transition-all">Completed</button>
            <button className="px-3 py-1.5 bg-white/5 text-gray-400 rounded-lg text-xs font-semibold hover:bg-white/10 transition-all">Scheduled</button>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Summer Fashion Launch', status: 'active', engagement: '8.2%', reach: '2.4M', budget: 72, conversions: 1250, roi: '385%' },
            { name: 'Tech Product Review Series', status: 'active', engagement: '6.5%', reach: '1.8M', budget: 68, conversions: 890, roi: '412%' },
            { name: 'Holiday Gift Guide', status: 'scheduled', engagement: '0%', reach: '0', budget: 0, conversions: 0, roi: 'N/A' },
          ].map((campaign, idx) => (
            <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-all group">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-semibold group-hover:text-[#C1B6FD] transition-colors text-base sm:text-lg">{campaign.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    campaign.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                {campaign.status === 'active' && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs text-gray-400">Budget Usage:</span>
                    <div className="flex-1 sm:w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD]" style={{ width: `${campaign.budget}%` }}></div>
                    </div>
                    <span className="text-xs text-white font-semibold">{campaign.budget}%</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Engagement</p>
                  <p className="text-base sm:text-lg font-bold text-white">{campaign.engagement}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Reach</p>
                  <p className="text-base sm:text-lg font-bold text-white">{campaign.reach}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Conversions</p>
                  <p className="text-base sm:text-lg font-bold text-white">{campaign.conversions}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">ROI</p>
                  <p className="text-base sm:text-lg font-bold text-green-400">{campaign.roi}</p>
                </div>
                <div className="flex items-end justify-start sm:justify-end">
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-gray-300 transition-all">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Performance Insights */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 lg:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-6">Channel Performance Insights</h2>
          
          <div className="space-y-4">
            {[
              { platform: 'Instagram', followers: '284K', growth: '+12.4%', engagement: '8.2%', trend: 'up', color: 'pink' },
              { platform: 'TikTok', followers: '456K', growth: '+24.8%', engagement: '12.5%', trend: 'up', color: 'cyan' },
              { platform: 'YouTube', followers: '128K', growth: '+8.2%', engagement: '6.8%', trend: 'up', color: 'red' },
              { platform: 'Twitter', followers: '92K', growth: '-2.1%', engagement: '4.2%', trend: 'down', color: 'blue' },
            ].map((channel, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-400/20 transition-all gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${channel.color}-500/20 flex items-center justify-center`}>
                    <Activity className={`w-6 h-6 text-${channel.color}-400`} />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{channel.platform}</p>
                    <p className="text-xs text-gray-400">{channel.followers} followers</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-400">Growth</p>
                    <p className={`text-sm font-bold ${channel.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {channel.growth}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-400">Engagement</p>
                    <p className="text-sm font-bold text-white">{channel.engagement}</p>
                  </div>
                  {channel.trend === 'up' ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-sm font-semibold text-white mb-4">Best Performing Content</h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2">
                <span className="text-gray-400">Video Content</span>
                <span className="text-white font-semibold">12.4% avg engagement</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2">
                <span className="text-gray-400">Peak Posting Time</span>
                <span className="text-white font-semibold">2-4 PM weekdays</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial & Budget Tracking */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 lg:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-6">Financial & Budget Tracking</h2>
          
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <h3 className="text-sm font-semibold text-gray-300">Budget Allocation by Campaign</h3>
              <span className="text-xs text-gray-400">Total: $850K</span>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Summer Fashion', allocated: 185, spent: 134, color: 'blue' },
                { name: 'Tech Review', allocated: 125, spent: 85, color: 'purple' },
                { name: 'Holiday Guide', allocated: 280, spent: 0, color: 'green' },
                { name: 'Spring Collection', allocated: 160, spent: 128, color: 'yellow' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex flex-col sm:flex-row justify-between mb-3 gap-2">
                    <span className="text-sm text-white font-medium">{item.name}</span>
                    <span className="text-xs text-gray-400">
                      ${item.spent}K / ${item.allocated}K
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-linear-to-r from-${item.color}-500 to-${item.color}-400 transition-all duration-500`}
                      style={{ width: `${(item.spent / item.allocated) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <div className="grid grid-cols-2 gap-6 mb-5">
              <div>
                <p className="text-xs text-gray-400 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-white">$627K</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Remaining</p>
                <p className="text-2xl font-bold text-green-400">$223K</p>
              </div>
            </div>
            
            <div className="pt-5 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Spending Forecast</span>
                <span className="text-xs text-[#C1B6FD] font-semibold">On Track</span>
              </div>
              <p className="text-xs text-gray-400">
                Based on current trends, estimated to use 92% of allocated budget by month end
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Insights */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white">Key Performance Insights</h2>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="w-3 h-3 rounded-full bg-green-400 mt-1 flex-shrink-0"></div>
            <div>
              <p className="text-white font-medium mb-1">Engagement rates increased by 15% this week</p>
              <p className="text-xs text-gray-400">Strong performance across Instagram and TikTok</p>
              <span className="inline-block mt-2 text-xs text-green-400 font-semibold">+15% Growth</span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="w-3 h-3 rounded-full bg-blue-400 mt-1 flex-shrink-0"></div>
            <div>
              <p className="text-white font-medium mb-1">Audience reach expanded to new demographics</p>
              <p className="text-xs text-gray-400">25-34 age group showing highest growth</p>
              <span className="inline-block mt-2 text-xs text-blue-400 font-semibold">+28% Reach</span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="w-3 h-3 rounded-full bg-purple-400 mt-1 flex-shrink-0"></div>
            <div>
              <p className="text-white font-medium mb-1">ROI improved significantly in Q1 2025</p>
              <p className="text-xs text-gray-400">Best performing quarter to date</p>
              <span className="inline-block mt-2 text-xs text-purple-400 font-semibold">+32% ROI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsOverview;