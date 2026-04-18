import { useEffect, useMemo, useState } from 'react';
import { 
  Search,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  Eye,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useInfluncerStore from '../../../../../stores/influncerStore';
import useSavedCampaignsStore from '../../../../../stores/savedCampaignsStore';

function CampaignsOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, fashion, tech, beauty

  const {
    exploreCampaigns,
    exploreCampaignsPagination,
    exploreCampaignsLoading,
    exploreCampaignsError,
    fetchExploreCampaigns,
    applyToCampaign,
    applyingCampaignId,
  } = useInfluncerStore();

  const {
    savedCampaigns,
    saveCampaign,
    removeCampaign,
    isCampaignSaved,
  } = useSavedCampaignsStore();

  const getCampaignId = (campaign) => String(campaign?._id ?? campaign?.id ?? campaign?.campaignId ?? '');

  useEffect(() => {
    fetchExploreCampaigns({ page: 1, limit: 20 });
  }, [fetchExploreCampaigns]);

  const normalizedCampaigns = useMemo(
    () => (Array.isArray(exploreCampaigns) ? exploreCampaigns : []),
    [exploreCampaigns]
  );

  const filteredCampaigns = normalizedCampaigns.filter((campaign) => {
    const campaignName = campaign?.name?.toLowerCase?.() || '';
    const brandName = campaign?.brand?.name?.toLowerCase?.() || '';
    const stage = campaign?.lifecycleStage?.toLowerCase?.() || '';

    const matchesSearch = campaignName.includes(searchQuery.toLowerCase()) ||
                         brandName.includes(searchQuery.toLowerCase()) ||
                         stage.includes(searchQuery.toLowerCase());
    const platforms = Array.isArray(campaign?.platforms) ? campaign.platforms.join(' ').toLowerCase() : '';
    const matchesFilter = filter === 'all' || campaignName.includes(filter.toLowerCase()) || brandName.includes(filter.toLowerCase()) || platforms.includes(filter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const formatMoney = (value, currency) => {
    if (!value) return '-';
    return `${value.toLocaleString()} ${currency || ''}`.trim();
  };

  const formatDate = (value) => {
    if (!value) return 'TBD';
    return new Date(value).toLocaleDateString();
  };

  const handleSaveCampaign = (campaign) => {
    const campaignId = getCampaignId(campaign);
    if (!campaignId) return;

    if (isCampaignSaved(campaignId)) {
      removeCampaign(campaignId);
      return;
    }

    saveCampaign({
      ...campaign,
      id: campaignId,
    });
  };

  const handleRequestCampaign = async (campaignId) => {
    await applyToCampaign(campaignId, {});
  };

  const handleContactOwner = (campaignName) => {
    console.log('Contact owner for campaign:', campaignName);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
        <div className="flex-1 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Explore Campaigns</h1>
          <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Discover and apply to available campaigns from brands</p>
          
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns, brands, categories..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'fashion', 'tech', 'beauty', 'fitness'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === cat
                      ? 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-400">Showing <span className="font-semibold text-white">{filteredCampaigns.length}</span> results</div>
        </div>
      </div>
      {/* Stats */}
      <div className="w-full flex justify-end">
        <Link
          to="/dashboard/influencer/campaigns/saved"
          className="inline-flex items-center justify-between gap-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#C1B6FD]" />
            <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-0">Saved</p>
          </div>
          <p className="text-lg sm:text-xl font-bold text-[#C1B6FD] leading-none">{savedCampaigns.length}</p>
        </Link>
      </div>

      {/* Available Campaigns List */}
      <div className="space-y-4">
        {exploreCampaignsError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">
            {exploreCampaignsError}
          </div>
        )}

        {exploreCampaignsLoading && (
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300">
            Loading campaigns...
          </div>
        )}

        {!exploreCampaignsLoading && !exploreCampaignsError && filteredCampaigns.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300">
            No campaigns found for current filters.
          </div>
        )}

        {filteredCampaigns.map((campaign) => {
          const campaignId = getCampaignId(campaign);
          const saved = isCampaignSaved(campaignId);

          return (
            <div
              key={campaignId || campaign.name}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-purple-400/30 transition-all group"
            >
              <div className="flex flex-col lg:flex-row gap-6">
              {/* Left: Campaign Info */}
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
                    <p className="text-xs text-gray-500">Start: {formatDate(campaign.startDate)} • End: {formatDate(campaign.endDate)}</p>
                  </div>
                  <button
                    onClick={() => handleSaveCampaign(campaign)}
                    className={`p-2 rounded-lg transition-all ${
                      saved
                        ? 'bg-[#745CB4]/20 text-[#C1B6FD]'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                    title={saved ? 'Remove from saved' : 'Save for later'}
                  >
                    {saved ? (
                      <BookmarkCheck className="w-5 h-5" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <p className="text-sm text-gray-300 mb-4 line-clamp-2">{campaign.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Budget</p>
                    <p className="text-sm font-bold text-[#C1B6FD]">{formatMoney(campaign.budget?.total, campaign.budget?.currency)}</p>
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
                  <p className="text-sm text-white line-clamp-3">{campaign.description || 'No additional details provided.'}</p>
                </div>
              </div>

              {/* Right: Actions */}
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

export default CampaignsOverview;
