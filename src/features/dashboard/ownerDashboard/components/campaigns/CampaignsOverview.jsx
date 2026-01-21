import { Megaphone, Users, DollarSign, TrendingUp, ArrowRight, Target, Play, Clock, BarChart3, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import TopPerformingCampaigns from './TopPerformingCampaigns';

function CampaignsOverview() {
  const totalCampaigns = 8;
  const activeCampaigns = 5;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Recent Campaigns */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
        <div className="flex-1 w-full lg:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Campaign Overview</h1>
          <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Manage and track all your marketing campaigns</p>
          
          {/* Quick Stats & Navigation */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#C1B6FD]" />
              <div>
                <span className="text-xl sm:text-2xl font-bold text-white">{totalCampaigns}</span>
                <span className="text-xs text-gray-400 ml-1 sm:ml-2">Total Campaigns</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-lg">
              <Play className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
              <span className="text-xs sm:text-sm font-semibold text-green-400">{activeCampaigns} Active</span>
            </div>

            <Link to="/dashboard/owner/analytics">
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg hover:border-purple-400/30 hover:bg-white/10 transition-all">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                <span className="text-xs sm:text-sm text-gray-300">Analytics</span>
              </button>
            </Link>

            <Link to="/dashboard/owner/influencers">
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg hover:border-purple-400/30 hover:bg-white/10 transition-all">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                <span className="text-xs sm:text-sm text-gray-300">Influencers</span>
              </button>
            </Link>

            <Link to="/dashboard/owner/campaigns/create-ai">
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg hover:border-purple-400/30 hover:bg-white/10 transition-all">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                <span className="text-xs sm:text-sm text-gray-300">AI Generate</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Campaigns Section */}
        <div className="w-full lg:w-80 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent Campaigns</h3>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-white group-hover:text-[#C1B6FD] transition-colors flex-1">
                  Summer Fashion Launch
                </h4>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 animate-pulse">
                  active
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  2.4M
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  24
                </span>
                <span className="text-[#C1B6FD] font-semibold">$85K</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-white group-hover:text-[#C1B6FD] transition-colors flex-1">
                  Holiday Collection 2024
                </h4>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 animate-pulse">
                  active
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  3.8M
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  32
                </span>
                <span className="text-[#C1B6FD] font-semibold">$120K</span>
              </div>
            </div>
          </div>

          <Link to="/dashboard/owner/campaigns/create">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
              <Megaphone className="w-4 h-4" />
              Create Campaign
            </button>
          </Link>
        </div>
      </div>

      {/* Top Performing Campaigns */}
      <TopPerformingCampaigns />

 

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link
          to="/dashboard/owner/campaigns/active"
          className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 overflow-hidden hover:border-blue-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
        >
          {/* Gradient Background on Hover */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-blue-500/30 to-blue-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-blue-500/50 transition-all duration-300">
                <Megaphone className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-all duration-300">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Active Campaigns</h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed group-hover:text-gray-300 transition-colors">View and manage currently running campaigns</p>
            
            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
        </Link>

        <Link
          to="/dashboard/owner/campaigns/create"
          className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 overflow-hidden hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
        >
          {/* Gradient Background on Hover */}
          <div className="absolute inset-0 bg-linear-to-br from-[#C1B6FD]/20 via-[#745CB4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-[#C1B6FD]/30 to-[#745CB4]/20 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-purple-500/50 transition-all duration-300">
                <Megaphone className="w-6 h-6 sm:w-8 sm:h-8 text-[#C1B6FD] group-hover:text-white transition-colors" />
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-all duration-300">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-[#C1B6FD] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-[#C1B6FD] transition-colors">Create Campaign</h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed group-hover:text-gray-300 transition-colors">Launch a new marketing campaign</p>
            
            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
        </Link>

        <Link
          to="/dashboard/owner/campaigns/performance"
          className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 overflow-hidden hover:border-green-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20"
        >
          {/* Gradient Background on Hover */}
          <div className="absolute inset-0 bg-linear-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-green-500/30 to-green-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-green-500/50 transition-all duration-300">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 group-hover:text-green-300 transition-colors" />
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-500/20 transition-all duration-300">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">Performance Reports</h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed group-hover:text-gray-300 transition-colors">Analyze campaign metrics and ROI</p>
            
            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default CampaignsOverview;
