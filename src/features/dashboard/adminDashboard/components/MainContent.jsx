import { Users, Monitor, Handshake, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
  { label: 'Total Accounts', value: 156, icon: Users, path: '/dashboard/admin/accounts', color: 'from-[#745CB4] to-[#C1B6FD]' },
  { label: 'Active Sessions', value: 42, icon: Monitor, path: '/dashboard/admin/sessions', color: 'from-[#745CB4] to-[#C1B6FD]' },
  { label: 'Collaborations', value: 89, icon: Handshake, path: '/dashboard/admin/collaborations', color: 'from-[#745CB4] to-[#C1B6FD]' },
];

const platformChartData = [
  { month: 'Jul', accounts: 120, collaborations: 45 },
  { month: 'Aug', accounts: 128, collaborations: 52 },
  { month: 'Sep', accounts: 135, collaborations: 58 },
  { month: 'Oct', accounts: 142, collaborations: 68 },
  { month: 'Nov', accounts: 148, collaborations: 78 },
  { month: 'Dec', accounts: 156, collaborations: 89 },
];

function MainContent() {
  return (
    <div className="space-y-8 transition-all duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-400">Platform overview and analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} to={stat.path}>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#745CB4]/50 transition-all duration-300 group cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-gray-500 group-hover:text-[#C1B6FD] transition-colors" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Growth Chart */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-6 h-6 text-[#C1B6FD]" />
            <h2 className="text-lg font-semibold text-white">Platform Growth</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={platformChartData}>
                <defs>
                  <linearGradient id="colorAccounts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C1B6FD" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#745CB4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCollabs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#745CB4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C1B6FD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a3e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} labelStyle={{ color: '#C1B6FD' }} />
                <Area type="monotone" dataKey="accounts" stroke="#C1B6FD" fillOpacity={1} fill="url(#colorAccounts)" name="Accounts" strokeWidth={2} />
                <Area type="monotone" dataKey="collaborations" stroke="#745CB4" fillOpacity={1} fill="url(#colorCollabs)" name="Collaborations" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#C1B6FD]" />
              <span className="text-sm text-gray-400">Accounts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#745CB4]" />
              <span className="text-sm text-gray-400">Collaborations</span>
            </div>
          </div>
        </div>

        {/* Activity & Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-6 h-6 text-[#C1B6FD]" />
              <h2 className="text-lg font-semibold text-white">Activity Summary</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-gray-400">New signups (7 days)</span>
                <span className="font-semibold text-white">24</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-gray-400">Active collaborations</span>
                <span className="font-semibold text-green-400">32</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-gray-400">Completed this month</span>
                <span className="font-semibold text-[#C1B6FD]">18</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Avg. session duration</span>
                <span className="font-semibold text-white">12m</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard/admin/accounts" className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-[#745CB4]/20 hover:border-[#745CB4]/50 transition-all">
                View Accounts
              </Link>
              <Link to="/dashboard/admin/sessions" className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-[#745CB4]/20 hover:border-[#745CB4]/50 transition-all">
                View Sessions
              </Link>
              <Link to="/dashboard/admin/collaborations" className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-[#745CB4]/20 hover:border-[#745CB4]/50 transition-all">
                View Collaborations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainContent;
