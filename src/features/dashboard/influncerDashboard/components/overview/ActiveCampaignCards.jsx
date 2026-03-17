import { TrendingUp, Users, MessageCircle, Target, BarChart3, Clock } from 'lucide-react';

function formatCompact(value = 0) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return `${value}`;
}

function ActiveCampaignCards({ collaborations = [], kpis, loading }) {
  const activeCount = kpis?.activeCollaborations ?? collaborations.length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">My Active Collaborations</h2>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            {activeCount} Active
          </span>
        </div>
      </div>

      {loading && (
        <div className="text-xs text-gray-400 mb-4">Loading active collaborations...</div>
      )}

      {!loading && collaborations.length === 0 && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-sm text-gray-300">
          No active collaborations right now.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {collaborations.map((collab) => (
          <div 
            key={collab.id} 
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group"
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center text-2xl shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white mb-1 truncate group-hover:text-[#C1B6FD] transition-colors">
                  {collab.campaignName}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{collab.brand}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    collab.status === 'active' 
                      ? 'bg-green-500/20 text-green-400 animate-pulse' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {collab.status}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="flex items-center gap-1 text-[#C1B6FD] mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-xs text-gray-400">Engagement</span>
                </div>
                <span className="text-lg font-bold text-white">{(collab.engagement ?? 0).toLocaleString()}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="flex items-center gap-1 text-[#C1B6FD] mb-1">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="text-xs text-gray-400">Reach</span>
                </div>
                <span className="text-lg font-bold text-white">{formatCompact(collab.reach ?? 0)}</span>
              </div>
            </div>

            {/* Deliverables Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-400">Deliverables</span>
                <span className="text-white font-semibold">{collab.deliverables?.completed ?? 0}/{collab.deliverables?.total ?? 0}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-full transition-all duration-500"
                  style={{ width: `${collab.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Brand & Earnings */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C1B6FD]" />
                <span className="text-sm text-gray-300">{collab.brand || 'Brand'}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[#C1B6FD]">${(collab.earnings ?? 0).toLocaleString()}</div>
                <div className="text-xs text-gray-400">Earnings</div>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {collab.daysLeft ?? 0} days left</span>
              <span>{(collab.platforms || []).length} platforms</span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{collab.id}</span>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-2 mt-3 flex-wrap">
              {(collab.platforms || []).map((tag, i) => (
                <span 
                  key={i}
                  className="px-2 py-1 bg-[#745CB4]/20 text-[#C1B6FD] rounded text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveCampaignCards;
