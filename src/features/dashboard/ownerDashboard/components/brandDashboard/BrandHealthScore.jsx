import { TrendingUp, TrendingDown } from 'lucide-react';

function BrandHealthScore({ score, trend, status, loading }) {
  const getScoreColor = (value) => {
    if (value >= 80) return '#22c55e';
    if (value >= 60) return '#C1B6FD';
    if (value >= 40) return '#eab308';
    return '#ef4444';
  };

  const getStatusColor = (value) => {
    if (value >= 80) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (value >= 60) return 'bg-[#C1B6FD]/20 text-[#C1B6FD] border-[#C1B6FD]/30';
    if (value >= 40) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getStatusText = (value) => {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Average';
    return 'Needs Attention';
  };

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - ((score || 0) / 100) * circumference;

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col items-center justify-center h-48">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C1B6FD]" />
          <p className="text-gray-400 text-sm mt-4">Loading health score...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Brand Health Score</h3>
      
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="54"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="72"
              cy="72"
              r="54"
              stroke={getScoreColor(score)}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{score || 0}</span>
          </div>
        </div>

        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-4 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {trend >= 0 ? '+' : ''}{trend}% vs last period
            </span>
          </div>
        )}

        <span className={`px-3 py-1 rounded-full text-xs font-semibold mt-3 border ${getStatusColor(score)}`}>
          {getStatusText(score)}
        </span>
      </div>
    </div>
  );
}

export default BrandHealthScore;
