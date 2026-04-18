import { useMemo, useState } from 'react';
import {
  Search,
  MessageSquare,
  BookmarkCheck,
  Eye,
  Send,
  ChevronLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useInfluncerStore from '../../../../../stores/influncerStore';
import useSavedCampaignsStore from '../../../../../stores/savedCampaignsStore';

function SavedCampaigns() {
  const [searchQuery] = useState('');
  const [filter] = useState('all');

  const { applyToCampaign, applyingCampaignId } = useInfluncerStore();
  const { savedCampaigns, removeCampaign } = useSavedCampaignsStore();

  const getCampaignId = (campaign) => String(campaign?._id ?? campaign?.id ?? campaign?.campaignId ?? '');

  const filteredCampaigns = useMemo(() => {
    const normalizedCampaigns = Array.isArray(savedCampaigns) ? savedCampaigns : [];

    return normalizedCampaigns.filter((campaign) => {
      const campaignName = campaign?.name?.toLowerCase?.() || '';
      const brandName = campaign?.brand?.name?.toLowerCase?.() || '';
      const stage = campaign?.lifecycleStage?.toLowerCase?.() || '';

      const matchesSearch =
        campaignName.includes(searchQuery.toLowerCase()) ||
        brandName.includes(searchQuery.toLowerCase()) ||
        stage.includes(searchQuery.toLowerCase());

      const platforms = Array.isArray(campaign?.platforms)
        ? campaign.platforms.join(' ').toLowerCase()
        : '';

      const matchesFilter =
        filter === 'all' ||
        campaignName.includes(filter.toLowerCase()) ||
        brandName.includes(filter.toLowerCase()) ||
        platforms.includes(filter.toLowerCase());

      return matchesSearch && matchesFilter;
    });
  }, [savedCampaigns, searchQuery, filter]);

  const formatMoney = (value, currency) => {
    if (!value) return '-';
    return `${value.toLocaleString()} ${currency || ''}`.trim();
  };

  const formatDate = (value) => {
    if (!value) return 'TBD';
    return new Date(value).toLocaleDateString();
  };

  const handleRequestCampaign = async (campaignId) => {
    if (!campaignId) return;
    await applyToCampaign(campaignId, {});
  };

  const handleContactOwner = (campaignName) => {
    console.log('Contact owner for campaign:', campaignName);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/influencer/campaigns/overview"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white hover:bg-white/10 transition-all duration-200"
            title="Back to Explore"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
            <span className="font-medium">Back</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-0">Saved Campaigns</h1>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2.5 hover:border-[#C1B6FD]/30 transition-all duration-200">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">Saved</p>
          <p className="text-lg sm:text-xl font-bold text-[#C1B6FD] leading-none">{savedCampaigns.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        {filteredCampaigns.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300">
            No saved campaigns yet.
          </div>
        )}

        {filteredCampaigns.map((campaign) => {
          const campaignId = getCampaignId(campaign);

          return (
            <div
              key={campaignId || campaign.name}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-purple-400/30 transition-all group"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-[#C1B6FD] transition-colors">
                          {campaign.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${campaign.applied ? 'bg-[#745CB4]/20 text-[#C1B6FD]' : 'bg-green-500/20 text-green-400'}`}>
                          {campaign.applied ? 'Applied' : campaign.isPublished ? 'Open' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-1">Brand: {campaign.brand?.name || 'Unknown brand'}</p>
                      <p className="text-xs text-gray-500">
                        Start: {formatDate(campaign.startDate)} • End: {formatDate(campaign.endDate)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeCampaign(campaignId)}
                      className="p-2 rounded-lg transition-all bg-[#745CB4]/20 text-[#C1B6FD] hover:bg-[#745CB4]/30"
                      title="Remove from saved"
                    >
                      <BookmarkCheck className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">{campaign.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Budget</p>
                      <p className="text-sm font-bold text-[#C1B6FD]">
                        {formatMoney(campaign.budget?.total, campaign.budget?.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Stage</p>
                      <p className="text-sm font-bold text-white">{campaign.lifecycleStage || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Published</p>
                      <p className="text-sm font-bold text-white">{campaign.isPublished ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Status</p>
                      <p className="text-sm font-bold text-white">{campaign.applied ? 'Applied' : 'Not Applied'}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(campaign.platforms || []).map((platform, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/5 rounded-lg text-xs text-gray-300">
                        {platform}
                      </span>
                    ))}
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-400 mb-1">Campaign Overview</p>
                    <p className="text-sm text-white line-clamp-3">
                      {campaign.description || 'No additional details provided.'}
                    </p>
                  </div>
                </div>

                <div className="lg:w-48 flex flex-col gap-3">
                  <button
                    onClick={() => handleRequestCampaign(campaignId)}
                    disabled={campaign.applied || applyingCampaignId === campaignId}
                    className={`w-full px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${campaign.applied || applyingCampaignId === campaignId
                      ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                      : 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white hover:shadow-lg hover:shadow-purple-500/50'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    {campaign.applied ? 'Applied' : applyingCampaignId === campaignId ? 'Applying...' : 'Send Request'}
                  </button>
                  <button
                    onClick={() => handleContactOwner(campaign.name)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Contact Owner
                  </button>
                  <Link
                    to={`/dashboard/influencer/campaigns/${campaignId}`}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                  <div className="bg-white/5 rounded-lg p-3 mt-auto">
                    <p className="text-xs text-gray-400 mb-1">Campaign Owner</p>
                    <p className="text-sm font-semibold text-white">{campaign.brand?.name || 'Brand Owner'}</p>
                    <p className="text-xs text-gray-400">Brand profile</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SavedCampaigns;
