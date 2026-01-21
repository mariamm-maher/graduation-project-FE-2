import { TrendingUp, Users, MessageCircle, Target, BarChart3, Clock } from 'lucide-react';

const activeCampaigns = [
  {
    name: 'Summer Fashion Launch',
    brand: 'StyleCo',
    status: 'active',
    engagement: 12450,
    reach: '284K',
    influencers: 8,
    leadInfluencer: 'Sarah Johnson',
    budget: '$15K',
    progress: 75,
    timeline: '12 days left',
    performanceData: Array(24).fill(0).map((_, i) => ({ 
      value: Math.random() * 100,
      color: i % 3 === 0 ? '#C1B6FD' : i % 2 === 0 ? '#745CB4' : '#5D459D' 
    })),
    id: 'CMP-2024-001',
    tags: ['Fashion', 'Instagram', 'TikTok']
  },
  {
    name: 'Tech Product Review',
    brand: 'TechNova',
    status: 'paused',
    engagement: 8920,
    reach: '156K',
    influencers: 5,
    leadInfluencer: 'Alex Martinez',
    budget: '$8.5K',
    progress: 45,
    timeline: '8 days left',
    performanceData: Array(24).fill(0).map((_, i) => ({ 
      value: Math.random() * 80,
      color: i % 4 === 0 ? '#C1B6FD' : i % 3 === 0 ? '#745CB4' : '#5D459D' 
    })),
    id: 'CMP-2024-002',
    tags: ['Tech', 'YouTube', 'Review']
  },
  {
    name: 'Fitness Challenge Series',
    brand: 'FitLife Pro',
    status: 'active',
    engagement: 18750,
    reach: '425K',
    influencers: 12,
    leadInfluencer: 'Mike Chen',
    budget: '$22K',
    progress: 88,
    timeline: '5 days left',
    performanceData: Array(24).fill(0).map((_, i) => ({ 
      value: Math.random() * 120,
      color: i % 2 === 0 ? '#C1B6FD' : i % 3 === 0 ? '#745CB4' : '#5D459D' 
    })),
    id: 'CMP-2024-003',
    tags: ['Fitness', 'Multi-platform']
  }
];

function ActiveCampaignCards() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Active Campaigns</h2>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            {activeCampaigns.filter(c => c.status === 'active').length} Running
          </span>
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
            {activeCampaigns.filter(c => c.status === 'paused').length} Paused
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {activeCampaigns.map((campaign, idx) => (
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
                  {campaign.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{campaign.brand}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    campaign.status === 'active' 
                      ? 'bg-green-500/20 text-green-400 animate-pulse' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {campaign.status}
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
                <span className="text-lg font-bold text-white">{campaign.engagement.toLocaleString()}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="flex items-center gap-1 text-[#C1B6FD] mb-1">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="text-xs text-gray-400">Reach</span>
                </div>
                <span className="text-lg font-bold text-white">{campaign.reach}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-400">Campaign Progress</span>
                <span className="text-white font-semibold">{campaign.progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-full transition-all duration-500"
                  style={{ width: `${campaign.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Team & Budget */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C1B6FD]" />
                <span className="text-sm text-gray-300">{campaign.leadInfluencer}</span>
                <span className="bg-[#745CB4]/30 rounded-full px-2 py-0.5 text-xs font-semibold text-white">
                  +{campaign.influencers}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-400">{campaign.timeline}</span>
              </div>
            </div>

            {/* Performance Dots */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">24h Activity</span>
                <span className="text-xs font-semibold text-[#C1B6FD]">{campaign.budget}</span>
              </div>
              <div className="flex gap-1">
                {campaign.performanceData.map((dot, i) => (
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
              <span className="text-xs text-gray-500">{campaign.id}</span>
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
              {campaign.tags.map((tag, i) => (
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
