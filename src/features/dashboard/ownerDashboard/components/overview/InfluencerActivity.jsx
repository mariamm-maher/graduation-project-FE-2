import { MessageSquare, Mail, Send, CheckCircle2 } from 'lucide-react';

const statusConfig = {
  delivered: { color: 'bg-blue-500/20 text-blue-400', badge: 'Delivered' },
  completed: { color: 'bg-green-500/20 text-green-400', badge: 'Done' },
  waiting: { color: 'bg-yellow-500/20 text-yellow-400', badge: 'Pending' },
  scheduled: { color: 'bg-purple-500/20 text-purple-400', badge: 'Scheduled' },
  default: { color: 'bg-gray-500/20 text-gray-300', badge: 'Update' }
};

function getStatus(status = '') {
  const normalized = status.toLowerCase();
  if (statusConfig[normalized]) {
    return normalized;
  }
  if (normalized.includes('pending')) {
    return 'waiting';
  }
  if (normalized.includes('deliver')) {
    return 'delivered';
  }
  if (normalized.includes('complete')) {
    return 'completed';
  }
  if (normalized.includes('schedule')) {
    return 'scheduled';
  }
  return 'default';
}

function getActivityIcon(platform = '', action = '') {
  const platformLower = platform.toLowerCase();
  const actionLower = action.toLowerCase();

  if (platformLower.includes('mail') || actionLower.includes('email')) {
    return <Mail className="w-4 h-4" />;
  }
  if (actionLower.includes('sent') || actionLower.includes('follow')) {
    return <Send className="w-4 h-4" />;
  }
  if (actionLower.includes('sign') || actionLower.includes('approved')) {
    return <CheckCircle2 className="w-4 h-4" />;
  }

  return <MessageSquare className="w-4 h-4" />;
}

function toRelativeTime(occurredAt) {
  if (!occurredAt) {
    return 'Just now';
  }

  const now = Date.now();
  const then = new Date(occurredAt).getTime();
  const diffMinutes = Math.max(1, Math.floor((now - then) / (1000 * 60)));

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

function avatarFallback(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) {
    return 'U';
  }

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
}

function InfluencerActivity({ feed = [], loading }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Influencer Communications</h2>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-linear-to-b [&::-webkit-scrollbar-thumb]:from-[#C1B6FD] [&::-webkit-scrollbar-thumb]:to-[#745CB4] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-[#745CB4] [&::-webkit-scrollbar-thumb]:hover:to-[#C1B6FD]">
        {loading && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-xs text-gray-400">
            Loading communication updates...
          </div>
        )}

        {!loading && feed.length === 0 && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-sm text-gray-300">
            No communication activity yet.
          </div>
        )}

        {feed.map((activity) => {
          const normalizedStatus = getStatus(activity.status);
          const statusUI = statusConfig[normalizedStatus] || statusConfig.default;

          return (
          <div 
            key={activity.id} 
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group"
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center text-2xl shadow-lg">
                  {activity.influencer?.avatarUrl ? (
                    <img
                      src={activity.influencer.avatarUrl}
                      alt={activity.influencer?.name || 'Influencer avatar'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-white">{avatarFallback(activity.influencer?.name)}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1a1a2e] rounded-full flex items-center justify-center border-2 border-[#1a1a2e]">
                  {getActivityIcon(activity.platform, activity.action)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-white text-sm group-hover:text-[#C1B6FD] transition-colors">
                    {activity.influencer?.name || 'Unknown Influencer'}
                  </h3>
                  <span className="text-xs text-gray-500">{toRelativeTime(activity.occurredAt)}</span>
                </div>
                
                <p className="text-xs text-gray-400 mb-2">{activity.action}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 bg-white/5 rounded-full text-gray-400">
                    {activity.platform || 'General'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusUI.color}`}>
                    {statusUI.badge}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            {normalizedStatus === 'waiting' && (
              <div className="mt-3 pt-3 border-t border-white/10 flex gap-2">
                <button className="flex-1 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg text-white text-xs font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                  Respond Now
                </button>
                <button className="px-3 py-2 bg-white/5 rounded-lg text-gray-400 text-xs font-semibold hover:bg-white/10 transition-all">
                  Later
                </button>
              </div>
            )}
          </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-sm font-medium text-gray-300 hover:border-purple-400/30 hover:bg-white/10 transition-all">
          <MessageSquare className="w-4 h-4 inline mr-1" />
          Bulk Message
        </button>
        <button className="py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-sm font-medium text-gray-300 hover:border-purple-400/30 hover:bg-white/10 transition-all">
          <Send className="w-4 h-4 inline mr-1" />
          Auto Follow-up
        </button>
      </div>
    </div>
  );
}

export default InfluencerActivity;
