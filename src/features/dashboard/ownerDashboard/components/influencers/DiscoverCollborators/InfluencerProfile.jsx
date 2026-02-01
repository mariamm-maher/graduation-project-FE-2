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

// Mock data - would come from API/Database based on InfluencerProfile schema
const influencersData = {
  4: {
    id: 4,
    userId: 104,
    name: 'Alex Rivera',
    bio: 'Fitness enthusiast and sports content creator. Helping people achieve their fitness goals through dedicated training, nutrition tips, and motivational content. Let\'s get stronger together!',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop',
    location: 'Los Angeles, CA',
    isCompleted: true,
    socialMediaLinks: {
      instagram: 'https://instagram.com/alexrivera',
      youtube: 'https://youtube.com/@alexrivera',
      tiktok: 'https://tiktok.com/@alexrivera'
    },
    primaryPlatform: 'Instagram',
    followersCount: 890000,
    followersDisplay: '890K',
    engagementRate: 7.8,
    engagementDisplay: '7.8%',
    categories: ['Fitness & Sports', 'Wellness', 'Lifestyle'],
    contentTypes: ['Reels', 'Stories', 'Posts'],
    collaborationTypes: ['Sponsored Posts', 'Product Reviews', 'Brand Ambassador'],
    audienceAgeRange: '18-34',
    audienceGender: '60% Male, 40% Female',
    audienceLocation: 'USA (65%), Canada (15%), UK (10%)',
    interests: ['Fitness', 'Nutrition', 'Sports', 'Health', 'Motivation'],
    completionPercentage: 100,
    isOnboarded: true,
    rating: 4.7,
    totalRatings: 95,
    joinedDate: 'Jan 2025',
    verified: true,
    campaigns: 5,
    revenue: '$52,800',
    stats: {
      avgViews: '125K',
      avgLikes: '9.8K',
      avgComments: '385',
      reach: '980K',
      impressions: '2.8M'
    },
    platforms: [
      { name: 'Instagram', icon: Instagram, followers: '890K', handle: '@alexrivera', color: 'text-pink-400' },
      { name: 'YouTube', icon: Youtube, followers: '320K', handle: '@alexrivera', color: 'text-red-400' },
      { name: 'TikTok', icon: Video, followers: '450K', handle: '@alexrivera', color: 'text-white' }
    ],
    portfolio: [
      {
        id: 1,
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
        title: 'Home Workout Series',
        brand: 'Fitness Brand',
        engagement: '15.2K',
        date: '2025-01-20'
      },
      {
        id: 2,
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        title: 'Supplement Review',
        brand: 'NutritionCo',
        engagement: '11.8K',
        date: '2025-01-15'
      },
      {
        id: 3,
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        title: 'Training Gear Review',
        brand: 'SportTech',
        engagement: '18.5K',
        date: '2025-01-10'
      }
    ],
    achievements: [
      { title: 'Top Fitness Creator', description: '890K followers milestone', icon: Award },
      { title: 'High Engagement', description: '7.8% engagement rate', icon: TrendingUp },
      { title: 'Brand Partner', description: 'Completed 5 campaigns', icon: CheckCircle }
    ],
    recentCampaigns: [
      { id: 1, name: 'Protein Powder Launch', status: 'active', progress: 80 },
      { id: 2, name: 'Gym Equipment Review', status: 'completed', progress: 100 },
      { id: 3, name: 'Fitness App Promotion', status: 'active', progress: 55 }
    ],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-31T00:00:00Z'
  },
  5: {
    id: 5,
    userId: 105,
    name: 'Jessica Lee',
    bio: 'Travel photographer and adventure seeker. Exploring the world one destination at a time, sharing travel tips, hidden gems, and unforgettable experiences. Join my journey!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    location: 'New York, NY',
    isCompleted: true,
    socialMediaLinks: {
      instagram: 'https://instagram.com/jessicalee',
      youtube: 'https://youtube.com/@jessicalee',
      tiktok: 'https://tiktok.com/@jessicalee'
    },
    primaryPlatform: 'YouTube',
    followersCount: 1200000,
    followersDisplay: '1.2M',
    engagementRate: 8.9,
    engagementDisplay: '8.9%',
    categories: ['Travel & Adventure', 'Photography', 'Lifestyle'],
    contentTypes: ['Vlogs', 'Tutorials', 'Reviews'],
    collaborationTypes: ['Sponsored Videos', 'Travel Partnerships', 'Affiliate Marketing'],
    audienceAgeRange: '25-44',
    audienceGender: '45% Male, 55% Female',
    audienceLocation: 'USA (50%), Europe (30%), Asia (20%)',
    interests: ['Travel', 'Photography', 'Adventure', 'Culture', 'Food'],
    completionPercentage: 100,
    isOnboarded: true,
    rating: 4.9,
    totalRatings: 142,
    joinedDate: 'Dec 2024',
    verified: true,
    campaigns: 8,
    revenue: '$98,500',
    stats: {
      avgViews: '280K',
      avgLikes: '18.5K',
      avgComments: '920',
      reach: '1.5M',
      impressions: '5.2M'
    },
    platforms: [
      { name: 'YouTube', icon: Youtube, followers: '1.2M', handle: '@jessicalee', color: 'text-red-400' },
      { name: 'Instagram', icon: Instagram, followers: '850K', handle: '@jessicalee', color: 'text-pink-400' },
      { name: 'TikTok', icon: Video, followers: '420K', handle: '@jessicalee', color: 'text-white' }
    ],
    portfolio: [
      {
        id: 1,
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
        title: 'Bali Travel Guide',
        brand: 'Tourism Board',
        engagement: '45.2K',
        date: '2025-01-25'
      },
      {
        id: 2,
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        title: 'Mountain Adventure',
        brand: 'Outdoor Gear Co',
        engagement: '32.8K',
        date: '2025-01-18'
      },
      {
        id: 3,
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400',
        title: 'City Exploration Series',
        brand: 'Travel Agency',
        engagement: '28.5K',
        date: '2025-01-12'
      }
    ],
    achievements: [
      { title: 'Million Subscribers', description: 'Reached 1.2M on YouTube', icon: Award },
      { title: 'Top Travel Creator', description: 'Featured in Travel Magazine', icon: TrendingUp },
      { title: 'Partnership Pro', description: 'Completed 8 successful campaigns', icon: CheckCircle }
    ],
    recentCampaigns: [
      { id: 1, name: 'Hotel Chain Promotion', status: 'active', progress: 70 },
      { id: 2, name: 'Travel Gear Review', status: 'completed', progress: 100 }
    ],
    createdAt: '2024-12-15T00:00:00Z',
    updatedAt: '2025-01-31T00:00:00Z'
  },
  6: {
    id: 6,
    userId: 106,
    name: 'David Park',
    bio: 'Food enthusiast and culinary creator. Sharing delicious recipes, restaurant reviews, and cooking tips. Let\'s make cooking fun and accessible for everyone!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    location: 'San Francisco, CA',
    isCompleted: true,
    socialMediaLinks: {
      instagram: 'https://instagram.com/davidpark',
      youtube: 'https://youtube.com/@davidpark',
      tiktok: 'https://tiktok.com/@davidpark'
    },
    primaryPlatform: 'TikTok',
    followersCount: 650000,
    followersDisplay: '650K',
    engagementRate: 10.2,
    engagementDisplay: '10.2%',
    categories: ['Food & Cooking', 'Lifestyle', 'Reviews'],
    contentTypes: ['Short Videos', 'Recipes', 'Live Streams'],
    collaborationTypes: ['Recipe Features', 'Restaurant Reviews', 'Product Placements'],
    audienceAgeRange: '18-35',
    audienceGender: '40% Male, 60% Female',
    audienceLocation: 'USA (70%), Canada (15%), Australia (15%)',
    interests: ['Cooking', 'Food', 'Recipes', 'Restaurants', 'Culinary Arts'],
    completionPercentage: 100,
    isOnboarded: true,
    rating: 4.6,
    totalRatings: 78,
    joinedDate: 'Feb 2025',
    verified: true,
    campaigns: 4,
    revenue: '$38,200',
    stats: {
      avgViews: '95K',
      avgLikes: '12.8K',
      avgComments: '580',
      reach: '720K',
      impressions: '2.1M'
    },
    platforms: [
      { name: 'TikTok', icon: Video, followers: '650K', handle: '@davidpark', color: 'text-white' },
      { name: 'Instagram', icon: Instagram, followers: '380K', handle: '@davidpark', color: 'text-pink-400' },
      { name: 'YouTube', icon: Youtube, followers: '220K', handle: '@davidpark', color: 'text-red-400' }
    ],
    portfolio: [
      {
        id: 1,
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
        title: '60-Second Recipe',
        brand: 'Kitchen Tools Co',
        engagement: '22.5K',
        date: '2025-01-28'
      },
      {
        id: 2,
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        title: 'Restaurant Review',
        brand: 'Food Delivery App',
        engagement: '18.2K',
        date: '2025-01-22'
      }
    ],
    achievements: [
      { title: 'Top Food Creator', description: 'Highest engagement in niche', icon: Award },
      { title: 'Viral Content', description: 'Multiple videos with 1M+ views', icon: TrendingUp }
    ],
    recentCampaigns: [
      { id: 1, name: 'Kitchen Appliance Launch', status: 'active', progress: 65 }
    ],
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-01-31T00:00:00Z'
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
            onClick={() => navigate('/dashboard/owner/influencers/discover')}
            className="px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  const getPlatformIcon = (platform) => {
    const platformLower = platform?.toLowerCase() || '';
    switch (platformLower) {
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-400" />;
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-400" />;
      case 'tiktok':
        return <Video className="w-5 h-5 text-white" />;
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
          onClick={() => navigate(-1)}
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
            {/* Professional Avatar/Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="relative"
            >
              {/* Subtle Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#C1B6FD]/20 via-[#745CB4]/20 to-[#C1B6FD]/20 rounded-3xl blur-xl"></div>
              {influencer.image ? (
                <img
                  src={influencer.image}
                  alt={influencer.name}
                  className="relative w-36 h-36 lg:w-44 lg:h-44 rounded-3xl object-cover shadow-2xl border-2 border-white/10 ring-4 ring-[#745CB4]/20"
                />
              ) : (
                <div className="relative w-36 h-36 lg:w-44 lg:h-44 rounded-3xl bg-gradient-to-br from-[#745CB4] via-[#5D459D] to-[#745CB4] flex items-center justify-center font-bold text-white text-4xl lg:text-5xl shadow-2xl border-2 border-white/10">
                  {influencer.name?.substring(0, 2).toUpperCase()}
                </div>
              )}
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
                <h1 className="text-4xl lg:textrimaryP-5xl font-bold text-white">
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

