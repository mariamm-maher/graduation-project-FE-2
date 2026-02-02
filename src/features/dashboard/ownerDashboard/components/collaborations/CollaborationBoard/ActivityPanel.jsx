import { History, User, MessageSquare, CheckCircle, UserPlus, Tag } from 'lucide-react';

function ActivityPanel({ activities = [] }) {
  const getActivityIcon = (type) => {
    const icons = {
      status_change: CheckCircle,
      comment: MessageSquare,
      assigned: UserPlus,
      created: Tag,
      updated: Tag,
    };
    const Icon = icons[type] || User;
    return Icon;
  };

  const getActivityColor = (type) => {
    const colors = {
      status_change: 'text-green-400 bg-green-500/20',
      comment: 'text-blue-400 bg-blue-500/20',
      assigned: 'text-purple-400 bg-purple-500/20',
      created: 'text-yellow-400 bg-yellow-500/20',
      updated: 'text-cyan-400 bg-cyan-500/20',
    };
    return colors[type] || 'text-gray-400 bg-gray-500/20';
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <History className="w-5 h-5 text-purple-400" />
        <h3 className="font-semibold text-white">Recent Activity</h3>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex gap-3 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-gray-400"> {activity.action}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
          </div>
        )}
      </div>

      {/* View All Link */}
      {activities.length > 0 && (
        <button className="w-full mt-4 pt-4 border-t border-white/10 text-sm text-purple-400 hover:text-purple-300 transition-colors">
          View all activity →
        </button>
      )}
    </div>
  );
}

export default ActivityPanel;
