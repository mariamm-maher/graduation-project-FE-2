import { Share2, Calendar, Image, TrendingUp, ArrowRight, Target, Clock, BarChart3, Users, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';

function SocialMediaOverview() {
  const connectedAccounts = 5;
  const scheduledPosts = 24;

  return (
    <div className="space-y-6">
      {/* Header with Recent Activity */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-2">Social Media Channel Connection</h1>
          <p className="text-gray-400 mb-6">Manage accounts, schedule posts, and track performance</p>
          
          {/* Quick Stats & Navigation */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg">
              <Share2 className="w-5 h-5 text-[#C1B6FD]" />
              <div>
                <span className="text-2xl font-bold text-white">{connectedAccounts}</span>
                <span className="text-xs text-gray-400 ml-2">Connected Accounts</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-md border border-blue-500/20 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-400">{scheduledPosts} Scheduled</span>
            </div>

            <Link to="/dashboard/owner/analytics">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg hover:border-purple-400/30 hover:bg-white/10 transition-all">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Analytics</span>
              </button>
            </Link>

            <Link to="/dashboard/owner/campaigns">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg hover:border-purple-400/30 hover:bg-white/10 transition-all">
                <Megaphone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Campaigns</span>
              </button>
            </Link>

            <Link to="/dashboard/owner/influencers">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg hover:border-purple-400/30 hover:bg-white/10 transition-all">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Influencers</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="w-80 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            <div className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-white group-hover:text-[#C1B6FD] transition-colors flex-1">
                  Post published on Instagram
                </h4>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                  Published
                </span>
              </div>
              <p className="text-xs text-gray-400">Summer Fashion Collection • 2h ago</p>
            </div>

            <div className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-white group-hover:text-[#C1B6FD] transition-colors flex-1">
                  Scheduled 3 posts
                </h4>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                  Scheduled
                </span>
              </div>
              <p className="text-xs text-gray-400">Instagram, TikTok, YouTube</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-3 gap-6">
        <Link
          to="/dashboard/owner/social-media/accounts"
          className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 overflow-hidden hover:border-blue-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
        >
          {/* Gradient Background on Hover */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500/30 to-blue-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-blue-500/50 transition-all duration-300">
                <Share2 className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-all duration-300">
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Connected Accounts</h3>
            <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">Manage your social media platform connections</p>
            
            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
        </Link>

        <Link
          to="/dashboard/owner/social-media/schedule"
          className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 overflow-hidden hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
        >
          {/* Gradient Background on Hover */}
          <div className="absolute inset-0 bg-linear-to-br from-[#C1B6FD]/20 via-[#745CB4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#C1B6FD]/30 to-[#745CB4]/20 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-purple-500/50 transition-all duration-300">
                <Calendar className="w-8 h-8 text-[#C1B6FD] group-hover:text-white transition-colors" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-all duration-300">
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#C1B6FD] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#C1B6FD] transition-colors">Schedule Posts</h3>
            <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">Plan and schedule your content calendar</p>
            
            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
        </Link>

        <Link
          to="/dashboard/owner/social-media/content"
          className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 overflow-hidden hover:border-green-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20"
        >
          {/* Gradient Background on Hover */}
          <div className="absolute inset-0 bg-linear-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-green-500/30 to-green-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-green-500/50 transition-all duration-300">
                <Image className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-500/20 transition-all duration-300">
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">Content Library</h3>
            <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">Browse and manage your media assets</p>
            
            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default SocialMediaOverview;
