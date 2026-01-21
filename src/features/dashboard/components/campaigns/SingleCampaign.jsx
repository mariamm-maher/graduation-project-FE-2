import { useParams } from 'react-router-dom';
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
  Facebook
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCampaignById } from './campaignsData';

function SingleCampaign() {
  const { campaignId } = useParams();
  
  // Fetch campaign data from shared data source
  const campaign = getCampaignById(campaignId);

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
          <Link
            to="/dashboard/campaigns"
            className="p-2 hover:bg-white/5 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
          </Link>
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
              <Link
                to="/dashboard/campaigns"
                className="inline-block px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Back to Campaigns
              </Link>
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
        <Link
          to="/dashboard/campaigns"
          className="p-2 hover:bg-white/5 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{campaign.name}</h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">{campaign.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {campaign.status === 'active' && (
            <span className="px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full text-xs font-semibold text-green-400 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              Active
            </span>
          )}
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
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 border border-[#C1B6FD]/30 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Budget</p>
              <p className="text-sm font-semibold text-white">{campaign.budget}</p>
              <p className="text-xs text-gray-500">Spent: {campaign.spent}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 border border-[#C1B6FD]/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Influencers</p>
              <p className="text-sm font-semibold text-white">{campaign.influencers.length} Active</p>
              <p className="text-xs text-gray-500">{campaign.collaborationStatus.total} Total</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 border border-[#C1B6FD]/30 flex items-center justify-center">
              <Target className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Progress</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${campaign.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD]"
                  />
                </div>
                <span className="text-xs font-semibold text-white">{campaign.progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#C1B6FD]" />
            Campaign Metrics
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">Reach</p>
            <p className="text-lg font-bold text-white">{campaign.metrics.reach}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">Impressions</p>
            <p className="text-lg font-bold text-white">{campaign.metrics.impressions}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">Engagement</p>
            <p className="text-lg font-bold text-[#C1B6FD]">{campaign.metrics.engagement}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">Clicks</p>
            <p className="text-lg font-bold text-white">{campaign.metrics.clicks}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">Conversions</p>
            <p className="text-lg font-bold text-white">{campaign.metrics.conversions}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">Revenue</p>
            <p className="text-lg font-bold text-green-400">{campaign.metrics.revenue}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-[#C1B6FD]" />
            Campaign Timeline
          </h2>
          <div className="space-y-4">
            {campaign.timeline.map((item, index) => (
              <div key={item.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'completed' ? 'bg-green-400' :
                    item.status === 'in_progress' ? 'bg-yellow-400' :
                    'bg-gray-500'
                  }`} />
                  {index < campaign.timeline.length - 1 && (
                    <div className={`w-0.5 flex-1 ${
                      item.status === 'completed' ? 'bg-green-400/30' : 'bg-gray-500/30'
                    }`} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{item.date}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Influencers Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#C1B6FD]" />
              Influencers
            </h2>
            <Link
              to="/dashboard/influencers"
              className="text-sm text-[#C1B6FD] hover:text-white transition-all"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {campaign.influencerList?.map((influencer) => (
              <div
                key={influencer.id}
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center font-bold text-white">
                    {influencer.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">{influencer.name}</h3>
                      {getPlatformIcon(influencer.platform)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{influencer.followers} followers</span>
                      <span>•</span>
                      <span>{influencer.posts} posts</span>
                      <span>•</span>
                      <span>{influencer.engagement} engagement</span>
                    </div>
                  </div>
                  {getStatusBadge(influencer.status)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Collaboration Status Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
          <MessageSquare className="w-5 h-5 text-[#C1B6FD]" />
          Collaboration Status
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
            <p className="text-2xl font-bold text-white mb-1">{campaign.collaborationStatus.total}</p>
            <p className="text-xs text-gray-400">Total Collaborations</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20 text-center">
            <p className="text-2xl font-bold text-green-400 mb-1">{campaign.collaborationStatus.active}</p>
            <p className="text-xs text-gray-400">Active</p>
          </div>
          <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20 text-center">
            <p className="text-2xl font-bold text-yellow-400 mb-1">{campaign.collaborationStatus.pending}</p>
            <p className="text-xs text-gray-400">Pending</p>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20 text-center">
            <p className="text-2xl font-bold text-blue-400 mb-1">{campaign.collaborationStatus.completed}</p>
            <p className="text-xs text-gray-400">Completed</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SingleCampaign;

