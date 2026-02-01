import { TrendingUp, Users, DollarSign, Target, Calendar, Award } from 'lucide-react';
import { useState } from 'react';

function Analytics() {
  const [timeRange, setTimeRange] = useState('all');

  // Mock analytics data based on Collaboration entities
  const analyticsData = {
    overview: {
      totalCollaborations: 8,
      activeCollaborations: 2,
      completedCollaborations: 2,
      totalBudgetSpent: 24300,
      avgCollaborationDuration: 56,
      successRate: 92
    },
    byStatus: {
      pending: 1,
      active: 2,
      completed: 2,
      cancelled: 1
    },
    topPerformers: [
      {
        influencerName: 'Sarah Johnson',
        collaborations: 2,
        avgEngagement: 5.8,
        totalReach: 450000,
        budget: 13000
      },
      {
        influencerName: 'Mike Chen',
        collaborations: 1,
        avgEngagement: 6.2,
        totalReach: 320000,
        budget: 8000
      },
      {
        influencerName: 'Alex Rivera',
        collaborations: 1,
        avgEngagement: 4.5,
        totalReach: 180000,
        budget: 7500
      }
    ],
    byCampaign: [
      {
        campaignName: 'Summer Fashion Launch',
        collaborations: 3,
        budget: 18300,
        status: 'active',
        completionRate: 65
      },
      {
        campaignName: 'Holiday Collection 2024',
        collaborations: 1,
        budget: 8000,
        status: 'completed',
        completionRate: 100
      },
      {
        campaignName: 'Tech Product Launch Q1',
        collaborations: 2,
        budget: 16000,
        status: 'active',
        completionRate: 45
      }
    ],
    monthlyTrends: [
      { month: 'Oct', collaborations: 2, budget: 11000 },
      { month: 'Nov', collaborations: 3, budget: 16500 },
      { month: 'Dec', collaborations: 1, budget: 8000 },
      { month: 'Jan', collaborations: 4, budget: 23500 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-indigo-400" />
            Collaboration Analytics
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Performance metrics and insights
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
        >
          <option value="all">All Time</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="365">Last Year</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 backdrop-blur-md border border-indigo-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total</p>
          <p className="text-2xl font-bold text-indigo-400">{analyticsData.overview.totalCollaborations}</p>
          <p className="text-xs text-gray-400 mt-1">Collaborations</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Active</p>
          <p className="text-2xl font-bold text-green-400">{analyticsData.overview.activeCollaborations}</p>
          <p className="text-xs text-gray-400 mt-1">Right now</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Completed</p>
          <p className="text-2xl font-bold text-blue-400">{analyticsData.overview.completedCollaborations}</p>
          <p className="text-xs text-gray-400 mt-1">Finished</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Budget</p>
          <p className="text-2xl font-bold text-white">${(analyticsData.overview.totalBudgetSpent / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-400 mt-1">Total spent</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Avg Duration</p>
          <p className="text-2xl font-bold text-white">{analyticsData.overview.avgCollaborationDuration}</p>
          <p className="text-xs text-gray-400 mt-1">Days</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Success</p>
          <p className="text-2xl font-bold text-purple-400">{analyticsData.overview.successRate}%</p>
          <p className="text-xs text-gray-400 mt-1">Rate</p>
        </div>
      </div>

      {/* Status Distribution & Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Status Distribution</h3>
          <div className="space-y-3">
            {Object.entries(analyticsData.byStatus).map(([status, count]) => {
              const total = Object.values(analyticsData.byStatus).reduce((a, b) => a + b, 0);
              const percentage = (count / total) * 100;
              const colors = {
                pending: 'from-amber-400 to-amber-600',
                active: 'from-green-400 to-green-600',
                completed: 'from-blue-400 to-blue-600',
                cancelled: 'from-red-400 to-red-600'
              };
              
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400 capitalize">{status}</span>
                    <span className="text-sm font-semibold text-white">{count} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${colors[status]} rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Monthly Trends</h3>
          <div className="space-y-4">
            {analyticsData.monthlyTrends.map((month) => (
              <div key={month.month} className="flex items-center gap-4">
                <div className="w-12 text-gray-400 text-sm font-semibold">{month.month}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">{month.collaborations} collaborations</span>
                    <span className="text-xs font-semibold text-white">${(month.budget / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"
                      style={{ width: `${(month.budget / 25000) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-yellow-400" />
          <h3 className="text-lg font-bold text-white">Top Performing Influencers</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analyticsData.topPerformers.map((influencer, index) => (
            <div
              key={influencer.influencerName}
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{influencer.influencerName}</h4>
                  <p className="text-xs text-gray-400">{influencer.collaborations} collaborations</p>
                </div>
                {index === 0 && (
                  <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-yellow-400" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Engagement</span>
                  <span className="font-semibold text-green-400">{influencer.avgEngagement}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Reach</span>
                  <span className="font-semibold text-white">{(influencer.totalReach / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Budget</span>
                  <span className="font-semibold text-white">${influencer.budget.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* By Campaign */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">Performance by Campaign</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Campaign</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Collaborations</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Budget</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Completion</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.byCampaign.map((campaign, index) => (
                <tr
                  key={campaign.campaignName}
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                    index === analyticsData.byCampaign.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="py-4 px-6">
                    <p className="font-semibold text-white">{campaign.campaignName}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{campaign.collaborations}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-white">${campaign.budget.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      campaign.status === 'active' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                          style={{ width: `${campaign.completionRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-white w-12">{campaign.completionRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
