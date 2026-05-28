import { Target, Clock, CheckCircle, DollarSign, Calendar, FileText, Layers } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCampaignStore from '../../../../../stores/campaignStore';

const PLATFORM_COLORS = {
  instagram: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  tiktok:    'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  youtube:   'bg-red-500/20 text-red-400 border-red-500/30',
  twitter:   'bg-sky-500/20 text-sky-400 border-sky-500/30',
  facebook:  'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const STATUS_COLORS = {
  posted:    'bg-green-500/20 text-green-400',
  scheduled: 'bg-amber-500/20 text-amber-400',
  failed:    'bg-red-500/20 text-red-400',
};

function resolveCampaignId(campaign = {}) {
  return campaign?.id || campaign?.campaignId || campaign?._id || null;
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ActiveCampaignCards() {
  const navigate = useNavigate();
  const {
    activeCampaigns: campaignsRaw,
    activeTrackingTools,
    isLoading: loading,
    fetchActiveCampaignsWithTracking,
    fetchActiveCampaigns,
  } = useCampaignStore();

  const campaigns = Array.isArray(campaignsRaw) ? campaignsRaw : [];
  const runningCount = activeTrackingTools?.totalActiveCampaigns ?? campaigns.length;

  useEffect(() => {
    const load = async () => {
      const res = await fetchActiveCampaignsWithTracking({ page: 1, limit: 6 });
      const list = Array.isArray(res?.data) ? res.data : [];
      if (!res?.success || list.length === 0) {
        await fetchActiveCampaigns({ page: 1, limit: 6 });
      }
    };
    load();
  }, [fetchActiveCampaignsWithTracking, fetchActiveCampaigns]);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Active Campaigns</h2>
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
          {runningCount} Running
        </span>
      </div>

      {loading && (
        <div className="text-xs text-gray-400 mb-4">Loading active campaigns...</div>
      )}

      {!loading && campaigns.length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-gray-300">
          No active campaigns right now.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {campaigns.map((campaign) => {
          const dur     = campaign.tracking?.duration || {};
          const content = campaign.tracking?.content  || {};
          const kpis    = Array.isArray(campaign.kpis) ? campaign.kpis : [];
          const calendar = Array.isArray(campaign.contentCalendar) ? campaign.contentCalendar : [];

          const progress   = dur.progressPercent ?? 0;
          const elapsed    = dur.elapsedDurationDays ?? 0;
          const remaining  = dur.remainingDurationDays ?? 0;
          const totalDays  = dur.totalDurationDays ?? 0;

          const posted    = content.postedContentCount ?? 0;
          const scheduled = content.scheduledContentCount ?? 0;
          const failed    = content.failedContentCount ?? 0;
          const total     = content.totalItems ?? 0;

          // Today's calendar items
          const todayItems = calendar.filter(item => {
            if (!item.date) return false;
            return item.date.split('T')[0] === todayStr;
          });

          return (
            <div
              key={campaign.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#C1B6FD]/30 transition-all duration-300 flex flex-col gap-4"
            >
              {/* ── Campaign Name & Goal ── */}
              <div>
                <button
                  type="button"
                  onClick={() => { const id = resolveCampaignId(campaign); if (id) navigate(`/dashboard/owner/campaigns/${id}`); }}
                  className="font-bold text-white text-base truncate block hover:text-[#C1B6FD] transition-colors text-left w-full"
                  title={campaign.campaignName}
                >
                  {campaign.campaignName}
                </button>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-gray-400 capitalize">{campaign.campaign_goal || '—'}</span>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-[11px] font-semibold animate-pulse">● Active</span>
                </div>
              </div>

              {/* ── Campaign Dates & Budget ── */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                  <p className="text-gray-500 flex items-center gap-1 mb-1"><Calendar className="w-3 h-3" /> Start</p>
                  <p className="text-white font-semibold">{formatDate(campaign.startDate)}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                  <p className="text-gray-500 flex items-center gap-1 mb-1"><Calendar className="w-3 h-3" /> End</p>
                  <p className="text-white font-semibold">{formatDate(campaign.endDate)}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                  <p className="text-gray-500 flex items-center gap-1 mb-1"><DollarSign className="w-3 h-3" /> Budget</p>
                  <p className="text-white font-semibold">
                    {campaign.budget_currency || '$'}{Number(campaign.budget_amount || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                  <p className="text-gray-500 flex items-center gap-1 mb-1"><Clock className="w-3 h-3" /> Remaining</p>
                  <p className={`font-semibold ${remaining <= 3 ? 'text-amber-400' : 'text-white'}`}>{remaining}d left</p>
                </div>
              </div>

              {/* ── Timeline Progress ── */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-400">Day {elapsed} of {totalDays}</span>
                  <span className="text-white font-semibold">{progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* ── Content Calendar Summary ── */}
              {total > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Content Calendar
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-green-400"><CheckCircle className="w-3 h-3" /> {posted} posted</span>
                    <span className="flex items-center gap-1 text-amber-400"><Clock className="w-3 h-3" /> {scheduled} scheduled</span>
                    {failed > 0 && <span className="text-red-400">{failed} failed</span>}
                    <span className="text-gray-500 ml-auto">{total} total</span>
                  </div>
                </div>
              )}

              {/* ── Today's Schedule ── */}
              <div>
                <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#C1B6FD]" />
                  <span className="font-semibold text-[#C1B6FD]">Today</span>
                  <span className="text-gray-500">— {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </p>
                {todayItems.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">Nothing scheduled for today</p>
                ) : (
                  <div className="space-y-1.5">
                    {todayItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-xs bg-white/5 rounded-lg px-2.5 py-1.5 border border-white/5">
                        <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold capitalize ${PLATFORM_COLORS[item.platform?.toLowerCase()] || 'bg-white/10 text-gray-400 border-white/20'}`}>
                          {item.platform || '—'}
                        </span>
                        <span className="text-gray-300 flex-1 truncate capitalize">{item.contentType || item.task || '—'}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold capitalize ${STATUS_COLORS[item.status] || 'bg-white/10 text-gray-400'}`}>
                          {item.status || '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── KPI Targets ── */}
              {kpis.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                    <Layers className="w-3 h-3" /> KPI Targets
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {kpis.map((kpi) => (
                      <span key={kpi.id} className="px-2 py-0.5 bg-[#745CB4]/20 border border-[#745CB4]/30 text-[#C1B6FD] rounded text-[11px] capitalize">
                        {kpi.metric}{kpi.targetValue ? `: ${Number(kpi.targetValue).toLocaleString()}` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ActiveCampaignCards;
