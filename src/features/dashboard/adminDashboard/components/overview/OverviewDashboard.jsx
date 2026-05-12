import { useEffect } from 'react';
import { Users, Briefcase, Handshake, TrendingUp, Activity, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function OverviewDashboard() {
  const { analytics, isLoading, error, fetchAnalytics } = useAdminStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

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

  // Data mapping utility - ensures all fields exist with defaults
  const mapAnalyticsData = (data) => {
    if (!data) return null;

    return {
      overview: {
        totalUsers: data.overview?.totalUsers ?? 0,
        totalCampaigns: data.overview?.totalCampaigns ?? 0,
        totalCollaborations: data.overview?.totalCollaborations ?? 0,
        activeSessions: data.overview?.activeSessions ?? 0,
        recentUsers: data.overview?.recentUsers ?? 0
      },
      usersByRole: {
        owners: data.usersByRole?.owners ?? 0,
        influencers: data.usersByRole?.influencers ?? 0
      },
      campaignStats: {
        active: data.campaignStats?.active ?? 0,
        draft: data.campaignStats?.draft ?? 0,
        ai_generated: data.campaignStats?.ai_generated ?? 0,
        saved: data.campaignStats?.saved ?? 0,
        completed: data.campaignStats?.completed ?? 0,
        cancelled: data.campaignStats?.cancelled ?? 0,
        ...data.campaignStats
      },
      collaborationStats: data.collaborationStats || {},
      recentLogs: data.recentLogs || []
    };
  };

  // Apply data mapping
  const mappedAnalytics = mapAnalyticsData(analytics);

  // Use mapped data with fallbacks
  const overview = mappedAnalytics?.overview || {
    totalUsers: 0,
    totalCampaigns: 0,
    totalCollaborations: 0,
    activeSessions: 0,
    recentUsers: 0
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

  // Advanced Users by Role data
  const ownersCount = mappedAnalytics?.usersByRole?.owners || 0;
  const influencersCount = mappedAnalytics?.usersByRole?.influencers || 0;
  const totalRoleUsers = ownersCount + influencersCount;
  const ownersPercentage = totalRoleUsers > 0 ? ((ownersCount / totalRoleUsers) * 100).toFixed(1) : 0;
  const influencersPercentage = totalRoleUsers > 0 ? ((influencersCount / totalRoleUsers) * 100).toFixed(1) : 0;

  const userRoleDoughnutData = {
    labels: ['Owners', 'Influencers'],
    datasets: [
      {
        data: [ownersCount, influencersCount],
        backgroundColor: [
          'rgba(193, 182, 253, 0.9)',  // Purple for Owners
          'rgba(116, 92, 180, 0.9)',   // Darker purple for Influencers
        ],
        borderColor: [
          '#C1B6FD',
          '#745CB4',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(193, 182, 253, 1)',
          'rgba(116, 92, 180, 1)',
        ],
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
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
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const percentage = totalRoleUsers > 0 ? ((value / totalRoleUsers) * 100).toFixed(1) : 0;
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
  };

  const campaignStatusData = {
    labels: ['Active', 'Draft'],
    datasets: [
      {
        label: 'Campaigns',
        data: [
          mappedAnalytics?.campaignStats?.active || 0,
          mappedAnalytics?.campaignStats?.draft || 0
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
    const method = log.meta?.method ? ` via ${log.meta.method}` : '';
    const targetName = log.meta?.name || log.meta?.title || '';
    
    switch (log.action) {
      case 'LOGIN':
        return `logged in${method}`;
      case 'LOGOUT':
        return `logged out`;
      case 'SIGNUP':
        return `registered${method}`;
      case 'CHANGE_ROLE':
        return `changed role to ${log.meta?.roleName || 'unknown'}`;
      case 'UPDATE_PROFILE':
        return `updated profile`;
      case 'CREATE_CAMPAIGN':
        return `created campaign${targetName ? ` "${targetName}"` : ''}`;
      case 'UPDATE_CAMPAIGN':
        return `updated campaign${targetName ? ` "${targetName}"` : ''}`;
      case 'DELETE_CAMPAIGN':
        return `deleted campaign${targetName ? ` "${targetName}"` : ''}`;
      case 'CREATE_COLLABORATION':
        return `created collaboration${targetName ? ` "${targetName}"` : ''}`;
      case 'UPDATE_COLLABORATION':
        return `updated collaboration${targetName ? ` "${targetName}"` : ''}`;
      case 'DELETE_COLLABORATION':
        return `deleted collaboration${targetName ? ` "${targetName}"` : ''}`;
      case 'CREATE_CONTRACT':
        return `created contract${targetName ? ` "${targetName}"` : ''}`;
      case 'SIGN_CONTRACT':
        return `signed contract${log.meta?.signerRole ? ` as ${log.meta.signerRole}` : ''}${log.meta?.fullySigned ? ' (fully signed)' : ''}`;
      case 'CREATE_REVIEW':
        return `left a review${log.meta?.rating ? ` (${log.meta.rating} stars)` : ''}`;
      case 'SEND_COLLABORATION_REQUEST':
        return `sent collaboration request`;
      case 'ACCEPT_COLLABORATION':
        return `accepted collaboration`;
      case 'REJECT_COLLABORATION':
        return `rejected collaboration`;
      case 'COMPLETE_COLLABORATION':
        return `completed collaboration`;
      case 'SUBMIT_TASK':
        return `submitted task${targetName ? ` "${targetName}"` : ''}`;
      case 'APPROVE_TASK':
        return `approved task${targetName ? ` "${targetName}"` : ''}`;
      case 'CREATE_ANNOUNCEMENT':
        return `posted announcement${targetName ? ` "${targetName}"` : ''}`;
      case 'SEND_MESSAGE':
        return `sent a message`;
      case 'CREATE_CHAT':
        return `started a chat`;
      case 'BLOCK_USER':
        return `blocked user`;
      case 'UNBLOCK_USER':
        return `unblocked user`;
      case 'DELETE_USER':
        return `deleted user account`;
      default:
        // Format unknown actions nicely
        return log.action.toLowerCase().replace(/_/g, ' ');
    }
  };

  // Helper function to get entity type for badge color
  const getEntityType = (log) => {
    const action = log.action || '';
    if (action.includes('CAMPAIGN')) return 'campaign';
    if (action.includes('COLLABORATION')) return 'collaboration';
    if (action.includes('CONTRACT')) return 'contract';
    if (action.includes('REVIEW')) return 'review';
    if (action.includes('TASK')) return 'task';
    if (action.includes('ANNOUNCEMENT')) return 'announcement';
    if (action.includes('MESSAGE') || action.includes('CHAT')) return 'chat';
    if (action === 'LOGIN' || action === 'LOGOUT' || action === 'SIGNUP') return 'auth';
    if (action === 'CHANGE_ROLE' || action === 'BLOCK_USER' || action === 'UNBLOCK_USER' || action === 'DELETE_USER' || log.entity === 'User') return 'user';
    return 'system';
  };

  // Map recentLogs to activities format (from analytics)
  const logsArray = mappedAnalytics?.recentLogs || [];
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
        {/* Advanced Users by Role Chart */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Users by Role</h3>
              <p className="text-sm text-gray-400">Distribution of owners and influencers</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#C1B6FD]" />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#C1B6FD]/10 rounded-xl p-3 border border-[#C1B6FD]/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-[#C1B6FD]"></div>
                <span className="text-xs text-gray-400">Owners</span>
              </div>
              <p className="text-xl font-bold text-white">{ownersCount.toLocaleString()}</p>
              <p className="text-xs text-[#C1B6FD]">{ownersPercentage}% of total</p>
            </div>
            <div className="bg-[#745CB4]/10 rounded-xl p-3 border border-[#745CB4]/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-[#745CB4]"></div>
                <span className="text-xs text-gray-400">Influencers</span>
              </div>
              <p className="text-xl font-bold text-white">{influencersCount.toLocaleString()}</p>
              <p className="text-xs text-[#745CB4]">{influencersPercentage}% of total</p>
            </div>
          </div>

          {/* Doughnut Chart */}
          <div className="h-48 relative">
            <Doughnut data={userRoleDoughnutData} options={doughnutOptions} />
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-bold text-white">{totalRoleUsers.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Total Users</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#C1B6FD]"></div>
              <span className="text-sm text-gray-300">Owners ({ownersPercentage}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#745CB4]"></div>
              <span className="text-sm text-gray-300">Influencers ({influencersPercentage}%)</span>
            </div>
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
                  activity.type === 'contract' ? 'bg-yellow-500/20 text-yellow-400' :
                  activity.type === 'review' ? 'bg-pink-500/20 text-pink-400' :
                  activity.type === 'task' ? 'bg-orange-500/20 text-orange-400' :
                  activity.type === 'announcement' ? 'bg-indigo-500/20 text-indigo-400' :
                  activity.type === 'chat' ? 'bg-teal-500/20 text-teal-400' :
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
