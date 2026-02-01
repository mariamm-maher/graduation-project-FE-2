import { useEffect } from 'react';
import { Users, Briefcase, Handshake, TrendingUp, Activity, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
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
import  useAdminStore from '../../../../../stores/AdminStore';

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
  const { analytics, recentLogs, isLoading, error, fetchAnalytics, fetchRecentLogs } = useAdminStore();

  useEffect(() => {
    fetchAnalytics();
    fetchRecentLogs();
  }, [fetchAnalytics, fetchRecentLogs]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#C1B6FD] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-400 mb-2">Failed to load analytics</p>
          <p className="text-gray-400 text-sm">{error}</p>
          <button 
            onClick={() => fetchAnalytics()}
            className="mt-4 px-4 py-2 bg-[#745CB4] hover:bg-[#5d4a91] text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use real data from analytics or fallback to defaults
  const overview = analytics?.overview || {
    totalUsers: 0,
    totalCampaigns: 0,
    totalCollaborations: 0,
    activeSessions: 0
  };

  const stats = [
    { 
      id: 1, 
      icon: Users, 
      label: 'Total Users', 
      value: overview.totalUsers.toLocaleString(), 
      change: overview.recentUsers ? `+${overview.recentUsers} recent` : '+0 recent', 
      isPositive: overview.recentUsers > 0,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 2, 
      icon: Briefcase, 
      label: 'Total Campaigns', 
      value: overview.totalCampaigns.toLocaleString(), 
      change: analytics?.campaignStats?.active ? `${analytics.campaignStats.active} active` : '0 active', 
      isPositive: true,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 3, 
      icon: Handshake, 
      label: 'Collaborations', 
      value: overview.totalCollaborations.toLocaleString(), 
      change: overview.totalCollaborations > 0 ? 'Active' : 'None', 
      isPositive: overview.totalCollaborations > 0,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 4, 
      icon: Activity, 
      label: 'Active Sessions', 
      value: overview.activeSessions.toLocaleString(), 
      change: 'Live now', 
      isPositive: overview.activeSessions > 0,
      color: 'from-orange-500 to-red-500'
    },
  ];

  const userGrowthData = {
    labels: ['Owners', 'Influencers'],
    datasets: [
      {
        label: 'Users by Role',
        data: [
          analytics?.usersByRole?.owners || 0,
          analytics?.usersByRole?.influencers || 0
        ],
        borderColor: '#C1B6FD',
        backgroundColor: 'rgba(193, 182, 253, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const campaignStatusData = {
    labels: ['Active', 'Draft'],
    datasets: [
      {
        label: 'Campaigns',
        data: [
          analytics?.campaignStats?.active || 0,
          analytics?.campaignStats?.draft || 0
        ],
        backgroundColor: [
          'rgba(193, 182, 253, 0.8)',
          'rgba(116, 92, 180, 0.8)',
        ],
        borderColor: [
          '#C1B6FD',
          '#745CB4',
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

  // Helper function to format relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Helper function to get action display text
  const getActionText = (log) => {
    const email = log.meta?.email || 'Unknown user';
    const method = log.meta?.method ? ` via ${log.meta.method}` : '';
    
    switch (log.action) {
      case 'LOGIN':
        return `${email} logged in${method}`;
      case 'LOGOUT':
        return `${email} logged out`;
      case 'CHANGE_ROLE':
        return `Role changed to ${log.meta?.roleName || 'unknown'}`;
      case 'SIGNUP':
        return `${email} registered${method}`;
      case 'UPDATE_PROFILE':
        return `${email} updated profile`;
      case 'CREATE_CAMPAIGN':
        return 'created a new campaign';
      case 'UPDATE_CAMPAIGN':
        return 'updated a campaign';
      case 'DELETE_CAMPAIGN':
        return 'deleted a campaign';
      case 'CREATE_COLLABORATION':
        return 'created a collaboration';
      case 'UPDATE_COLLABORATION':
        return 'updated a collaboration';
      default:
        return log.action.toLowerCase().replace(/_/g, ' ');
    }
  };

  // Helper function to get entity type for badge color
  const getEntityType = (log) => {
    if (log.action.includes('CAMPAIGN')) return 'campaign';
    if (log.action.includes('COLLABORATION')) return 'collaboration';
    if (log.action === 'LOGIN' || log.action === 'LOGOUT' || log.action === 'SIGNUP') return 'auth';
    if (log.action === 'CHANGE_ROLE' || log.entity === 'User') return 'user';
    return 'system';
  };

  // Map recentLogs to activities format
  const logsArray = recentLogs?.recent || [];
  const recentActivities = logsArray.map((log) => ({
    id: log.id,
    user: log.meta?.email || log.actor || 'System',
    action: getActionText(log),
    time: getRelativeTime(log.createdAt),
    type: getEntityType(log),
    roles: log.meta?.roles || []
  }));

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
              <h3 className="text-lg font-semibold text-white">Users by Role</h3>
              <p className="text-sm text-gray-400">Distribution of campaign owners and influencers</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#C1B6FD]" />
          </div>
          <div className="h-64">
            <Bar data={userGrowthData} options={chartOptions} />
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
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-[#C1B6FD] mt-2 shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-white break-words">
                    <span className="font-semibold">{activity.user}</span>
                  </p>
                  <p className="text-sm text-gray-400 mt-1 break-words">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  {activity.roles.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {activity.roles.map((role, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                  activity.type === 'campaign' ? 'bg-blue-500/20 text-blue-400' :
                  activity.type === 'collaboration' ? 'bg-green-500/20 text-green-400' :
                  activity.type === 'user' ? 'bg-purple-500/20 text-purple-400' :
                  activity.type === 'auth' ? 'bg-cyan-500/20 text-cyan-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {activity.type}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OverviewDashboard;
