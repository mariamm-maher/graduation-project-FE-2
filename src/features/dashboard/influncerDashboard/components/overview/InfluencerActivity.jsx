import { MessageSquare, Mail, Send, CheckCircle2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

// Activities from influencer perspective
const myActivities = [
  { 
    campaign: 'Summer Fashion Launch', 
    brand: 'Fashion Brand Co.',
    action: 'Deliverable Submitted',
    type: 'completed',
    time: '2 hours ago',
    status: 'completed',
    icon: <CheckCircle2 className="w-4 h-4" />,
    avatar: '🏢',
    platform: 'Instagram Post'
  },
  { 
    campaign: 'Tech Product Review', 
    brand: 'Tech Innovations',
    action: 'New Message from Brand',
    type: 'pending',
    time: '5 hours ago',
    status: 'waiting',
    icon: <MessageSquare className="w-4 h-4" />,
    avatar: '💻',
    platform: 'Messages'
  },
  { 
    campaign: 'Fitness Challenge 2025', 
    brand: 'Fitness Pro',
    action: 'Payment Received',
    type: 'completed',
    time: '1 day ago',
    status: 'completed',
    icon: <CheckCircle2 className="w-4 h-4" />,
    avatar: '💪',
    platform: 'Payment'
  },
  { 
    campaign: 'Beauty Product Campaign', 
    brand: 'Beauty Essentials',
    action: 'Request Sent',
    type: 'pending',
    time: '2 days ago',
    status: 'waiting',
    icon: <Send className="w-4 h-4" />,
    avatar: '✨',
    platform: 'Application'
  },
  { 
    campaign: 'Luxury Watch Collection', 
    brand: 'Luxury Timepieces',
    action: 'Campaign Saved',
    type: 'saved',
    time: '3 days ago',
    status: 'saved',
    icon: <MessageSquare className="w-4 h-4" />,
    avatar: '⌚',
    platform: 'Saved'
  }
];

const statusConfig = {
  completed: { color: 'bg-green-500/20 text-green-400', badge: 'Done' },
  waiting: { color: 'bg-yellow-500/20 text-yellow-400', badge: 'Pending' },
  saved: { color: 'bg-blue-500/20 text-blue-400', badge: 'Saved' }
};

function InfluencerActivity() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">My Activity</h2>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-linear-to-b [&::-webkit-scrollbar-thumb]:from-[#C1B6FD] [&::-webkit-scrollbar-thumb]:to-[#745CB4] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-[#745CB4] [&::-webkit-scrollbar-thumb]:hover:to-[#C1B6FD]">
        {myActivities.map((activity, idx) => (
          <div 
            key={idx} 
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group"
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center text-2xl shadow-lg">
                  {activity.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1a1a2e] rounded-full flex items-center justify-center border-2 border-[#1a1a2e]">
                  {activity.icon}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-semibold text-white text-sm group-hover:text-[#C1B6FD] transition-colors">
                      {activity.campaign}
                    </h3>
                    <p className="text-xs text-gray-400">{activity.brand}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
                
                <p className="text-xs text-gray-300 mb-2">{activity.action}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 bg-white/5 rounded-full text-gray-400">
                    {activity.platform}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusConfig[activity.status].color}`}>
                    {statusConfig[activity.status].badge}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            {activity.status === 'waiting' && (
              <div className="mt-3 pt-3 border-t border-white/10 flex gap-2">
                <button className="flex-1 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg text-white text-xs font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                  View Details
                </button>
                <button className="px-3 py-2 bg-white/5 rounded-lg text-gray-400 text-xs font-semibold hover:bg-white/10 transition-all">
                  Later
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          to="/dashboard/influencer/collaborations"
          className="py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-sm font-medium text-gray-300 hover:border-purple-400/30 hover:bg-white/10 transition-all text-center"
        >
          <MessageSquare className="w-4 h-4 inline mr-1" />
          My Collaborations
        </Link>
        <Link
          to="/dashboard/influencer/campaigns/overview"
          className="py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-sm font-medium text-gray-300 hover:border-purple-400/30 hover:bg-white/10 transition-all text-center"
        >
          <Search className="w-4 h-4 inline mr-1" />
          Explore Campaigns
        </Link>
      </div>
    </div>
  );
}

export default InfluencerActivity;
