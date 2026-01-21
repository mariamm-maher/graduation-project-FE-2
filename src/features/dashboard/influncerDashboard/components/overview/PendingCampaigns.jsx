import { Sparkles, Clock, Zap } from 'lucide-react';

const pendingCampaigns = [
  { 
    name: 'Holiday Gift Guide Campaign', 
    brand: 'LuxeGoods',
    status: 'AI Generating',
    estimatedTime: '2 min',
    icon: <Sparkles className="w-5 h-5" />
  },
  { 
    name: 'Eco-Friendly Product Launch', 
    brand: 'GreenEarth',
    status: 'Approval Pending',
    estimatedTime: '1 day',
    icon: <Clock className="w-5 h-5" />
  },
  { 
    name: 'Gaming Tournament Sponsorship', 
    brand: 'GamersHub',
    status: 'Ready to Launch',
    estimatedTime: 'Now',
    icon: <Zap className="w-5 h-5" />
  }
];

function PendingCampaigns() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Pending Campaigns</h2>
        <button className="text-xs text-[#C1B6FD] hover:text-white font-medium transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {pendingCampaigns.map((campaign, idx) => (
          <div 
            key={idx} 
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                {campaign.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm mb-0.5 truncate group-hover:text-[#C1B6FD] transition-colors">
                  {campaign.name}
                </h3>
                <p className="text-xs text-gray-400">{campaign.brand}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <span className="text-xs text-gray-400">{campaign.status}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C1B6FD] animate-pulse"></div>
                <span className="text-xs font-semibold text-[#C1B6FD]">{campaign.estimatedTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
        + Create New Campaign
      </button>
    </div>
  );
}

export default PendingCampaigns;
