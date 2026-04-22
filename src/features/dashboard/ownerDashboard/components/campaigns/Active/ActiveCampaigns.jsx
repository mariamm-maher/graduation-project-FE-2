import { Search, Filter, Calendar, CheckCircle, FileText, AlertCircle, MoreVertical, Clock, ChevronLeft, ChevronRight, DollarSign, Target, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCampaignStore from '../../../../../../stores/campaignStore';

const LIMIT = 10;

function ActiveCampaigns() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { activeCampaigns: campaignsRaw, activeTrackingTools, activePagination, isLoading, error, fetchActiveCampaigns } = useCampaignStore();
  const campaigns = Array.isArray(campaignsRaw) ? campaignsRaw : [];
  const totalPages = activePagination?.totalPages || 1;
  const totalItems = activePagination?.total || activeTrackingTools?.totalActiveCampaigns || 0;
  useEffect(() => {
    fetchActiveCampaigns({ page, limit: LIMIT });
  }, [page, fetchActiveCampaigns]);

  console.log("Active campaigns:", campaigns);
  // Client-side search filter only
  const activeCampaigns = campaigns.filter(campaign =>
    searchQuery === '' || campaign.campaignName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Active Campaigns</h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Campaigns currently running and operational ({totalItems})
          </p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/owner/campaigns/create')}
          className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
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

      {/* Campaigns List – Card-based execution view */}
      <div className="space-y-5">
        {/* Loading */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C1B6FD] mx-auto mb-4" />
            <p className="text-gray-400">Loading active campaigns...</p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Error Loading Campaigns</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <button onClick={() => fetchActiveCampaigns({ page, limit: LIMIT })}
              className="px-6 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && activeCampaigns.length === 0 && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Active Campaigns</h3>
            <p className="text-gray-400 mb-6">You don't have any running campaigns at the moment</p>
            <button 
              onClick={() => navigate('/dashboard/owner/campaigns/create')}
              className="px-6 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
              Create Your First Campaign
            </button>
          </div>
        )}

        {/* Campaign Cards */}
        {!isLoading && !error && activeCampaigns.length > 0 && (
          activeCampaigns.map((campaign) => {
            const dur = campaign.tracking?.duration || {};
            const kpi = campaign.tracking?.kpis || {};
            const cnt = campaign.tracking?.content || {};
            const platforms = campaign.targetAudience?.platformsUsed || [];

            const timeProgress = dur.progressPercent ?? 0;
            const elapsed = dur.elapsedDurationDays ?? 0;
            const totalDays = dur.totalDurationDays ?? 0;
            const remaining = dur.remainingDurationDays ?? 0;
            const posted   = cnt.postedContentCount ?? 0;
            const scheduled = cnt.scheduledContentCount ?? 0;
            const failed   = cnt.failedContentCount ?? 0;
            const totalContent = cnt.totalItems ?? 0;
            const postedPct  = totalContent > 0 ? Math.round((posted    / totalContent) * 100) : 0;
            const schedPct   = totalContent > 0 ? Math.round((scheduled / totalContent) * 100) : 0;
            const failedPct  = totalContent > 0 ? Math.round((failed    / totalContent) * 100) : 0;

            return (
              <div
                key={campaign.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#C1B6FD]/30 transition-all duration-300"
              >
                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3
                        onClick={() => navigate(`/dashboard/owner/campaigns/${campaign.id}`)}
                        className="text-lg font-bold text-white cursor-pointer hover:text-[#C1B6FD] transition-colors truncate"
                      >
                        {campaign.campaignName}
                      </h3>
                      <span className="px-2.5 py-0.5 bg-green-500/20 text-green-400 rounded-full text-[11px] font-bold whitespace-nowrap animate-pulse">
                        ● Active
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(campaign.startDate).toLocaleDateString()} – {new Date(campaign.endDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        {remaining} days left
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3.5 h-3.5 text-[#C1B6FD]" />
                        {campaign.campaign_goal}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <DollarSign className="w-3.5 h-3.5" />
                        {campaign.budget_currency} {Number(campaign.budget_amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/dashboard/owner/campaigns/${campaign.id}`)}
                    className="w-9 h-9 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all shrink-0"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* ── Timeline bar ── */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="text-gray-400">Timeline — Day {elapsed} of {totalDays}</span>
                    <span className="font-bold text-white">{timeProgress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-blue-400 to-[#C1B6FD] rounded-full transition-all duration-700"
                      style={{ width: `${timeProgress}%` }}
                    />
                  </div>
                </div>

                {/* ── 4-stat row ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-[11px] text-gray-400 mb-1 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-[#C1B6FD]" /> KPIs Tracked
                    </p>
                    <p className="text-2xl font-bold text-white">{kpi.totalKpis ?? 0}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">{(kpi.metrics || []).join(', ') || '—'}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-[11px] text-gray-400 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Days Elapsed
                    </p>
                    <p className="text-2xl font-bold text-amber-400">{elapsed}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{remaining} remaining</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-[11px] text-gray-400 mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" /> Posted
                    </p>
                    <p className="text-2xl font-bold text-green-400">{posted}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">of {totalContent} items</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-[11px] text-gray-400 mb-1 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-purple-400" /> Scheduled
                    </p>
                    <p className="text-2xl font-bold text-purple-400">{scheduled}</p>
                    <p className={`text-[11px] mt-0.5 ${failed > 0 ? 'text-red-400' : 'text-gray-500'}`}>{failed} failed</p>
                  </div>
                </div>

                {/* ── Content breakdown bar ── */}
                {totalContent > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1.5">
                      <span>Content Breakdown</span>
                      <span>{totalContent} total items</span>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden bg-white/10">
                      {posted    > 0 && <div className="bg-green-400"  style={{ width: `${postedPct}%`  }} />}
                      {scheduled > 0 && <div className="bg-purple-400" style={{ width: `${schedPct}%`  }} />}
                      {failed    > 0 && <div className="bg-red-400"    style={{ width: `${failedPct}%` }} />}
                    </div>
                    <div className="flex gap-4 mt-1 text-[11px]">
                      <span className="text-green-400">{posted} posted</span>
                      <span className="text-purple-400">{scheduled} scheduled</span>
                      {failed > 0 && <span className="text-red-400">{failed} failed</span>}
                    </div>
                  </div>
                )}

                {/* ── KPI metric tags ── */}
                {(kpi.metrics || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {kpi.metrics.map(m => (
                      <span key={m} className="px-2.5 py-0.5 bg-[#745CB4]/20 border border-[#C1B6FD]/20 rounded-full text-[11px] font-semibold text-[#C1B6FD] uppercase tracking-wide">
                        {m}
                      </span>
                    ))}
                  </div>
                )}

                {/* ── Platform badges + action ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5">
                  <div className="flex flex-wrap gap-1.5">
                    {platforms.map(p => (
                      <span key={p} className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-[11px] text-gray-300">
                        {p}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate(`/dashboard/owner/campaigns/${campaign.id}`)}
                    className="px-4 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 shrink-0"
                  >
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-gray-400">
            Page <span className="text-white font-semibold">{page}</span> of{' '}
            <span className="text-white font-semibold">{totalPages}</span>
            <span className="ml-2 text-gray-500">({totalItems} total)</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:border-[#C1B6FD]/40 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === '...' ? (
                    <span key={`e-${i}`} className="px-2 text-gray-500 text-sm">…</span>
                  ) : (
                    <button key={item} onClick={() => setPage(item)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${item === page ? 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-md' : 'text-gray-400 bg-white/5 border border-white/10 hover:border-[#C1B6FD]/40 hover:text-white'}`}>
                      {item}
                    </button>
                  )
                )}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:border-[#C1B6FD]/40 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveCampaigns;