import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Target, 
  AlertCircle,
  MessageSquare,
  Share2,
  Send,
  Bookmark,
  BookmarkCheck,
  Mail
} from 'lucide-react';
import { useEffect, useState } from 'react';
import useInfluncerStore from '../../../../../stores/influncerStore';

function SingleCampaign() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const {
    selectedCampaign,
    selectedCampaignLoading,
    selectedCampaignError,
    fetchCampaignById,
    applyToCampaign,
    applyingCampaignId,
  } = useInfluncerStore();

  useEffect(() => {
    if (campaignId) {
      fetchCampaignById(campaignId);
    }
  }, [campaignId, fetchCampaignById]);

  const campaign = selectedCampaign;

  const formatDate = (value) => {
    if (!value) return 'TBD';
    return new Date(value).toLocaleDateString();
  };

  const formatMoney = (value, currency) => {
    if (value === undefined || value === null) return '-';
    return `${Number(value).toLocaleString()} ${currency || ''}`.trim();
  };

  const handleApply = async () => {
    if (!campaign?.id) return;
    await applyToCampaign(campaign.id, {});
  };

  if (selectedCampaignLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-sm text-gray-300">
        Loading campaign details...
      </div>
    );
  }

  if (selectedCampaignError) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/influencer/campaigns/overview')}
            className="p-2 hover:bg-white/5 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">
          {selectedCampaignError}
        </div>
      </div>
    );
  }

  // Campaign not found fallback
  if (!campaign) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-4"
        >
          <button
            onClick={() => navigate('/dashboard/influencer/campaigns/overview')}
            className="p-2 hover:bg-white/5 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-12 text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Campaign Not Found</h3>
              <p className="text-sm text-gray-400 mb-4">
                The campaign with ID "{campaignId}" does not exist.
              </p>
              <button
                onClick={() => navigate('/dashboard/influencer/campaigns/overview')}
                className="inline-block px-6 py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Back to Campaigns
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Back Button & Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => navigate('/dashboard/influencer/campaigns/overview')}
          className="p-2 hover:bg-white/5 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{campaign.name}</h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">{campaign.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-2 rounded-lg transition-all ${
              isSaved
                ? 'bg-[#745CB4]/20 text-[#C1B6FD]'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save for later'}
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
            campaign.applied || isSaved
              ? 'bg-[#745CB4]/20 text-[#C1B6FD]'
              : 'bg-green-500/20 text-green-400'
          }`}>
            {campaign.applied || isSaved ? 'Saved' : campaign.isPublished ? 'Open' : 'Draft'}
          </span>
        </div>
      </motion.div>

      {/* Campaign Header - Key Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 border border-[#C1B6FD]/30 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Duration</p>
              <p className="text-sm font-semibold text-white">{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</p>
              <p className="text-xs text-gray-500">Stage: {campaign.lifecycleStage || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 border border-[#C1B6FD]/30 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Budget</p>
              <p className="text-sm font-semibold text-[#C1B6FD]">{formatMoney(campaign.budget?.total, campaign.budget?.currency)}</p>
              <p className="text-xs text-gray-500">Currency: {campaign.budget?.currency || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 border border-[#C1B6FD]/30 flex items-center justify-center">
              <Target className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Application</p>
              <p className="text-sm font-semibold text-white">{campaign.applied ? 'Applied' : 'Not applied'}</p>
              <p className="text-xs text-gray-500">Published: {campaign.isPublished ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 border border-[#C1B6FD]/30 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Platforms</p>
              <div className="flex flex-wrap gap-1">
                {(campaign.platforms || []).map((platform, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-300">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <button
          onClick={handleApply}
          disabled={campaign.applied || applyingCampaignId === campaign.id}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${campaign.applied || applyingCampaignId === campaign.id
            ? 'bg-white/10 text-gray-400 cursor-not-allowed'
            : 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white hover:shadow-lg hover:shadow-purple-500/50'
          }`}
        >
          <Send className="w-5 h-5" />
          {campaign.applied ? 'Applied' : applyingCampaignId === campaign.id ? 'Applying...' : 'Send Request'}
        </button>
        <button
          onClick={() => {
            navigate(`/dashboard/influencer/collaborations/messages?owner=${campaign.brand?.name || 'brand'}`);
          }}
          className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          Contact Owner
        </button>
        <button
          onClick={() => setIsSaved(!isSaved)}
          className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            isSaved
              ? 'bg-[#745CB4]/20 border border-[#745CB4]/30 text-[#C1B6FD]'
              : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
          }`}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="w-5 h-5" />
              Saved
            </>
          ) : (
            <>
              <Bookmark className="w-5 h-5" />
              Save for Later
            </>
          )}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-[#C1B6FD]" />
          Campaign Details
        </h2>
        <p className="text-sm text-gray-300">{campaign.description || 'No campaign description provided.'}</p>
      </motion.div>

      {/* Brand Owner Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
          <Mail className="w-5 h-5 text-[#C1B6FD]" />
          Campaign Owner
        </h2>
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-lg font-semibold text-white mb-1">{campaign.brand?.name || 'Brand Owner'}</p>
          <p className="text-sm text-gray-400 mb-3">Brand ID: {campaign.brand?.id || 'N/A'}</p>
          <p className="text-sm text-gray-300 mb-2">Campaign ID: {campaign.id}</p>
          <p className="text-sm text-gray-300">Lifecycle: {campaign.lifecycleStage || 'N/A'}</p>
        </div>
      </motion.div>

    </div>
  );
}

export default SingleCampaign;

