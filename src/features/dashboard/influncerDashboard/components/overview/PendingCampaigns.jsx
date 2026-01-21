import { Search, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Available campaigns for influencer to explore
const availableCampaigns = [
  { 
    name: 'Spring Fashion Collection 2025', 
    brand: 'Fashion Brand Co.',
    payment: '$2,500',
    deadline: '2025-03-15',
    platforms: ['Instagram', 'TikTok'],
    status: 'Open',
    postedDate: '2 days ago'
  },
  { 
    name: 'Tech Product Launch', 
    brand: 'Tech Innovations',
    payment: '$5,000',
    deadline: '2025-02-28',
    platforms: ['YouTube'],
    status: 'Open',
    postedDate: '4 days ago'
  },
  { 
    name: 'Beauty Product Campaign', 
    brand: 'Beauty Essentials',
    payment: '$1,800',
    deadline: '2025-03-01',
    platforms: ['Instagram', 'TikTok'],
    status: 'Open',
    postedDate: '1 day ago'
  }
];

function PendingCampaigns() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Available Campaigns</h2>
        <Link 
          to="/dashboard/influencer/campaigns/overview"
          className="text-xs text-[#C1B6FD] hover:text-white font-medium transition-colors"
        >
          Explore All
        </Link>
      </div>
      
      <div className="space-y-3">
        {availableCampaigns.map((campaign, idx) => (
          <Link
            key={idx}
            to={`/dashboard/influencer/campaigns/${idx + 1}`}
            className="block bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm mb-0.5 truncate group-hover:text-[#C1B6FD] transition-colors">
                  {campaign.name}
                </h3>
                <p className="text-xs text-gray-400">{campaign.brand}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Payment</p>
                <p className="text-sm font-bold text-[#C1B6FD]">{campaign.payment}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Deadline</p>
                <p className="text-sm font-semibold text-white">{campaign.deadline}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex gap-1">
                {campaign.platforms.map((platform, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-300">
                    {platform}
                  </span>
                ))}
              </div>
              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full font-semibold">
                {campaign.status}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Link 
        to="/dashboard/influencer/campaigns/overview"
        className="block w-full mt-4 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 text-center"
      >
        Explore More Campaigns
      </Link>
    </div>
  );
}

export default PendingCampaigns;
