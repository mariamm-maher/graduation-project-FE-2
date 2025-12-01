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
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Performance Metrics</h1>
        <p className="text-gray-400 text-sm sm:text-base">Detailed campaign and content performance analysis</p>
      </div>

      {/* Key Metrics – 2 on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-green-400 text-xs sm:text-sm font-semibold">+24%</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mb-1">18.4M</p>
          <p className="text-xs sm:text-sm text-gray-400">Total Reach</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h -10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-green-400 text-xs sm:text-sm font-semibold">+18%</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mb-1">8.4%</p>
          <p className="text-xs sm:text-sm text-gray-400">Engagement Rate</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-green-400 text-xs sm:text-sm font-semibold">+32%</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mb-1">156K</p>
          <p className="text-xs sm:text-sm text-gray-400">Total Comments</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-green-400 text-xs sm:text-sm font-semibold">+15%</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mb-1">114K</p>
          <p className="text-xs sm:text-sm text-gray-400">Click-through Rate</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 lg:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Weekly Performance Trends</h2>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="day" 
              stroke="#999" 
              tick={{ fontSize: 12 }}
            />
            <YAxis stroke="#999" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
              labelStyle={{ color: '#C1B6FD' }}
            />
            <Area 
              type="monotone" 
              dataKey="reach" 
              stackId="1" 
              stroke="#745CB4" 
              fill="#745CB4" 
              fillOpacity={0.6} 
            />
            <Area 
              type="monotone" 
              dataKey="engagement" 
              stackId="2" 
              stroke="#C1B6FD" 
              fill="#C1B6FD" 
              fillOpacity={0.6} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Performing Content – Responsive Table (Cards on mobile) */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 lg:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-5">Top Performing Content</h2>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left text-sm font-medium text-gray-400">
                <th className="pb-4">Content</th>
                <th className="pb-4">Platform</th>
                <th className="pb-4">Reach</th>
                <th className="pb-4">Engagement</th>
                <th className="pb-4">Comments</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { title: "Summer Collection Launch", desc: "Fashion Campaign", platform: "Instagram", reach: "4.2M", engagement: "9.2%", comments: "42.1K" },
                { title: "Tech Review Video", desc: "Product Launch", platform: "YouTube", reach: "2.8M", engagement: "8.7%", comments: "28.4K" },
                { title: "Wellness Tips Series", desc: "Health Campaign", platform: "TikTok", reach: "3.6M", engagement: "10.1%", comments: "38.9K" },
              ].map((item, idx) => (
                <tr key={idx} className="border-b border-white/10 last:border-0">
                  <td className="py-4">
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </td>
                  <td className="py-4 text-white">{item.platform}</td>
                  <td className="py-4 text-white font-semibold">{item.reach}</td>
                  <td className="py-4 text-[#C1B6FD] font-semibold">{item.engagement}</td>
                  <td className="py-4 text-white">{item.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {[
            { title: "Summer Collection Launch", desc: "Fashion Campaign", platform: "Instagram", reach: "4.2M", engagement: "9.2%", comments: "42.1K" },
            { title: "Tech Review Video", desc: "Product Launch", platform: "YouTube", reach: "2.8M", engagement: "8.7%", comments: "28.4K" },
            { title: "Wellness Tips Series", desc: "Health Campaign", platform: "TikTok", reach: "3.6M", engagement: "10.1%", comments: "38.9K" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-semibold text-base">{item.title}</p>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
                <span className="text-xs bg-purple-500/20 text-[#C1B6FD] px-2 py-1 rounded-full font-medium">
                  {item.platform}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-gray-400">Reach</p>
                  <p className="text-white font-bold">{item.reach}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Engagement</p>
                  <p className="text-[#C1B6FD] font-bold">{item.engagement}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Comments</p>
                  <p className="text-white font-bold">{item.comments}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PerformanceMetrics;