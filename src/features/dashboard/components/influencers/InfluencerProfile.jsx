import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Mail,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Share2,
  Calendar,
  MapPin,
  Award,
  BarChart3,
  DollarSign,
  Target,
  CheckCircle,
  Image as ImageIcon,
  Video,
  Link as LinkIcon
} from 'lucide-react';

// Mock data - would come from API
const influencersData = {
  1: {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    niche: 'Fashion & Lifestyle',
    bio: 'Fashion enthusiast and lifestyle content creator. Sharing daily style inspiration, beauty tips, and sustainable fashion choices. Let\'s make fashion accessible and fun!',
    location: 'New York, USA',
    email: 'sarah@influencer.com',
    followers: 2400000,
    followersDisplay: '2.4M',
    engagement: 8.2,
    engagementDisplay: '8.2%',
    platform: 'instagram',
    platforms: [
      { name: 'Instagram', icon: Instagram, followers: '2.4M', handle: '@sarahjohnson', color: 'text-pink-400' },
      { name: 'YouTube', icon: Youtube, followers: '850K', handle: '@sarahjohnson', color: 'text-red-400' },
      { name: 'TikTok', icon: Video, followers: '1.2M', handle: '@sarahj', color: 'text-white' }
    ],
    campaigns: 3,
    revenue: '$45,200',
    rating: 4.9,
    totalRatings: 127,
    joinedDate: 'Jan 2025',
    verified: true,
    stats: {
      avgViews: '125K',
      avgLikes: '8.5K',
      avgComments: '420',
      reach: '1.8M',
      impressions: '4.2M'
    },
    portfolio: [
      {
        id: 1,
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
        title: 'Summer Collection Launch',
        brand: 'Fashion Brand',
        engagement: '12.5K',
        date: '2025-01-15'
      },
      {
        id: 2,
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
        title: 'Style Transformation',
        brand: 'Beauty Co',
        engagement: '18.2K',
        date: '2025-01-10'
      },
      {
        id: 3,
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
        title: 'Sustainable Fashion',
        brand: 'Eco Brand',
        engagement: '9.8K',
        date: '2025-01-05'
      },
      {
        id: 4,
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
        title: 'Morning Routine',
        brand: 'Lifestyle',
        engagement: '15.3K',
        date: '2024-12-28'
      },
      {
        id: 5,
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
        title: 'Holiday Collection',
        brand: 'Fashion Brand',
        engagement: '22.1K',
        date: '2024-12-20'
      },
      {
        id: 6,
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
        title: 'Product Review',
        brand: 'Tech Co',
        engagement: '11.7K',
        date: '2024-12-15'
      }
    ],
    achievements: [
      { title: 'Top Performer', description: 'Highest engagement rate this month', icon: Award },
      { title: '100K Milestone', description: 'Reached 100K followers in 3 months', icon: TrendingUp },
      { title: 'Brand Partner', description: 'Featured in 5 major campaigns', icon: CheckCircle }
    ],
    recentCampaigns: [
      { id: 1, name: 'Summer Fashion Launch', status: 'active', progress: 75 },
      { id: 2, name: 'Beauty Essentials', status: 'completed', progress: 100 },
      { id: 3, name: 'Lifestyle Collection', status: 'active', progress: 45 }
    ]
  },
  2: {
    id: 2,
    name: 'Mike Chen',
    avatar: 'MC',
    niche: 'Tech Reviews',
    bio: 'Tech enthusiast and reviewer. Breaking down the latest gadgets, software, and tech trends. Making technology accessible to everyone.',
    location: 'San Francisco, USA',
    email: 'mike@influencer.com',
    followers: 1800000,
    followersDisplay: '1.8M',
    engagement: 6.5,
    engagementDisplay: '6.5%',
    platform: 'youtube',
    platforms: [
      { name: 'YouTube', icon: Youtube, followers: '1.8M', handle: '@mikechen', color: 'text-red-400' },
      { name: 'Instagram', icon: Instagram, followers: '450K', handle: '@mikechen', color: 'text-pink-400' },
      { name: 'Twitter', icon: Twitter, followers: '320K', handle: '@mikechen', color: 'text-blue-400' }
    ],
    campaigns: 2,
    revenue: '$38,500',
    rating: 4.8,
    totalRatings: 89,
    joinedDate: 'Dec 2024',
    verified: true,
    stats: {
      avgViews: '250K',
      avgLikes: '12K',
      avgComments: '850',
      reach: '1.2M',
      impressions: '3.5M'
    },
    portfolio: [
      {
        id: 1,
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
        title: 'iPhone 15 Review',
        brand: 'Tech Brand',
        engagement: '45.2K',
        date: '2025-01-12'
      },
      {
        id: 2,
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
        title: 'Laptop Comparison',
        brand: 'Tech Co',
        engagement: '38.7K',
        date: '2025-01-08'
      }
    ],
    achievements: [
      { title: 'Tech Expert', description: 'Verified tech reviewer', icon: Award },
      { title: '1M Subscribers', description: 'Reached 1M on YouTube', icon: TrendingUp }
    ],
    recentCampaigns: [
      { id: 1, name: 'Tech Product Launch', status: 'active', progress: 60 }
    ]
  }
};

