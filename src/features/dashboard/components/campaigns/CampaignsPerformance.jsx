import { TrendingUp, DollarSign, Users, Eye, Heart, MessageCircle, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const performanceData = [
  { month: 'Jan', reach: 2.4, engagement: 6.8, roi: 320 },
  { month: 'Feb', reach: 3.1, engagement: 7.2, roi: 385 },
  { month: 'Mar', reach: 2.8, engagement: 6.5, roi: 342 },
  { month: 'Apr', reach: 4.2, engagement: 8.1, roi: 428 },
  { month: 'May', reach: 3.9, engagement: 7.8, roi: 398 },
  { month: 'Jun', reach: 5.1, engagement: 8.9, roi: 512 },
];

const topCampaigns = [
  { name: 'Summer Fashion Launch', roi: '425%', reach: '4.2M', spent: '$85K' },
  { name: 'Holiday Collection', roi: '398%', reach: '6.8M', spent: '$120K' },
  { name: 'Spring Wellness', roi: '342%', reach: '2.1M', spent: '$55K' },
];

function CampaignsPerformance() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Campaign Performance</h1>
        <p className="text-gray-400">Track and analyze campaign metrics and ROI</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-green-400 text-sm font-semibold">+32%</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">398%</p>
          <p className="text-sm text-gray-400">Avg ROI</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-green-400 text-sm font-semibold">+18%</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">13.1M</p>
          <p className="text-sm text-gray-400">Total Reach</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-green-400 text-sm font-semibold">+12%</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">7.6%</p>
          <p className="text-sm text-gray-400">Avg Engagement</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-green-400 text-sm font-semibold">+25%</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">156K</p>
          <p className="text-sm text-gray-400">Total Comments</p>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Reach Over Time */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Reach Over Time (Millions)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="reach" stroke="#C1B6FD" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ROI Over Time */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">ROI Percentage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
              />
              <Bar dataKey="roi" fill="#745CB4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Campaigns */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Top Performing Campaigns</h2>
        <div className="space-y-4">
          {topCampaigns.map((campaign, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center font-bold text-white shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">{campaign.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">ROI</p>
                <p className="text-lg font-bold text-[#C1B6FD]">{campaign.roi}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Reach</p>
                <p className="text-lg font-bold text-white">{campaign.reach}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Spent</p>
                <p className="text-lg font-bold text-white">{campaign.spent}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CampaignsPerformance;
