import { Link } from 'react-router-dom';
import { Megaphone, Users, DollarSign, Share2, Sparkles, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';

function RecentActivityFeed({ activities, loading }) {
  const getIcon = (title) => {
    const titleLower = title?.toLowerCase() || '';
    if (titleLower.includes('campaign')) return Megaphone;
    if (titleLower.includes('influencer') || titleLower.includes('contract')) return Users;
    if (titleLower.includes('budget') || titleLower.includes('spent')) return DollarSign;
    if (titleLower.includes('channel')) return Share2;
    if (titleLower.includes('ai') || titleLower.includes('task')) return Sparkles;
    if (titleLower.includes('signed') || titleLower.includes('approved')) return CheckCircle;
    return FileText;
  };

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    const colors = {
      read: 'text-gray-400',
      unread: 'text-[#C1B6FD]',
      completed: 'text-green-400',
      pending: 'text-yellow-400',
      failed: 'text-red-400',
      in_progress: 'text-blue-400',
    };
    return colors[status?.toLowerCase()] || 'text-gray-400';
  };

  const getStatusDot = (status) => {
    if (status === 'unread') return <div className="w-2 h-2 rounded-full bg-[#C1B6FD]" />;
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-white/10 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayActivities = activities?.slice(0, 10) || [];

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      
      <div className="space-y-5">
        {displayActivities.length > 0 ? (
          displayActivities.map((activity, index) => {
            const Icon = getIcon(activity.title);
            return (
              <div key={activity.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#745CB4]/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#C1B6FD]" />
                  </div>
                  {index < displayActivities.length - 1 && (
                    <div className="w-0.5 flex-1 bg-white/10 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{activity.title}</p>
                        {getStatusDot(activity.status)}
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{activity.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{getRelativeTime(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-sm text-center py-8">No recent activity</p>
        )}
      </div>

      {activities?.length > 10 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <Link
            to="/dashboard/owner/activity"
            className="text-[#C1B6FD] text-sm font-medium hover:text-[#A89AF0] transition-colors"
          >
            View all activity →
          </Link>
        </div>
      )}
    </div>
  );
}

export default RecentActivityFeed;
