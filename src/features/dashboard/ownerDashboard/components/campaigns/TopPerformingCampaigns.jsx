import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const topCampaigns = [
  {
    id: 1,
    name: 'Summer Fashion Launch',
    platform: 'Instagram',
    icon: 'SF',
    color: 'from-pink-500 to-purple-500',
    rewardRate: '13.62%',
    change: '+6.25%',
    isPositive: true,
    value: '+$2,956',
    chartData: [
      { value: 2100 },
      { value: 1950 },
      { value: 2200 },
      { value: 2050 },
      { value: 2400 },
      { value: 2700 },
      { value: 2956 },
    ],
  },
  {
    id: 2,
    name: 'Tech Product Review',
    platform: 'YouTube',
    icon: 'TR',
    color: 'from-yellow-500 to-orange-500',
    rewardRate: '12.72%',
    change: '+5.67%',
    isPositive: true,
    value: '+$2,009',
    chartData: [
      { value: 1800 },
      { value: 1650 },
      { value: 1900 },
      { value: 1750 },
      { value: 2100 },
      { value: 1950 },
      { value: 2009 },
    ],
  },
  {
    id: 3,
    name: 'Wellness Campaign',
    platform: 'TikTok',
    icon: 'WC',
    color: 'from-purple-500 to-indigo-500',
    rewardRate: '6.29%',
    change: '-1.89%',
    isPositive: false,
    value: '-$987',
    chartData: [
      { value: 1200 },
      { value: 1350 },
      { value: 1100 },
      { value: 1250 },
      { value: 900 },
      { value: 750 },
      { value: 213 },
    ],
  },
];

function TopPerformingCampaigns() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs sm:text-sm text-gray-400">Recommended campaigns for 24 hours</span>
            <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-xs text-gray-400">i</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">Top Performing Campaigns</h1>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
          <button className="px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs sm:text-sm text-white hover:bg-white/10 transition-all flex items-center gap-2 flex-1 sm:flex-initial">
            <span>24H</span>
          </button>
          <button className="px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs sm:text-sm text-white hover:bg-white/10 transition-all flex-1 sm:flex-initial">
            Performance Based
          </button>
          <button className="px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs sm:text-sm text-white hover:bg-white/10 transition-all flex-1 sm:flex-initial">
            Desc
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {topCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            onClick={() => navigate(`/dashboard/campaigns/${campaign.id}`)}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group relative overflow-hidden cursor-pointer"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Header */}
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${campaign.color} flex items-center justify-center font-bold text-white text-sm`}>
                  {campaign.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Performance Based</p>
                  <h3 className="text-base font-bold text-white">{campaign.name}</h3>
                </div>
              </div>
              <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all">
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Reward Rate */}
            <div className="mb-4 relative z-10">
              <p className="text-xs text-gray-400 mb-2">Reward Rate</p>
              <div className="flex items-end gap-2 sm:gap-3 mb-2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{campaign.rewardRate}</h2>
                <div className={`flex items-center gap-1 mb-2 ${campaign.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {campaign.isPositive ? (
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                  <span className="text-xs sm:text-sm font-semibold">{campaign.change}</span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="relative z-10 h-24 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={campaign.chartData}>
                  <defs>
                    <linearGradient id={`gradient-${campaign.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={campaign.isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={campaign.isPositive ? '#10b981' : '#ef4444'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={campaign.isPositive ? '#10b981' : '#ef4444'}
                    strokeWidth={2}
                    dot={false}
                    fill={`url(#gradient-${campaign.id})`}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Value Label */}
              <div className="absolute top-0 right-0 flex items-center gap-1">
                <span className={`text-xs font-semibold ${campaign.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {campaign.value}
                </span>
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </div>

            {/* Platform Badge */}
            <div className="flex items-center justify-between relative z-10">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">
                {campaign.platform}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center pt-4">
        <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white font-semibold transition-all flex items-center gap-2">
          View All Campaigns
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default TopPerformingCampaigns;
