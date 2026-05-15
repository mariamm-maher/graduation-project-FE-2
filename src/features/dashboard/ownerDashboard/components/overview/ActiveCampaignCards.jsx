import { TrendingUp, Users, MessageCircle, Target, BarChart3, Clock, CheckCircle, Zap, DollarSign, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCampaignStore from '../../../../../stores/campaignStore';

function formatCompact(value = 0) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return `${value}`;
}

function resolveCampaignId(campaign = {}) {
  return campaign?.id || campaign?.campaignId || campaign?._id || null;
}

function ActiveCampaignCards() {
  const navigate = useNavigate();
  const { 
    activeCampaigns: campaignsRaw, 
    activeTrackingTools, 
    isLoading: loading, 
    fetchActiveCampaignsWithTracking 
  } = useCampaignStore();
  
  const campaigns = Array.isArray(campaignsRaw) ? campaignsRaw : [];
  const runningCount = activeTrackingTools?.totalActiveCampaigns ?? campaigns.length;

  // Fetch campaigns on mount - same as ActiveCampaigns
  useEffect(() => {
    fetchActiveCampaignsWithTracking({ page: 1, limit: 6 });
  }, [fetchActiveCampaignsWithTracking]);

  const openCampaign = (campaign) => {
    const campaignId = resolveCampaignId(campaign);
    if (!campaignId) return;
    navigate(`/dashboard/owner/campaigns/${campaignId}`);
  };

  // Helper to get tracking data from campaign
  const getTracking = (campaign) => campaign.tracking || {};

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Active Campaigns</h2>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            {runningCount} Running
          </span>
       
        </div>
      </div>

      {loading && (
        <div className="text-xs text-gray-400 mb-4">Loading active campaigns...</div>
      )}

      {!loading && campaigns.length === 0 && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-sm text-gray-300">
          No active campaigns available right now.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {campaigns.map((campaign) => {
          const tracking = getTracking(campaign);
          const kpisData = tracking.kpis || {};
          const contentData = tracking.content || {};
          const budgetData = tracking.budget || {};
          const predictions = tracking.predictions || {};
          const performance = tracking.performance || {};

          // Determine status colors
          const kpiAchievement = kpisData.overallAchievement || 0;
          const kpiColor = kpiAchievement >= 80 ? 'text-green-400' : kpiAchievement >= 60 ? 'text-amber-400' : 'text-red-400';
          const kpiBg = kpiAchievement >= 80 ? 'bg-green-500/20' : kpiAchievement >= 60 ? 'bg-amber-500/20' : 'bg-red-500/20';

          const burnRate = budgetData.burnRate || 0;
          const budgetColor = burnRate > 100 ? 'text-red-400' : burnRate > 80 ? 'text-amber-400' : 'text-green-400';

          return (
            <div 
              key={campaign.id} 
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center text-2xl shadow-lg">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => openCampaign(campaign)}
                    disabled={!resolveCampaignId(campaign)}
                    className="w-full font-bold text-white mb-1 truncate block group-hover:text-[#C1B6FD] transition-colors hover:underline disabled:opacity-70 disabled:cursor-not-allowed text-left"
                    title={campaign.name || campaign.campaignName}
                  >
                    {campaign.name || campaign.campaignName}
                  </button>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-400">{campaign.brand || campaign.campaign_goal}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      campaign.status === 'active'
                        ? 'bg-green-500/20 text-green-400 animate-pulse' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {campaign.status}
                    </span>
                    {/* KPI Achievement Badge */}
                    {kpiAchievement > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${kpiBg} ${kpiColor}`}>
                        {kpiAchievement}% KPI
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Engagement Metric */}
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center gap-1 text-[#C1B6FD] mb-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-xs text-gray-400">Engagement</span>
                  </div>
                  <span className="text-lg font-bold text-white">
                    {performance.totalLikes !== undefined 
                      ? formatCompact(performance.totalLikes)
                      : (campaign.engagement ?? 0).toLocaleString()
                    }
                  </span>
                  {performance.engagementRate !== undefined && (
                    <p className="text-xs text-gray-500 mt-0.5">{performance.engagementRate}% rate</p>
                  )}
                </div>

                {/* Reach Metric */}
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center gap-1 text-[#C1B6FD] mb-1">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span className="text-xs text-gray-400">Reach</span>
                  </div>
                  <span className="text-lg font-bold text-white">
                    {performance.totalReach !== undefined
                      ? formatCompact(performance.totalReach)
                      : formatCompact(campaign.reach ?? 0)
                    }
                  </span>
                  {performance.postsWithData > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">{performance.postsWithData} posts</p>
                  )}
                </div>

                {/* Content Progress */}
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center gap-1 text-[#C1B6FD] mb-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span className="text-xs text-gray-400">Content</span>
                  </div>
                  <span className={`text-lg font-bold ${contentData.completionRate >= 90 ? 'text-green-400' : contentData.completionRate >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                    {contentData.completionRate ?? campaign.progress ?? 0}%
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {contentData.posted ?? 0}/{contentData.total ?? campaign.progress ?? 0} posted
                  </p>
                </div>

                {/* Budget Burn */}
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center gap-1 text-[#C1B6FD] mb-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span className="text-xs text-gray-400">Budget</span>
                  </div>
                  <span className={`text-lg font-bold ${budgetColor}`}>
                    {burnRate > 0 ? `${burnRate.toFixed(0)}%` : 'N/A'}
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {budgetData.status || 'On Track'}
                  </p>
                </div>
              </div>

              {/* Campaign Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-400">Campaign Progress</span>
                  <span className="text-white font-semibold">{tracking.timeline?.elapsedDays || 0} / {tracking.timeline?.totalDuration || campaign.daysLeft || 0} days</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-full transition-all duration-500"
                    style={{ width: `${campaign.progress ?? tracking.timeline?.progress ?? 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Predictions Section */}
              {predictions.daysToCompletion !== undefined && (
                <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-semibold text-purple-400">AI Prediction</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Est. Completion:</span>
                    <span className="text-white font-semibold">{predictions.predictedEndDate || 'Calculating...'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-400">Days Remaining:</span>
                    <span className={`font-semibold ${predictions.daysToCompletion < 0 ? 'text-amber-400' : 'text-green-400'}`}>
                      {predictions.daysToCompletion < 0 
                        ? `${Math.abs(predictions.daysToCompletion)} days over` 
                        : `${predictions.daysToCompletion} days left`
                      }
                    </span>
                  </div>
                  {predictions.daysToCompletion < 0 && (
                    <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Campaign may exceed planned end date
                    </p>
                  )}
                </div>
              )}

              {/* KPI Comparison Summary */}
              {kpisData.comparison && kpisData.comparison.length > 0 && (
                <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-[#C1B6FD]" />
                    <span className="text-xs font-semibold text-gray-300">Top KPIs</span>
                  </div>
                  <div className="space-y-1">
                    {kpisData.comparison.slice(0, 3).map((kpi, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{kpi.metric}</span>
                        <span className={kpi.achievement >= 100 ? 'text-green-400' : kpi.achievement >= 50 ? 'text-amber-400' : 'text-red-400'}>
                          {kpi.achievement.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Team & Time Info */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C1B6FD]" />
                  <span className="text-sm text-gray-300">{campaign.leadInfluencer || 'No lead assigned'}</span>
                  <span className="bg-[#745CB4]/30 rounded-full px-2 py-0.5 text-xs font-semibold text-white">
                    +{campaign.influencersCount ?? 0}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-400">{campaign.daysLeft ?? tracking.timeline?.remainingDays ?? 0} days left</span>
                </div>
              </div>

              {/* Budget Display */}
              <div className="mb-4 text-xs text-gray-400">
                Budget: <span className="text-[#C1B6FD] font-semibold">${(campaign.budget ?? campaign.totalBudget ?? 0).toLocaleString()}</span>
                {budgetData.spent !== undefined && (
                  <span className="text-gray-500 ml-1">(${budgetData.spent.toLocaleString()} spent)</span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{campaign.id}</span>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ActiveCampaignCards;
