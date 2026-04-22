import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Target, Layers, Cpu, CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react';
import { useEffect } from 'react';
import useCampaignStore from '../../../../../../stores/campaignStore';

function StatCard({ icon, label, value, sub, accent = 'text-white' }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-gray-400 text-xs">{icon}{label}</div>
      <p className={`text-2xl font-bold ${accent}`}>{value ?? '—'}</p>
      {sub && <p className="text-[11px] text-gray-500">{sub}</p>}
    </div>
  );
}

function BreakdownBar({ data, colorMap }) {
  const entries = Object.entries(data || {});
  const total = entries.reduce((s, [, v]) => s + v, 0);
  if (!total) return <p className="text-sm text-gray-500">No data</p>;
  return (
    <div>
      <div className="flex h-2.5 rounded-full overflow-hidden bg-white/10 mb-2">
        {entries.map(([k, v], i) => (
          <div
            key={k}
            style={{ width: `${Math.round((v / total) * 100)}%` }}
            className={colorMap?.[i] || 'bg-[#C1B6FD]'}
            title={`${k}: ${v}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {entries.map(([k, v], i) => (
          <span key={k} className="flex items-center gap-1 text-[11px] text-gray-300">
            <span className={`w-2 h-2 rounded-full inline-block ${colorMap?.[i] || 'bg-[#C1B6FD]'}`} />
            {k}: <span className="font-bold text-white">{v}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const BAR_COLORS = ['bg-[#745CB4]', 'bg-[#C1B6FD]', 'bg-blue-400', 'bg-emerald-400', 'bg-amber-400', 'bg-red-400', 'bg-purple-400'];

function CampaignAnalytics() {
  const { campaignAnalytics: analytics, isLoading, error, fetchCampaignAnalytics } = useCampaignStore();

  useEffect(() => {
    fetchCampaignAnalytics();
  }, [fetchCampaignAnalytics]);

  if (isLoading && !analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C1B6FD]" />
        <p className="text-gray-400 text-sm">Loading analytics...</p>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-gray-400 text-sm">{error}</p>
        <button
          onClick={fetchCampaignAnalytics}
          className="px-5 py-2.5 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl text-sm font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  const summary  = analytics?.summary  || {};
  const budget   = analytics?.budget   || {};
  const lifecycle= analytics?.lifecycle|| {};
  const goals    = analytics?.goals    || {};
  const duration = analytics?.duration || {};
  const kpis     = analytics?.kpis     || {};
  const content  = analytics?.content  || {};
  const ai       = analytics?.ai       || {};
  const timeline = analytics?.timeline || {};

  const monthEntries = Object.entries(timeline.campaignsByMonth || {});

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-[#C1B6FD]" />
            Campaign Analytics
          </h1>
          <p className="text-gray-400 text-sm mt-1">Real-time overview of all your campaigns</p>
        </div>
        <button
          onClick={fetchCampaignAnalytics}
          className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:border-[#C1B6FD]/40 hover:text-white transition-all"
        >
          ↻ Refresh
        </button>
      </div>

      {/* ── Summary ── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard icon={<Layers className="w-3.5 h-3.5" />}    label="Total"     value={summary.totalCampaigns}     accent="text-white" />
          <StatCard icon={<TrendingUp className="w-3.5 h-3.5" />} label="Active"    value={summary.activeCampaigns}    accent="text-green-400" />
          <StatCard icon={<CheckCircle className="w-3.5 h-3.5" />}label="Completed" value={summary.completedCampaigns}  accent="text-blue-400" />
          <StatCard icon={<AlertCircle className="w-3.5 h-3.5" />}label="Cancelled" value={summary.cancelledCampaigns}  accent="text-red-400" />
          <StatCard icon={<Users className="w-3.5 h-3.5" />}      label="Published" value={summary.publishedCampaigns}  accent="text-[#C1B6FD]" />
        </div>
      </div>

      {/* ── Budget ── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-emerald-400" /> Budget Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          <StatCard icon={<DollarSign className="w-3.5 h-3.5" />} label="Total Budget"   value={`$${Number(budget.totalBudget   || 0).toLocaleString()}`} accent="text-emerald-400" />
          <StatCard icon={<DollarSign className="w-3.5 h-3.5" />} label="Avg Budget"    value={`$${Number(budget.averageBudget || 0).toLocaleString()}`} accent="text-white" />
          <StatCard icon={<DollarSign className="w-3.5 h-3.5" />} label="Min Budget"    value={`$${Number(budget.minBudget    || 0).toLocaleString()}`} accent="text-gray-300" />
          <StatCard icon={<DollarSign className="w-3.5 h-3.5" />} label="Max Budget"    value={`$${Number(budget.maxBudget    || 0).toLocaleString()}`} accent="text-amber-400" />
        </div>
        {Object.keys(budget.byCurrency || {}).length > 0 && (
          <div>
            <p className="text-xs text-gray-400 mb-2">By Currency</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(budget.byCurrency).map(([currency, amount]) => (
                <span key={currency} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400 font-semibold">
                  {currency}: ${Number(amount).toLocaleString()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Lifecycle + Goals ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-[#C1B6FD]" /> Lifecycle
          </h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <StatCard icon={null} label="Publication Rate" value={`${lifecycle.publicationRatePercent ?? 0}%`} accent="text-[#C1B6FD]" />
            <StatCard icon={null} label="Completion Rate"  value={`${lifecycle.completionRatePercent ?? 0}%`}  accent="text-green-400" />
            <StatCard icon={null} label="Cancellation Rate" value={`${lifecycle.cancellationRatePercent ?? 0}%`} accent="text-red-400" />
          </div>
          <p className="text-xs text-gray-400 mb-2">By Stage</p>
          <BreakdownBar data={lifecycle.byStage} colorMap={BAR_COLORS} />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-amber-400" /> Goals
          </h2>
          {goals.topGoal && (
            <div className="mb-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-400 font-semibold inline-block">
              Top Goal: {goals.topGoal}
            </div>
          )}
          <p className="text-xs text-gray-400 mb-2">By Goal Type</p>
          <BreakdownBar data={goals.byGoal} colorMap={BAR_COLORS} />
        </div>
      </div>

      {/* ── Duration ── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-400" /> Duration
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <StatCard icon={null} label="Avg Weeks"  value={duration.averageWeeks}     accent="text-white" />
          <StatCard icon={null} label="Total Weeks" value={duration.totalWeeks}       accent="text-white" />
          <StatCard icon={null} label="Running"    value={duration.runningCampaigns}  accent="text-green-400" />
          <StatCard icon={null} label="Upcoming"   value={duration.upcomingCampaigns} accent="text-[#C1B6FD]" />
          <StatCard icon={null} label="Ended"      value={duration.endedCampaigns}    accent="text-gray-400" />
        </div>
      </div>

      {/* ── KPIs + Content ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#C1B6FD]" /> KPIs
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <StatCard icon={null} label="Total KPIs"      value={kpis.totalKpis}      accent="text-white" />
            <StatCard icon={null} label="Most Used Metric" value={kpis.mostUsedMetric} accent="text-[#C1B6FD]" />
          </div>
          <p className="text-xs text-gray-400 mb-2">By Metric</p>
          <BreakdownBar data={kpis.byMetric} colorMap={BAR_COLORS} />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-purple-400" /> Content
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <StatCard icon={null} label="Total Items"      value={content.totalItems}              accent="text-white" />
            <StatCard icon={null} label="Posting Complete" value={`${content.postingCompletionPercent ?? 0}%`} accent="text-green-400" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-1.5">By Status</p>
              <BreakdownBar data={content.byStatus} colorMap={['bg-green-400', 'bg-purple-400', 'bg-red-400']} />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1.5">By Platform</p>
              <BreakdownBar data={content.byPlatform} colorMap={BAR_COLORS} />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1.5">By Type</p>
              <BreakdownBar data={content.byType} colorMap={BAR_COLORS} />
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Adoption ── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Cpu className="w-5 h-5 text-[#C1B6FD]" /> AI Adoption
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <StatCard icon={null} label="Campaigns w/ AI"    value={ai.campaignsWithAIVersion}    accent="text-[#C1B6FD]" />
          <StatCard icon={null} label="Adoption Rate"      value={`${ai.aiAdoptionRatePercent ?? 0}%`} accent="text-[#C1B6FD]" />
          <StatCard icon={null} label="Total Versions"     value={ai.totalVersions}             accent="text-white" />
          <StatCard icon={null} label="Active Versions"    value={ai.activeVersions}            accent="text-green-400" />
          <StatCard icon={null} label="Avg Versions/Campaign" value={ai.averageVersionsPerCampaign} accent="text-gray-300" />
        </div>
        <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-full transition-all duration-700"
            style={{ width: `${ai.aiAdoptionRatePercent ?? 0}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{ai.aiAdoptionRatePercent ?? 0}% of campaigns use AI</p>
      </div>

      {/* ── Timeline ── */}
      {monthEntries.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-5">
            <Calendar className="w-5 h-5 text-blue-400" /> Campaigns by Month
          </h2>
          {(() => {
            const max = Math.max(...monthEntries.map(([, v]) => v), 1);
            return (
              <div className="flex items-end gap-2 h-28">
                {monthEntries.map(([month, count]) => (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                    <span className="text-[10px] text-white font-bold">{count}</span>
                    <div
                      className="w-full bg-linear-to-t from-[#745CB4] to-[#C1B6FD] rounded-t-md transition-all duration-700"
                      style={{ height: `${Math.round((count / max) * 80)}px` }}
                    />
                    <span className="text-[9px] text-gray-500 truncate w-full text-center">{month.slice(-5)}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default CampaignAnalytics;
