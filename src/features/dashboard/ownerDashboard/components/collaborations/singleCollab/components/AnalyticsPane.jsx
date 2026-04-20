import { Award, DollarSign, Target, TrendingUp, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeStatus(rawStatus) {
  const status = String(rawStatus || '').toLowerCase();

  if (['waiting_contract_sign', 'pending', 'waiting', 'negotiating'].includes(status)) return 'waiting';
  if (['live', 'active', 'in_progress'].includes(status)) return 'live';
  if (status === 'completed') return 'completed';
  if (['canceled', 'cancelled', 'terminated', 'rejected'].includes(status)) return 'canceled';

  return 'waiting';
}

function parseReferenceDate(item) {
  const raw = item?.createdAt || item?.startDate || item?.updatedAt || item?.endDate;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  return Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
}

function monthLabel(date) {
  return date.toLocaleDateString('en-US', { month: 'short' });
}

function toTitle(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function AnalyticsPane({ items = [] }) {
  const [timeRange, setTimeRange] = useState('all');

  const filteredItems = useMemo(() => {
    const source = Array.isArray(items) ? items : [];
    if (timeRange === 'all') return source;

    const rangeDays = Number(timeRange);
    if (!Number.isFinite(rangeDays) || rangeDays <= 0) return source;

    const now = Date.now();

    return source.filter((item) => {
      const refDate = parseReferenceDate(item);
      if (!refDate) return false;

      const diffDays = (now - refDate.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= rangeDays;
    });
  }, [items, timeRange]);

  const analyticsData = useMemo(() => {
    const source = filteredItems;
    const totalCollaborations = source.length;

    const byStatus = {
      waiting: 0,
      live: 0,
      completed: 0,
      canceled: 0,
    };

    let totalBudgetSpent = 0;
    let durationSum = 0;
    let durationCount = 0;

    const performerMap = new Map();
    const campaignMap = new Map();
    const monthMap = new Map();

    source.forEach((item) => {
      const status = normalizeStatus(item?.status);
      byStatus[status] += 1;

      const budget = toNumber(item?.budget);
      totalBudgetSpent += budget;

      const duration = daysBetween(item?.startDate, item?.endDate);
      if (duration !== null) {
        durationSum += duration;
        durationCount += 1;
      }

      const influencerName = String(item?.influencerName || 'Unknown influencer');
      const influencerCurrent = performerMap.get(influencerName) || {
        influencerName,
        collaborations: 0,
        avgEngagementRaw: 0,
        engagementSamples: 0,
        totalReach: 0,
        budget: 0,
      };

      influencerCurrent.collaborations += 1;
      influencerCurrent.budget += budget;
      influencerCurrent.totalReach += toNumber(item?.totalReach || item?.reach || item?.followers);

      const engagement = toNumber(item?.avgEngagement || item?.engagementRate || item?.engagement);
      if (engagement > 0) {
        influencerCurrent.avgEngagementRaw += engagement;
        influencerCurrent.engagementSamples += 1;
      }

      performerMap.set(influencerName, influencerCurrent);

      const campaignName = String(item?.campaignName || 'Untitled campaign');
      const campaignCurrent = campaignMap.get(campaignName) || {
        campaignName,
        collaborations: 0,
        budget: 0,
        hasLive: false,
        hasWaiting: false,
        hasCompleted: false,
        hasCanceled: false,
        completionTotal: 0,
      };

      campaignCurrent.collaborations += 1;
      campaignCurrent.budget += budget;
      campaignCurrent.hasLive ||= status === 'live';
      campaignCurrent.hasWaiting ||= status === 'waiting';
      campaignCurrent.hasCompleted ||= status === 'completed';
      campaignCurrent.hasCanceled ||= status === 'canceled';

      const fallbackProgress =
        status === 'completed' ? 100 :
        status === 'canceled' ? 0 :
        status === 'live' ? 55 : 20;
      campaignCurrent.completionTotal += toNumber(item?.progress) || fallbackProgress;

      campaignMap.set(campaignName, campaignCurrent);

      const refDate = parseReferenceDate(item);
      if (refDate) {
        const key = monthLabel(refDate);
        const monthCurrent = monthMap.get(key) || { month: key, collaborations: 0, budget: 0 };
        monthCurrent.collaborations += 1;
        monthCurrent.budget += budget;
        monthMap.set(key, monthCurrent);
      }
    });

    const topPerformers = Array.from(performerMap.values())
      .map((value) => ({
        influencerName: value.influencerName,
        collaborations: value.collaborations,
        avgEngagement: value.engagementSamples ? value.avgEngagementRaw / value.engagementSamples : 0,
        totalReach: value.totalReach,
        budget: value.budget,
      }))
      .sort((a, b) => b.budget - a.budget)
      .slice(0, 3);

    const byCampaign = Array.from(campaignMap.values())
      .map((value) => {
        const status = value.hasLive
          ? 'live'
          : value.hasWaiting
            ? 'waiting'
            : value.hasCompleted
              ? 'completed'
              : value.hasCanceled
                ? 'canceled'
                : 'waiting';

        return {
          campaignName: value.campaignName,
          collaborations: value.collaborations,
          budget: value.budget,
          status,
          completionRate: Math.round(value.completionTotal / Math.max(1, value.collaborations)),
        };
      })
      .sort((a, b) => b.budget - a.budget)
      .slice(0, 6);

    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrends = Array.from(monthMap.values()).sort(
      (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    );

    const successfulCount = byStatus.completed;
    const closedCount = byStatus.completed + byStatus.canceled;

    return {
      overview: {
        totalCollaborations,
        activeCollaborations: byStatus.live + byStatus.waiting,
        completedCollaborations: byStatus.completed,
        totalBudgetSpent,
        avgCollaborationDuration: durationCount ? Math.round(durationSum / durationCount) : 0,
        successRate: closedCount ? Math.round((successfulCount / closedCount) * 100) : 0,
      },
      byStatus,
      topPerformers,
      byCampaign,
      monthlyTrends,
    };
  }, [filteredItems]);

  const statusColors = {
    waiting: 'from-amber-400 to-amber-600',
    live: 'from-indigo-400 to-indigo-600',
    completed: 'from-green-400 to-green-600',
    canceled: 'from-red-400 to-red-600',
  };

  const maxMonthlyBudget = Math.max(1, ...analyticsData.monthlyTrends.map((x) => x.budget));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-[#C1B6FD]" />
            Collaboration Analytics
          </h3>
          <p className="text-[#9CA3AF] text-sm sm:text-base mt-1">Performance metrics and insights</p>
        </div>
        <select
          value={timeRange}
          onChange={(event) => setTimeRange(event.target.value)}
          className="px-5 py-3 bg-[#1A112C]/65 border border-[#745CB4]/25 rounded-xl text-white focus:outline-none focus:border-[#C1B6FD]/45 transition-all"
        >
          <option value="all">All Time</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="365">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-linear-to-br from-[#745CB4]/20 to-[#745CB4]/5 backdrop-blur-md border border-[#745CB4]/30 rounded-xl p-4">
          <p className="text-[#9CA3AF] text-sm mb-1">Total</p>
          <p className="text-2xl font-bold text-[#C1B6FD]">{analyticsData.overview.totalCollaborations}</p>
          <p className="text-xs text-[#9CA3AF] mt-1">Collaborations</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <p className="text-[#9CA3AF] text-sm mb-1">Active</p>
          <p className="text-2xl font-bold text-green-300">{analyticsData.overview.activeCollaborations}</p>
          <p className="text-xs text-[#9CA3AF] mt-1">Right now</p>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
          <p className="text-[#9CA3AF] text-sm mb-1">Completed</p>
          <p className="text-2xl font-bold text-indigo-300">{analyticsData.overview.completedCollaborations}</p>
          <p className="text-xs text-[#9CA3AF] mt-1">Finished</p>
        </div>
        <div className="bg-[#1A112C]/65 border border-[#745CB4]/25 rounded-xl p-4">
          <p className="text-[#9CA3AF] text-sm mb-1">Budget</p>
          <p className="text-2xl font-bold text-white">${(analyticsData.overview.totalBudgetSpent / 1000).toFixed(0)}K</p>
          <p className="text-xs text-[#9CA3AF] mt-1">Total spent</p>
        </div>
        <div className="bg-[#1A112C]/65 border border-[#745CB4]/25 rounded-xl p-4">
          <p className="text-[#9CA3AF] text-sm mb-1">Avg Duration</p>
          <p className="text-2xl font-bold text-white">{analyticsData.overview.avgCollaborationDuration}</p>
          <p className="text-xs text-[#9CA3AF] mt-1">Days</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
          <p className="text-[#9CA3AF] text-sm mb-1">Success</p>
          <p className="text-2xl font-bold text-purple-300">{analyticsData.overview.successRate}%</p>
          <p className="text-xs text-[#9CA3AF] mt-1">Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1A112C]/65 backdrop-blur-md border border-[#745CB4]/25 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-4">Status Distribution</h4>
          <div className="space-y-3">
            {Object.entries(analyticsData.byStatus).map(([status, count]) => {
              const total = Object.values(analyticsData.byStatus).reduce((acc, value) => acc + value, 0) || 1;
              const percentage = (count / total) * 100;

              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#9CA3AF] capitalize">{toTitle(status)}</span>
                    <span className="text-sm font-semibold text-white">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-[#745CB4]/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-linear-to-r ${statusColors[status] || statusColors.waiting} rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#1A112C]/65 backdrop-blur-md border border-[#745CB4]/25 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-4">Monthly Trends</h4>
          <div className="space-y-4">
            {analyticsData.monthlyTrends.length === 0 ? (
              <p className="text-sm text-[#9CA3AF]">No trend data available for this range.</p>
            ) : (
              analyticsData.monthlyTrends.map((month) => (
                <div key={month.month} className="flex items-center gap-4">
                  <div className="w-12 text-[#9CA3AF] text-sm font-semibold">{month.month}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#9CA3AF]">{month.collaborations} collaborations</span>
                      <span className="text-xs font-semibold text-white">${(month.budget / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="h-2 bg-[#745CB4]/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-full"
                        style={{ width: `${(month.budget / maxMonthlyBudget) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#1A112C]/65 backdrop-blur-md border border-[#745CB4]/25 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-yellow-300" />
          <h4 className="text-lg font-bold text-white">Top Performing Influencers</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analyticsData.topPerformers.length === 0 ? (
            <p className="text-sm text-[#9CA3AF]">No performer data available.</p>
          ) : (
            analyticsData.topPerformers.map((influencer, index) => (
              <div
                key={influencer.influencerName}
                className="bg-[#241A3A]/55 border border-[#745CB4]/25 rounded-xl p-5 hover:bg-[#241A3A]/70 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-white mb-1">{influencer.influencerName}</h5>
                    <p className="text-xs text-[#9CA3AF]">{influencer.collaborations} collaborations</p>
                  </div>
                  {index === 0 ? (
                    <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-yellow-300" />
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#9CA3AF]">Engagement</span>
                    <span className="font-semibold text-green-300">{influencer.avgEngagement.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#9CA3AF]">Reach</span>
                    <span className="font-semibold text-white">{(influencer.totalReach / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#9CA3AF]">Budget</span>
                    <span className="font-semibold text-white">${influencer.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-[#1A112C]/65 backdrop-blur-md border border-[#745CB4]/25 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#745CB4]/20">
          <h4 className="text-lg font-bold text-white inline-flex items-center gap-2">
            <Target className="w-5 h-5 text-[#C1B6FD]" />
            Performance by Campaign
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#745CB4]/20">
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#9CA3AF]">Campaign</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#9CA3AF]">Collaborations</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#9CA3AF]">Budget</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#9CA3AF]">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#9CA3AF]">Completion</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.byCampaign.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 px-6 text-sm text-[#9CA3AF] text-center">
                    No campaign performance data available.
                  </td>
                </tr>
              ) : (
                analyticsData.byCampaign.map((campaign, index) => (
                  <tr
                    key={campaign.campaignName}
                    className={`border-b border-[#745CB4]/15 hover:bg-[#241A3A]/30 transition-colors ${
                      index === analyticsData.byCampaign.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <p className="font-semibold text-white">{campaign.campaignName}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-[#9CA3AF]" />
                        <span className="text-white">{campaign.collaborations}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-[#9CA3AF]" />
                        <span className="font-semibold text-white">${campaign.budget.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                          campaign.status === 'completed'
                            ? 'bg-green-500/20 text-green-300 border-green-500/30'
                            : campaign.status === 'canceled'
                              ? 'bg-red-500/20 text-red-300 border-red-500/30'
                              : campaign.status === 'live'
                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                        }`}
                      >
                        {toTitle(campaign.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#745CB4]/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-green-400 to-green-600 rounded-full"
                            style={{ width: `${campaign.completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-white w-12">{campaign.completionRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
