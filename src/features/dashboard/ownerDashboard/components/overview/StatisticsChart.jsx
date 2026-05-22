import {
  LayoutGrid, Radio, Trophy, Rocket, Gem,
  GitBranch, Crosshair, FolderOpen, DollarSign,
  ScanEye, Magnet, Wallet, Repeat, Flame
} from 'lucide-react';
import { useEffect } from 'react';
import useCampaignStore from '../../../../../stores/campaignStore';


export default function StatisticsChart({ loading: externalLoading }) {
  const { campaignAnalytics, isLoading, fetchCampaignAnalytics } = useCampaignStore();

  useEffect(() => {
    fetchCampaignAnalytics();
  }, [fetchCampaignAnalytics]);

  const data = campaignAnalytics;
  const loading = externalLoading || isLoading;

  const summary = data?.summary || {};
  const budget = data?.budget || {};
  const lifecycle = data?.lifecycle || {};
  const goals = data?.goals || {};
  const kpis = data?.kpis || {};
  const content = data?.content || {};

  const formatCurrency = (value) => {
    if (value == null || value === 0) return '-';
    const n = Number(value);
    if (Number.isNaN(n)) return value;
    if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
    return `$${n.toLocaleString()}`;
  };

  const stageConfig = {
    draft: { color: 'from-slate-400 to-slate-500', dot: 'bg-slate-400', glow: 'shadow-slate-400/20' },
    ai_generated: { color: 'from-blue-400 to-cyan-400', dot: 'bg-blue-400', glow: 'shadow-blue-400/20' },
    saved: { color: 'from-violet-400 to-purple-500', dot: 'bg-violet-400', glow: 'shadow-violet-400/20' },
    completed: { color: 'from-emerald-400 to-teal-400', dot: 'bg-emerald-400', glow: 'shadow-emerald-400/20' },
    cancelled: { color: 'from-rose-400 to-red-500', dot: 'bg-rose-400', glow: 'shadow-rose-400/20' }
  };

  const goalConfig = {
    Awareness: { color: 'from-sky-400 to-blue-500', Icon: ScanEye },
    Leads: { color: 'from-amber-400 to-orange-500', Icon: Magnet },
    Sales: { color: 'from-emerald-400 to-green-500', Icon: Wallet },
    Retention: { color: 'from-violet-400 to-purple-500', Icon: Repeat },
    'Re-engagement': { color: 'from-pink-400 to-rose-500', Icon: Flame }
  };

  const kpiCards = [
    { label: 'Total', value: summary.totalCampaigns ?? 0, color: 'text-white', icon: <LayoutGrid className="w-3.5 h-3.5" />, iconBg: 'bg-white/10 text-white' },
    { label: 'Active', value: summary.activeCampaigns ?? 0, color: 'text-emerald-400', icon: <Radio className="w-3.5 h-3.5" />, iconBg: 'bg-emerald-500/15 text-emerald-400' },
    { label: 'Completed', value: summary.completedCampaigns ?? 0, color: 'text-blue-400', icon: <Trophy className="w-3.5 h-3.5" />, iconBg: 'bg-blue-500/15 text-blue-400' },
    { label: 'Published', value: summary.publishedCampaigns ?? 0, color: 'text-purple-400', icon: <Rocket className="w-3.5 h-3.5" />, iconBg: 'bg-purple-500/15 text-purple-400' },
    { label: 'Budget', value: formatCurrency(budget.totalBudget), color: 'text-amber-300', icon: <Gem className="w-3.5 h-3.5" />, iconBg: 'bg-amber-500/15 text-amber-400' },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="relative">
        <div className="absolute -top-2 -left-2 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#C1B6FD] via-[#a78bfa] to-[#745CB4] bg-clip-text text-transparent">
              Campaign overview
            </h2>
          </div>
          <p className="text-sm text-gray-400/80 ml-11">Real-time insights across lifecycle, budget, goals & content.</p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="group relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-2xl p-4 border border-white/[0.06] hover:border-purple-400/20 transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className={`w-7 h-7 rounded-lg ${card.iconBg} flex items-center justify-center mb-3`}>
                {card.icon}
              </div>
              <p className={`text-xl font-bold ${card.color} tracking-tight`}>{card.value}</p>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5 uppercase tracking-wider">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analytics Panel */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.03] via-white/[0.02] to-transparent border border-white/[0.07] rounded-3xl p-7 shadow-2xl shadow-black/20">
        
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/[0.03] rounded-full blur-3xl pointer-events-none" />
        
        {loading && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-[11px] text-gray-500">Syncing...</span>
          </div>
        )}

        <div className="relative flex flex-col h-full">
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#C1B6FD] to-[#745CB4]" />
              <h3 className="text-lg font-semibold text-white/90 tracking-tight">Performance Breakdown</h3>
            </div>
            {budget.maxBudget > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-400/15">
            
                <span className="text-xs font-semibold text-amber-300">{formatCurrency(budget.maxBudget)} max</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            
            {/* Left — Lifecycle Stages */}
            <div className="space-y-5">
              <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 rounded-md bg-purple-500/15 flex items-center justify-center">
                    <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-200 tracking-tight">Lifecycle Stages</h4>
                </div>
                <div className="space-y-4">
                  {Object.entries(lifecycle.byStage || {}).length > 0 ? (
                    Object.entries(lifecycle.byStage).map(([stage, count]) => {
                      const total = summary.totalCampaigns || 1;
                      const pct = Math.round((count / total) * 100);
                      const config = stageConfig[stage] || stageConfig.draft;
                      return (
                        <div key={stage} className="group/item">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-2.5 h-2.5 rounded-full ${config.dot} ring-2 ring-white/5`} />
                              <span className="text-[13px] text-gray-300 font-medium capitalize">{stage.replace('_', ' ')}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-bold text-gray-400">{pct}%</span>
                              <span className="text-xs font-bold text-white bg-white/[0.08] px-2.5 py-1 rounded-lg min-w-[28px] text-center">{count}</span>
                            </div>
                          </div>
                          <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${config.color} shadow-sm ${config.glow} transition-all duration-700 ease-out`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                      <GitBranch className="w-8 h-8 mb-2 opacity-30" />
                      <span className="text-xs">No campaigns yet</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right — Goals & Content */}
            <div className="space-y-5 flex flex-col">
              
              {/* Goals */}
              <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/[0.05] flex-1">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 rounded-md bg-amber-500/15 flex items-center justify-center">
                    <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-200 tracking-tight">Campaign Goals</h4>
                  {goals.topGoal && (
                    <span className="ml-auto text-[10px] font-bold text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/15">
                      Top: {goals.topGoal}
                    </span>
                  )}
                </div>
                <div className="space-y-3.5">
                  {Object.entries(goals.byGoal || {}).length > 0 ? (
                    Object.entries(goals.byGoal).map(([goal, count]) => {
                      const total = summary.totalCampaigns || 1;
                      const pct = Math.round((count / total) * 100);
                      const config = goalConfig[goal] || { color: 'from-purple-400 to-violet-500', Icon: ScanEye };
                      const GoalIcon = config.Icon;
                      return (
                        <div key={goal}>
                          <div className="flex justify-between items-center mb-1.5">
                            <div className="flex items-center gap-2">
                              <GoalIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-[13px] text-gray-300 font-medium">{goal}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-400">{pct}%</span>
                              <span className="text-[11px] font-semibold text-white/60 bg-white/[0.06] px-2 py-0.5 rounded-md">{count}</span>
                            </div>
                          </div>
                          <div className="h-[7px] w-full bg-white/[0.04] rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${config.color} transition-all duration-700 ease-out`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                      <Crosshair className="w-8 h-8 mb-2 opacity-30" />
                      <span className="text-xs">No campaigns created yet</span>
                    </div>
                  )}
                </div>
              </div>

        

            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
