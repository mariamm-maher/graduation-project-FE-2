import { TrendingUp, CheckCircle2, DollarSign, Target } from 'lucide-react';

function HistoryStats({ collaborations }) {
  const totalCount = collaborations.length;
  const totalCompleted = collaborations.filter(c => c.status === 'completed').length;
  const totalRevenue = collaborations.reduce((sum, c) => {
    const revenue = parseFloat(c.revenue.replace(/[^0-9.-]+/g, ''));
    return sum + revenue;
  }, 0);
  
  const avgPerformance = collaborations.reduce((sum, c) => {
    const perf = parseFloat(c.performance.replace(/[^0-9.-]+/g, ''));
    return sum + perf;
  }, 0) / (totalCount || 1);

  const avgROI = collaborations.reduce((sum, c) => {
    const roi = parseFloat(c.roi.replace(/[^0-9.-]+/g, ''));
    return sum + roi;
  }, 0) / (totalCount || 1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Completed</p>
            <p className="text-2xl font-bold text-white">{totalCompleted}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-[#C1B6FD]" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Revenue</p>
            <p className="text-2xl font-bold text-[#C1B6FD]">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Avg Performance</p>
            <p className="text-2xl font-bold text-white">{avgPerformance.toFixed(1)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Avg ROI</p>
            <p className="text-2xl font-bold text-white">{avgROI.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryStats;
