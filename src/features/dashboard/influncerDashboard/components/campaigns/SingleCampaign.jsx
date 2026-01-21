import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Target, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Share2,
  Instagram,
  Youtube,
  Facebook,
  Send,
  Bookmark,
  BookmarkCheck,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getExploreCampaignById } from './exploreCampaignsData';
import { useState } from 'react';

function SingleCampaign() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  
  // Fetch campaign data from explore campaigns
  const campaign = getExploreCampaignById(campaignId);

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
                className="inline-block px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Back to Campaigns
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-400" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-400" />;
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-400" />;
      default:
        return <Share2 className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs font-semibold text-green-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs font-semibold text-yellow-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            In Progress
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full text-xs font-semibold text-gray-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

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
            campaign.status === 'saved' || isSaved
              ? 'bg-[#745CB4]/20 text-[#C1B6FD]'
              : 'bg-green-500/20 text-green-400'
          }`}>
            {campaign.status === 'saved' || isSaved ? 'Saved' : 'Open'}
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
              <p className="text-sm font-semibold text-white">{campaign.startDate} - {campaign.endDate}</p>
              <p className="text-xs text-gray-500">Deadline: {campaign.deadline}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 border border-[#C1B6FD]/30 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Payment</p>
              <p className="text-sm font-semibold text-[#C1B6FD]">{campaign.paymentPerPost}</p>
              <p className="text-xs text-gray-500">Total Budget: {campaign.budget}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 border border-[#C1B6FD]/30 flex items-center justify-center">
              <Target className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Deliverables</p>
              <p className="text-sm font-semibold text-white">{campaign.deliverables} posts</p>
              <p className="text-xs text-gray-500">Expected Reach: {campaign.expectedReach}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 border border-[#C1B6FD]/30 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Platforms</p>
              <div className="flex flex-wrap gap-1">
                {campaign.platforms.map((platform, idx) => (
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
          onClick={() => {
            alert('Request sent! The campaign owner will review your application.');
          }}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          Send Request
        </button>
        <button
          onClick={() => {
            // Navigate to messages or open chat
            navigate(`/dashboard/influencer/collaborations/messages?owner=${campaign.ownerEmail}`);
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

      {/* Campaign Details */}
      {campaign.campaignDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-[#C1B6FD]" />
            Campaign Details
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">Objectives</h3>
              <p className="text-sm text-gray-300 mb-4">{campaign.campaignDetails.objectives}</p>
              
              <h3 className="text-sm font-semibold text-white mb-2">Target Audience</h3>
              <p className="text-sm text-gray-300 mb-4">{campaign.campaignDetails.targetAudience}</p>
              
              <h3 className="text-sm font-semibold text-white mb-2">Content Guidelines</h3>
              <p className="text-sm text-gray-300">{campaign.campaignDetails.contentGuidelines}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">Hashtags</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {campaign.campaignDetails.hashtags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#745CB4]/20 text-[#C1B6FD] rounded-lg text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              
              <h3 className="text-sm font-semibold text-white mb-2">Payment Terms</h3>
              <p className="text-sm text-gray-300 mb-4">{campaign.campaignDetails.paymentTerms}</p>
              
              <h3 className="text-sm font-semibold text-white mb-2">Exclusivity</h3>
              <p className="text-sm text-gray-300">{campaign.campaignDetails.exclusivity}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Deliverables */}
      {campaign.campaignDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <CheckCircle className="w-5 h-5 text-[#C1B6FD]" />
            Deliverables
          </h2>
          <div className="space-y-3">
            {campaign.campaignDetails.deliverables.map((deliverable, idx) => (
              <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{deliverable.type}</p>
                    <p className="text-xs text-gray-400">Count: {deliverable.count}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Deadline</p>
                    <p className="text-sm font-semibold text-white">{deliverable.deadline}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

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
          <p className="text-lg font-semibold text-white mb-1">{campaign.owner}</p>
          <p className="text-sm text-gray-400 mb-3">{campaign.ownerEmail}</p>
          <p className="text-sm text-gray-300 mb-2">Brand: {campaign.brand}</p>
          <p className="text-sm text-gray-300">Category: {campaign.category}</p>
        </div>
      </motion.div>

    </div>
  );
}

export default SingleCampaign;

