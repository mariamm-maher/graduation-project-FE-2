import { TrendingUp, Users, MessageCircle, Target, BarChart3, Clock } from 'lucide-react';

// Active collaborations from influencer perspective
const activeCollaborations = [
  {
    name: 'Summer Fashion Launch',
    brand: 'Fashion Brand Co.',
    brandContact: 'John Smith',
    status: 'active',
    engagement: 12450,
    reach: '284K',
    earnings: '$2,500',
    deliverables: { completed: 3, total: 4 },
    progress: 75,
    deadline: '12 days left',
    platforms: ['Instagram', 'TikTok'],
    performanceData: Array(24).fill(0).map((_, i) => ({ 
      value: Math.random() * 100,
      color: i % 3 === 0 ? '#C1B6FD' : i % 2 === 0 ? '#745CB4' : '#5D459D' 
    })),
    id: 'COL-2024-001',
    tags: ['Fashion', 'Instagram', 'TikTok']
  },
  {
    name: 'Tech Product Review',
    brand: 'Tech Innovations',
    brandContact: 'Sarah Williams',
    status: 'active',
    engagement: 8920,
    reach: '156K',
    earnings: '$3,000',
    deliverables: { completed: 1, total: 3 },
    progress: 45,
    deadline: '8 days left',
    platforms: ['YouTube'],
    performanceData: Array(24).fill(0).map((_, i) => ({ 
      value: Math.random() * 80,
      color: i % 4 === 0 ? '#C1B6FD' : i % 3 === 0 ? '#745CB4' : '#5D459D' 
    })),
    id: 'COL-2024-002',
    tags: ['Tech', 'YouTube', 'Review']
  },
  {
    name: 'Fitness Challenge 2025',
    brand: 'Fitness Pro',
    brandContact: 'Mike Johnson',
    status: 'active',
    engagement: 18750,
    reach: '425K',
    earnings: '$2,800',
    deliverables: { completed: 5, total: 6 },
    progress: 88,
    deadline: '5 days left',
    platforms: ['Instagram', 'TikTok'],
    performanceData: Array(24).fill(0).map((_, i) => ({ 
      value: Math.random() * 120,
      color: i % 2 === 0 ? '#C1B6FD' : i % 3 === 0 ? '#745CB4' : '#5D459D' 
    })),
    id: 'COL-2024-003',
    tags: ['Fitness', 'Multi-platform']
  }
];

function ActiveCampaignCards() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">My Active Collaborations</h2>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            {activeCollaborations.filter(c => c.status === 'active').length} Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {activeCollaborations.map((collab, idx) => (
          <div 
            key={idx} 
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group"
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center text-2xl shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white mb-1 truncate group-hover:text-[#C1B6FD] transition-colors">
                  {collab.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{collab.brand}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    collab.status === 'active' 
                      ? 'bg-green-500/20 text-green-400 animate-pulse' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {collab.status}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="flex items-center gap-1 text-[#C1B6FD] mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-xs text-gray-400">Engagement</span>
                </div>
                <span className="text-lg font-bold text-white">{collab.engagement.toLocaleString()}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="flex items-center gap-1 text-[#C1B6FD] mb-1">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="text-xs text-gray-400">Reach</span>
                </div>
                <span className="text-lg font-bold text-white">{collab.reach}</span>
              </div>
            </div>

            {/* Deliverables Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-400">Deliverables</span>
                <span className="text-white font-semibold">{collab.deliverables.completed}/{collab.deliverables.total}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-full transition-all duration-500"
                  style={{ width: `${collab.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Brand & Earnings */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C1B6FD]" />
                <span className="text-sm text-gray-300">{collab.brandContact}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[#C1B6FD]">{collab.earnings}</div>
                <div className="text-xs text-gray-400">Earnings</div>
              </div>
            </div>

            {/* Performance Dots */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">24h Activity</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">{collab.deadline}</span>
                </div>
              </div>
              <div className="flex gap-1">
                {collab.performanceData.map((dot, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      backgroundColor: dot.color,
                      height: `${Math.max(8, (dot.value / 100) * 20)}px`
                    }}
                    className="flex-1 rounded-sm transition-all duration-300 hover:opacity-75"
                  ></div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{collab.id}</span>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {collab.tags.map((tag, i) => (
                <span 
                  key={i}
                  className="px-2 py-1 bg-[#745CB4]/20 text-[#C1B6FD] rounded text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveCampaignCards;
