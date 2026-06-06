import { TrendingUp, TrendingDown, Eye, Heart, Target, DollarSign, Activity } from 'lucide-react';
import CountUp from 'react-countup';

function KPICards({ kpis, loading }) {
  const kpiConfig = [
    {
      key: 'totalReach',
      label: 'Total Reach',
      icon: Eye,
      format: (value) => value?.toLocaleString() || '0',
    },
    {
      key: 'engagementRate',
      label: 'Engagement Rate',
      icon: Heart,
      format: (value) => `${value?.toFixed(1) || '0'}%`,
    },
    {
      key: 'totalConversions',
      label: 'Total Conversions',
      icon: Target,
      format: (value) => value?.toLocaleString() || '0',
    },
    {
      key: 'campaignROI',
      label: 'Campaign ROI',
      icon: DollarSign,
      format: (value) => `${value?.toFixed(1) || '0'}%`,
    },
    {
      key: 'activeCampaigns',
      label: 'Active Campaigns',
      icon: Activity,
      format: (value) => value?.toString() || '0',
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-wrap gap-4">
        {kpiConfig.map((_, index) => (
          <div key={index} className="flex-1 min-w-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="animate-pulse">
              <div className="w-10 h-10 bg-white/10 rounded-lg mb-4" />
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-8 bg-white/10 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {kpiConfig.map((config) => {
        const value = kpis?.[config.key];
        const trendStr = kpis?.trends?.[config.key] || '0%';
        const trend = parseFloat(trendStr) || 0;
        const Icon = config.icon;

        return (
          <div
            key={config.key}
            className="flex-1 min-w-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#C1B6FD]/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#745CB4]/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#C1B6FD]" />
              </div>
              {trendStr !== undefined && trendStr !== '0%' && (
                <div className={`flex items-center gap-1 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trend >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {trend >= 0 ? '+' : ''}{trendStr}
                  </span>
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm mb-2">{config.label}</p>
            <p className="text-2xl font-bold text-white">
              <CountUp end={value || 0} duration={1.5} formattingFn={config.format} />
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default KPICards;
