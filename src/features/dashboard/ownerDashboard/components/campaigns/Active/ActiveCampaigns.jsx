import { Search, Filter, Calendar, Users, CheckCircle, FileText, AlertCircle, MoreVertical, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCampaignStore from '../../../../../../stores/campaignStore';

const LIMIT = 10;

function ActiveCampaigns() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { campaigns: campaignsRaw, activeTrackingTools, pagination, isLoading, error, fetchActiveCampaigns } = useCampaignStore();
  const campaigns = Array.isArray(campaignsRaw) ? campaignsRaw : [];
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || activeTrackingTools?.totalActiveCampaigns || 0;

  useEffect(() => {
    fetchActiveCampaigns({ page, limit: LIMIT });
  }, [page, fetchActiveCampaigns]);

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
            const durationTracking = campaign.tracking?.duration || {};
            const kpisTracking = campaign.tracking?.kpis || {};
            const contentTracking = campaign.tracking?.content || {};

            const timeProgress = durationTracking.progressPercent ?? 0;
            const daysRemaining = durationTracking.remainingDurationDays ?? 0;
            const totalTasks = kpisTracking.totalKpis ?? 0;
            const completedTasks = Math.max(0, durationTracking.elapsedDurationDays ?? 0);
            const taskProgress = totalTasks > 0 ? Math.min(100, Math.round((completedTasks / totalTasks) * 100)) : 0;
            const scheduledContent = contentTracking.scheduledContentCount ?? 0;
            const postedContent = contentTracking.postedContentCount ?? 0;
            const failedContent = contentTracking.failedContentCount ?? 0;
            const totalContent = contentTracking.totalItems ?? 0;

            return (
              <div
                key={campaign.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                {/* Top Section */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 
                        onClick={() => navigate(`/dashboard/owner/campaigns/${campaign.id}`)}
                        className="text-xl font-bold text-white cursor-pointer hover:text-[#C1B6FD] transition-colors"
                      >
                        {campaign.campaignName || campaign.name}
                      </h3>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold whitespace-nowrap animate-pulse">
                        ● Active
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-amber-400">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span className="font-semibold">{daysRemaining} days remaining</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Time Progress Bar */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Campaign Timeline</span>
                    <span className="text-sm font-semibold text-white">{timeProgress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-700"
                      style={{ width: `${timeProgress}%` }}
                    />
                  </div>
                </div>

                {/* Execution Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                  {/* Active Influencers */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <p className="text-xs text-gray-400">Total KPIs</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{totalTasks}</p>
                    <p className="text-xs text-gray-400 mt-1">Tracked KPI metrics</p>
                  </div>

                  {/* Tasks Progress */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <p className="text-xs text-gray-400">Duration Progress</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{durationTracking.elapsedDurationDays ?? 0}/{durationTracking.totalDurationDays ?? 0}</p>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-green-400 to-green-600 rounded-full"
                        style={{ width: `${taskProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Content Scheduled */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <p className="text-xs text-gray-400">Content Scheduled</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-400">{scheduledContent}</p>
                    <p className="text-xs text-gray-400 mt-1">{postedContent} posted</p>
                  </div>

                  {/* Content Status */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <p className="text-xs text-gray-400">Content Status</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-400 font-semibold">{postedContent}</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-purple-400 font-semibold">{scheduledContent}</span>
                      {failedContent > 0 && (
                        <>
                          <span className="text-gray-500">|</span>
                          <span className="text-red-400 font-semibold">{failedContent}</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{totalContent} total items</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-3 items-center">
                  <div className="w-full sm:w-auto">
                    <button
                      onClick={() => navigate(`/dashboard/owner/campaigns/${campaign.id}`)}
                      className="w-full sm:w-auto px-5 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => navigate(`/dashboard/owner/campaigns/${campaign.id}/content`)}
                    className="px-4 py-3 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl text-white font-medium transition-all"
                  >
                    Content Calendar
                  </button>

                  <button
                    onClick={() => { /* placeholder for quick actions/menu */ }}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                    aria-label="More"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-300" />
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