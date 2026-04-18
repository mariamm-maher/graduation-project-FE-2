import { Sparkles, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function resolveCampaignId(campaign = {}) {
  return campaign?.id || campaign?.campaignId || campaign?._id || null;
}

function getStatusIcon(status = '') {
  const normalized = status.toLowerCase();

  if (normalized.includes('approval') || normalized.includes('pending')) {
    return <Clock className="w-5 h-5" />;
  }
  if (normalized.includes('ready') || normalized.includes('launch')) {
    return <Zap className="w-5 h-5" />;
  }

  return <Sparkles className="w-5 h-5" />;
}

function PendingCampaigns({ campaigns = [], loading }) {
  const navigate = useNavigate();

  const openCampaign = (campaign) => {
    const campaignId = resolveCampaignId(campaign);
    if (!campaignId) return;
    navigate(`/dashboard/owner/campaigns/${campaignId}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Pending Campaigns</h2>
        <button
          onClick={() => navigate('/dashboard/owner/campaigns/all')}
          className="text-xs text-[#C1B6FD] hover:text-white font-medium transition-colors"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {loading && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-xs text-gray-400">
            Loading pending campaigns...
          </div>
        )}

        {!loading && campaigns.length === 0 && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-sm text-gray-300">
            No pending campaigns right now.
          </div>
        )}

        {campaigns.map((campaign) => (
          <div 
            key={campaign.id} 
            onClick={() => openCampaign(campaign)}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                {getStatusIcon(campaign.status)}
              </div>
              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    openCampaign(campaign);
                  }}
                  disabled={!resolveCampaignId(campaign)}
                  className="font-semibold text-white text-sm mb-0.5 truncate group-hover:text-[#C1B6FD] transition-colors hover:underline disabled:opacity-70 disabled:cursor-not-allowed text-left"
                  title={resolveCampaignId(campaign) ? 'Open campaign details' : 'Campaign id unavailable'}
                >
                  {campaign.name}
                </button>
                <p className="text-xs text-gray-400">{campaign.brand}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <span className="text-xs text-gray-400">{campaign.status || 'Pending'}</span>
             
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/dashboard/owner/campaigns/create')}
        className="w-full mt-4 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
      >
        + Create New Campaign
      </button>
    </div>
  );
}

export default PendingCampaigns;