function InfluencerProfile() {
  const { influencerId } = useParams();
  const navigate = useNavigate();
  const influencer = influencersData[influencerId];

  if (!influencer) {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-12 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Influencer Not Found</h3>
          <p className="text-sm text-gray-400 mb-4">The influencer profile you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard/influencers/active')}
            className="px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Back to Influencers
          </button>
        </div>
      </div>
    );
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-400" />;
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-400" />;
      case 'facebook':
        return <Facebook className="w-5 h-5 text-blue-400" />;
      default:
        return <Share2 className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => navigate('/dashboard/influencers/active')}
          className="p-2 hover:bg-white/5 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
        <span className="text-sm text-gray-400">Back to Influencers</span>
      </motion.div>

      {/* Hero Section - Professional & Elegant Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative rounded-3xl overflow-hidden border border-white/10"
      >
        {/* Subtle Background - More Professional */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0933] via-[#2d1654] to-[#1a0933]"></div>
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#745CB4]/5 via-transparent to-[#C1B6FD]/5"></div>
        </div>

        <div className="relative z-10 p-8 lg:p-12 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Professional Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="relative"
            >
              {/* Subtle Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#C1B6FD]/20 via-[#745CB4]/20 to-[#C1B6FD]/20 rounded-3xl blur-xl"></div>
              <div className="relative w-36 h-36 lg:w-44 lg:h-44 rounded-3xl bg-gradient-to-br from-[#745CB4] via-[#5D459D] to-[#745CB4] flex items-center justify-center font-bold text-white text-4xl lg:text-5xl shadow-2xl border-2 border-white/10">
                {influencer.avatar}
              </div>
              {influencer.verified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="absolute -bottom-1 -right-1 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-4 border-[#1a0933] shadow-lg"
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </motion.div>

            {/* Professional Info Section */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 mb-4"
              >
                <h1 className="text-4xl lg:text-5xl font-bold text-white">
                  {influencer.name}
                </h1>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="opacity-80"
                >
                  {getPlatformIcon(influencer.platform)}
                </motion.div>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-300 mb-6 leading-relaxed max-w-2xl"
              >
                {influencer.bio}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center gap-4 text-sm mb-8"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:border-white/20 transition-all">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 font-medium">{influencer.location}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:border-white/20 transition-all">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 font-medium">Joined {influencer.joinedDate}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:border-white/20 transition-all">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-bold">{influencer.rating}</span>
                  <span className="text-gray-400">({influencer.totalRatings})</span>
                </div>
              </motion.div>

              {/* Professional Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(116, 92, 180, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Send Message
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Contact
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Premium Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {[
          { icon: Users, value: influencer.followersDisplay, label: 'Followers', color: 'from-[#C1B6FD] to-[#745CB4]', bgColor: 'bg-[#C1B6FD]/10' },
          { icon: TrendingUp, value: influencer.engagementDisplay, label: 'Engagement', color: 'from-green-400 to-emerald-500', bgColor: 'bg-green-500/10' },
          { icon: Eye, value: influencer.stats.avgViews, label: 'Avg Views', color: 'from-blue-400 to-cyan-500', bgColor: 'bg-blue-500/10' },
          { icon: Heart, value: influencer.stats.avgLikes, label: 'Avg Likes', color: 'from-pink-400 to-rose-500', bgColor: 'bg-pink-500/10' },
          { icon: Target, value: influencer.campaigns, label: 'Campaigns', color: 'from-yellow-400 to-orange-500', bgColor: 'bg-yellow-500/10' },
          { icon: DollarSign, value: influencer.revenue, label: 'Revenue', color: 'from-emerald-400 to-green-500', bgColor: 'bg-emerald-500/10' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity`}></div>
              <div className={`absolute inset-0 ${stat.bgColor} opacity-50`}></div>
              <div className="relative z-10 text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 mb-4 mx-auto"
                >
                  <Icon className={`w-7 h-7 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                </motion.div>
                <p className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-300 font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Portfolio */}
        <div className="lg:col-span-2 space-y-6">
          {/* Premium Portfolio Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Portfolio Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/3 to-transparent backdrop-blur-xl border border-white/10"></div>
            <div 
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`
              }}
            ></div>
            
            <div className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                    Creative Portfolio
                  </h2>
                  <p className="text-gray-400 text-sm">Showcasing {influencer.portfolio.length} amazing projects</p>
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <span className="text-sm font-semibold text-white">{influencer.portfolio.length} items</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {influencer.portfolio.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -8 }}
                    className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer"
                  >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 group-hover:from-black/80 transition-all"></div>
                    
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#745CB4]/30 via-[#C1B6FD]/20 to-[#5D459D]/30 group-hover:opacity-80 transition-opacity"></div>
                    
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                      style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '20px 20px'
                      }}
                    ></div>
                    
                    {/* Video Badge */}
                    {item.type === 'video' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="absolute top-4 right-4 z-20 w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl"
                      >
                        <Video className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform group-hover:translate-y-0 translate-y-2 transition-transform">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#C1B6FD] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-300 mb-3 font-medium">{item.brand}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                          <Heart className="w-4 h-4 text-pink-400" />
                          <span className="text-xs font-semibold text-white">{item.engagement}</span>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#C1B6FD]/0 via-[#C1B6FD]/20 to-[#C1B6FD]/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Premium Recent Campaigns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/3 to-transparent backdrop-blur-xl border border-white/10"></div>
            <div className="relative z-10 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Recent Campaigns</h2>
                  <p className="text-gray-400 text-sm">Active collaborations & performance</p>
                </div>
              </div>
              <div className="space-y-4">
                {influencer.recentCampaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="group relative rounded-2xl p-6 bg-gradient-to-r from-white/10 via-white/5 to-transparent border border-white/20 hover:border-[#C1B6FD]/50 transition-all backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#C1B6FD] transition-colors">
                        {campaign.name}
                      </h3>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${
                        campaign.status === 'active' 
                          ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-300 border border-green-500/50' 
                          : 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-300 border border-blue-500/50'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative">
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${campaign.progress}%` }}
                            transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                            className="h-full bg-gradient-to-r from-[#745CB4] via-[#C1B6FD] to-[#745CB4] rounded-full relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                          </motion.div>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-white min-w-[50px] text-right">{campaign.progress}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Premium Sidebar */}
        <div className="space-y-6">
          {/* Premium Platforms */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative rounded-3xl overflow-hidden lg:sticky lg:top-6"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/3 to-transparent backdrop-blur-xl border border-white/10"></div>
            <div className="relative z-10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Social Platforms</h3>
              </div>
              <div className="space-y-3">
                {influencer.platforms.map((platform, index) => {
                  const Icon = platform.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="group relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-white/10 via-white/5 to-transparent border border-white/20 hover:border-[#C1B6FD]/50 transition-all backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color.includes('pink') ? 'from-pink-500/20 to-rose-500/20' : platform.color.includes('red') ? 'from-red-500/20 to-orange-500/20' : 'from-blue-500/20 to-cyan-500/20'} flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform`}>
                            <Icon className={`w-6 h-6 ${platform.color}`} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-[#C1B6FD] transition-colors">{platform.name}</p>
                            <p className="text-xs text-gray-400 font-medium">{platform.handle}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-full">{platform.followers}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Premium Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/3 to-transparent backdrop-blur-xl border border-white/10"></div>
            <div className="relative z-10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/30">
                  <Award className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Achievements</h3>
              </div>
              <div className="space-y-3">
                {influencer.achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-white/10 via-white/5 to-transparent border border-white/20 hover:border-yellow-500/50 transition-all backdrop-blur-sm"
                    >
                      <div className="flex items-start gap-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/30 flex-shrink-0"
                        >
                          <Icon className="w-6 h-6 text-yellow-400" />
                        </motion.div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">{achievement.title}</p>
                          <p className="text-xs text-gray-400 leading-relaxed">{achievement.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default InfluencerProfile;

