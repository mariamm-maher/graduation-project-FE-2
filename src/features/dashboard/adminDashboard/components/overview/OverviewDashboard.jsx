import { Users, Briefcase, Handshake, TrendingUp, Activity, ArrowUp, ArrowDown } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function OverviewDashboard() {
  const stats = [
    { 
      id: 1, 
      icon: Users, 
      label: 'Total Users', 
      value: '2,847', 
      change: '+12.5%', 
      isPositive: true,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 2, 
      icon: Briefcase, 
      label: 'Active Campaigns', 
      value: '156', 
      change: '+8.2%', 
      isPositive: true,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 3, 
      icon: Handshake, 
      label: 'Collaborations', 
      value: '423', 
      change: '+15.3%', 
      isPositive: true,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 4, 
      icon: Activity, 
      label: 'Active Sessions', 
      value: '89', 
      change: '-3.1%', 
      isPositive: false,
      color: 'from-orange-500 to-red-500'
    },
  ];

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Total Users',
        data: [1200, 1450, 1800, 2100, 2400, 2650, 2847],
        borderColor: '#C1B6FD',
        backgroundColor: 'rgba(193, 182, 253, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const campaignStatusData = {
    labels: ['Active', 'Pending', 'Completed', 'Cancelled'],
    datasets: [
      {
        label: 'Campaigns',
        data: [156, 45, 234, 23],
        backgroundColor: [
          'rgba(193, 182, 253, 0.8)',
          'rgba(116, 92, 180, 0.8)',
          'rgba(52, 211, 153, 0.8)',
          'rgba(248, 113, 113, 0.8)',
        ],
        borderColor: [
          '#C1B6FD',
          '#745CB4',
          '#34D399',
          '#F87171',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(193, 182, 253, 0.3)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
    },
  };

  const recentActivities = [
    { id: 1, user: 'Sarah Johnson', action: 'started a new campaign', time: '5 minutes ago', type: 'campaign' },
    { id: 2, user: 'Mike Chen', action: 'completed a collaboration', time: '15 minutes ago', type: 'collaboration' },
    { id: 3, user: 'Emma Davis', action: 'registered as owner', time: '1 hour ago', type: 'user' },
    { id: 4, user: 'Alex Martinez', action: 'updated profile', time: '2 hours ago', type: 'profile' },
    { id: 5, user: 'James Radcliffe', action: 'created new collaboration', time: '3 hours ago', type: 'collaboration' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-gray-400">Welcome to your admin dashboard. Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} opacity-20 flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">User Growth</h3>
              <p className="text-sm text-gray-400">Monthly user registration trend</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#C1B6FD]" />
          </div>
          <div className="h-64">
            <Line data={userGrowthData} options={chartOptions} />
          </div>
        </div>

        {/* Campaign Status Chart */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Campaign Status</h3>
              <p className="text-sm text-gray-400">Distribution by status</p>
            </div>
            <Briefcase className="w-5 h-5 text-[#C1B6FD]" />
          </div>
          <div className="h-64">
            <Bar data={campaignStatusData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <p className="text-sm text-gray-400">Latest platform activities</p>
          </div>
          <Activity className="w-5 h-5 text-[#C1B6FD]" />
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-[#C1B6FD] mt-2"></div>
              <div className="flex-1">
                <p className="text-white">
                  <span className="font-semibold">{activity.user}</span>{' '}
                  <span className="text-gray-400">{activity.action}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                activity.type === 'campaign' ? 'bg-blue-500/20 text-blue-400' :
                activity.type === 'collaboration' ? 'bg-green-500/20 text-green-400' :
                activity.type === 'user' ? 'bg-purple-500/20 text-purple-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {activity.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OverviewDashboard;
