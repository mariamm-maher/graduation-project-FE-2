import { Activity, MessageSquare, DollarSign, TrendingUp } from 'lucide-react';

const dates = [
  { date: '01', day: 'Sat' },
  { date: '02', day: 'Sun' },
  { date: '03', day: 'Mon' },
  { date: '04', day: 'Tue' },
  { date: '05', day: 'Wed' },
  { date: '06', day: 'Thu' },
  { date: '07', day: 'Fri' },
  { date: '08', day: 'Sat' },
  { date: '09', day: 'Sun' },
  { date: '10', day: 'Mon' },
  { date: '11', day: 'Tue' },
  { date: '12', day: 'Wed' },
  { date: '13', day: 'Thu' },
];

export default function StatisticsChart({ kpis, performanceSeries, communicationsFeed, activeCampaigns, loading }) {

  // Derive Alternative Analytics from communicationsFeed
  const feed = Array.isArray(communicationsFeed) ? communicationsFeed : [];
  
  const platformCounts = feed.reduce((acc, item) => {
    const platform = item.platform || 'System';
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {});

  const statusCounts = feed.reduce((acc, item) => {
    let status = (item.status || 'Update').toLowerCase();
    if (status.includes('pending')) status = 'pending';
    if (status.includes('deliver')) status = 'delivered';
    if (status.includes('complete')) status = 'completed';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const actionTypes = feed.reduce((acc, item) => {
    const type = item.type || 'message';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Derived metrics from Active Campaigns
  const campaigns = Array.isArray(activeCampaigns) ? activeCampaigns : [];
  const totalCampaignBudget = campaigns.reduce((acc, c) => acc + (c.budget || 0), 0);
  const totalCampaignReach = campaigns.reduce((acc, c) => acc + (c.targetReach || c.projectedReach || 0), 0);
  const costPerReach = totalCampaignReach > 0 ? (totalCampaignBudget / totalCampaignReach) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-linear-to-r from-[#C1B6FD] to-[#745CB4] bg-clip-text text-transparent">
          Campaign Performance
        </h2>
        <div className="flex gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1">
          <button className="px-4 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg text-white text-sm font-medium transition-all">
            Days
          </button>
          <button className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium transition-all">
            Weeks
          </button>
          <button className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium transition-all">
            Months
          </button>
        </div>
      </div>

      {/* Date Selector */}
      {/* <div className="flex gap-2 mb-6 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-linear-to-r [&::-webkit-scrollbar-thumb]:from-[#C1B6FD] [&::-webkit-scrollbar-thumb]:to-[#745CB4] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-[#745CB4] [&::-webkit-scrollbar-thumb]:hover:to-[#C1B6FD]">
        {dates.map((item, idx) => (
          <button
            key={idx}
            className={`px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              idx === 9 
                ? 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-lg shadow-purple-500/50 scale-105' 
                : 'bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:border-purple-400/30 hover:bg-white/10 hover:scale-105'
            }`}
          >
            <div className="text-center">
              <div className="text-lg font-bold">{item.date}</div>
              <div className="text-xs opacity-75">{item.day}</div>
            </div>
          </button>
        ))}
      </div> */}

      {/* Main Container */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:border-purple-400/30 transition-all duration-300 group min-h-[360px]">
        
        {loading && (
          <div className="text-xs text-gray-400 mb-2">Loading performance overview...</div>
        )}

        <div className="flex flex-col h-full animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Activity & ROI Insights</h3>
            <p className="text-xs text-gray-400 font-medium px-3 py-1 bg-white/5 rounded-full border border-white/5">
              Activity trends based on current tasks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            
            {/* Left Side - Campaign ROI & Status distribution */}
            <div className="space-y-6">
              
              {/* Micro-Stat Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 hover:bg-white/[0.05] transition-colors hover:scale-105 transform">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">${totalCampaignBudget.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 font-medium">Allocated Budget</div>
                </div>
                
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 hover:bg-white/[0.05] transition-colors hover:scale-105 transform">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {costPerReach > 0 ? `$${costPerReach.toFixed(3)}` : '-'}
                  </div>
                  <div className="text-xs text-gray-400 font-medium">Est. Cost Per Reach</div>
                </div>
              </div>

              {/* Status Distribution */}
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                <h4 className="text-sm text-gray-300 font-semibold mb-4">Task Status</h4>
                <div className="space-y-3">
                  {Object.entries(statusCounts).length > 0 ? (
                    Object.entries(statusCounts).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              status === 'completed' || status === 'delivered' ? 'bg-emerald-400' :
                              status === 'pending' ? 'bg-yellow-400' : 'bg-blue-400'
                            }`} />
                            <span className="text-sm text-gray-300 capitalize">{status}</span>
                        </div>
                        <span className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">{count}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500">No active tasks tracked</div>
                  )}
                </div>
              </div>

            </div>


            {/* Right Side - Platform & Interactions */}
            <div className="space-y-6 flex flex-col h-full">
              
              {/* Platform Distribution Bar */}
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 flex-1">
                  <h4 className="text-sm text-gray-300 font-semibold mb-4">Platform Engagement Share</h4>
                  <div className="space-y-4">
                    {Object.entries(platformCounts).length > 0 ? (
                      Object.entries(platformCounts).map(([platform, count], i, arr) => {
                        const total = arr.reduce((sum, [, c]) => sum + c, 0);
                        const percentage = Math.round((count / total) * 100);
                        return (
                          <div key={platform}>
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-gray-300 font-medium capitalize">{platform}</span>
                              <span className="text-[#C1B6FD] font-bold">{percentage}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-xs text-gray-500 flex flex-col items-center justify-center py-4">
                        <Activity className="w-6 h-6 text-gray-600 mb-2" />
                        <span>No platform data. Engage to see insights.</span>
                      </div>
                    )}
                  </div>
              </div>

              {/* Actions Chips */}
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                <h4 className="text-sm text-gray-300 font-semibold mb-3">Activity Types</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(actionTypes).length > 0 ? (
                    Object.entries(actionTypes).map(([type, count]) => (
                      <div key={type} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-br from-[#745CB4]/20 to-[#C1B6FD]/10 border border-[#745CB4]/30">
                        <MessageSquare className="w-3.5 h-3.5 text-[#C1B6FD]" />
                        <span className="text-xs font-semibold text-[#C1B6FD] capitalize">{type.replace('_', ' ')}</span>
                        <span className="text-[10px] bg-black/30 px-1.5 rounded text-gray-300">{count}</span>
                      </div>
                    ))
                  ) : (
                      <span className="text-xs text-gray-500">No actions recorded.</span>
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
