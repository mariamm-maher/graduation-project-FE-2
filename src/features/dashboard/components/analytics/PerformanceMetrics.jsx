import { TrendingUp, Eye, Heart, MessageCircle, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const performanceData = [
  { day: 'Mon', reach: 2.4, engagement: 6.8, clicks: 12.4 },
  { day: 'Tue', reach: 2.8, engagement: 7.2, clicks: 14.2 },
  { day: 'Wed', reach: 3.2, engagement: 7.8, clicks: 16.8 },
  { day: 'Thu', reach: 2.9, engagement: 7.1, clicks: 13.9 },
  { day: 'Fri', reach: 3.8, engagement: 8.4, clicks: 18.2 },
  { day: 'Sat', reach: 4.2, engagement: 9.1, clicks: 21.5 },
  { day: 'Sun', reach: 3.6, engagement: 8.2, clicks: 17.8 },
];

function PerformanceMetrics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Performance Metrics</h1>
        <p className="text-gray-400">Detailed campaign and content performance analysis</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-green-400 text-sm font-semibold">+24%</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">18.4M</p>
          <p className="text-sm text-gray-400">Total Reach</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-green-400 text-sm font-semibold">+18%</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">8.4%</p>
          <p className="text-sm text-gray-400">Engagement Rate</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-green-400 text-sm font-semibold">+32%</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">156K</p>
          <p className="text-sm text-gray-400">Total Comments</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-green-400 text-sm font-semibold">+15%</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">114K</p>
          <p className="text-sm text-gray-400">Click-through Rate</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Weekly Performance Trends</h2>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="day" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
            />
            <Area type="monotone" dataKey="reach" stackId="1" stroke="#745CB4" fill="#745CB4" fillOpacity={0.6} />
            <Area type="monotone" dataKey="engagement" stackId="2" stroke="#C1B6FD" fill="#C1B6FD" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Content Performance Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Top Performing Content</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-400 font-medium text-sm pb-3">Content</th>
                <th className="text-left text-gray-400 font-medium text-sm pb-3">Platform</th>
                <th className="text-left text-gray-400 font-medium text-sm pb-3">Reach</th>
                <th className="text-left text-gray-400 font-medium text-sm pb-3">Engagement</th>
                <th className="text-left text-gray-400 font-medium text-sm pb-3">Comments</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10">
                <td className="py-4">
                  <p className="text-white font-medium">Summer Collection Launch</p>
                  <p className="text-sm text-gray-400">Fashion Campaign</p>
                </td>
                <td className="py-4 text-white">Instagram</td>
                <td className="py-4 text-white font-semibold">4.2M</td>
                <td className="py-4 text-[#C1B6FD] font-semibold">9.2%</td>
                <td className="py-4 text-white">42.1K</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-4">
                  <p className="text-white font-medium">Tech Review Video</p>
                  <p className="text-sm text-gray-400">Product Launch</p>
                </td>
                <td className="py-4 text-white">YouTube</td>
                <td className="py-4 text-white font-semibold">2.8M</td>
                <td className="py-4 text-[#C1B6FD] font-semibold">8.7%</td>
                <td className="py-4 text-white">28.4K</td>
              </tr>
              <tr>
                <td className="py-4">
                  <p className="text-white font-medium">Wellness Tips Series</p>
                  <p className="text-sm text-gray-400">Health Campaign</p>
                </td>
                <td className="py-4 text-white">TikTok</td>
                <td className="py-4 text-white font-semibold">3.6M</td>
                <td className="py-4 text-[#C1B6FD] font-semibold">10.1%</td>
                <td className="py-4 text-white">38.9K</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PerformanceMetrics;
