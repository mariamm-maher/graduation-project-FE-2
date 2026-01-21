import { DollarSign, TrendingUp, Percent, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 42000, roi: 380 },
  { month: 'Feb', revenue: 48000, roi: 410 },
  { month: 'Mar', revenue: 45000, roi: 392 },
  { month: 'Apr', revenue: 58000, roi: 445 },
  { month: 'May', revenue: 62000, roi: 468 },
  { month: 'Jun', revenue: 71000, roi: 512 },
];

const campaignRevenue = [
  { name: 'Summer Fashion Launch', revenue: '$125,400', roi: '425%', spent: '$29,500' },
  { name: 'Holiday Collection', revenue: '$189,200', roi: '398%', spent: '$47,500' },
  { name: 'Spring Wellness', revenue: '$78,900', roi: '342%', spent: '$23,100' },
];

function RevenueAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Revenue Analytics</h1>
        <p className="text-gray-400">Financial performance and ROI tracking</p>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-green-400 text-sm font-semibold">+32%</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">$393.5K</p>
          <p className="text-sm text-gray-400">Total Revenue</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Percent className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-green-400 text-sm font-semibold">+28%</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">412%</p>
          <p className="text-sm text-gray-400">Average ROI</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-green-400 text-sm font-semibold">+18%</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">$100.1K</p>
          <p className="text-sm text-gray-400">Total Investment</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-green-400 text-sm font-semibold">+25%</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">$293.4K</p>
          <p className="text-sm text-gray-400">Net Profit</p>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Revenue Trend (6 Months)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
            />
            <Line type="monotone" dataKey="revenue" stroke="#C1B6FD" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ROI by Month */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">ROI Percentage by Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
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

      {/* Campaign Revenue Breakdown */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Revenue by Campaign</h2>
        <div className="space-y-4">
          {campaignRevenue.map((campaign, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center font-bold text-white shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">{campaign.name}</h3>
                <p className="text-sm text-gray-400">Spent: {campaign.spent}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Revenue</p>
                <p className="text-lg font-bold text-[#C1B6FD]">{campaign.revenue}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">ROI</p>
                <p className="text-lg font-bold text-green-400">{campaign.roi}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RevenueAnalytics;
