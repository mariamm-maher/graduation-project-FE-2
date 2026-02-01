import { Megaphone, Users, DollarSign, TrendingUp, ArrowRight, Target, Play, Clock, BarChart3, Sparkles, CheckCircle, FileEdit, Grid3x3 } from 'lucide-react';
import { Link } from 'react-router-dom';

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

   

 

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* All Campaigns */}
        <Link
          to="/dashboard/owner/campaigns/all"
          className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-400/20 hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
        >
          {/* Gradient Accent Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/20 via-transparent to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:shadow-xl group-hover:shadow-purple-400/40 group-hover:scale-110 transition-all duration-300">
                <Grid3x3 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-purple-400 transition-all duration-300">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-400 transition-colors">All Campaigns</h3>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-400/20 to-purple-600/20 text-white border border-purple-400/30">{totalCampaigns}</span>
            </div>
            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">View all your marketing campaigns</p>
          </div>
        </Link>

        {/* Active Campaigns */}
        <Link
          to="/dashboard/owner/campaigns/active"
          className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-400/20 hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
        >
          {/* Gradient Accent Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 via-transparent to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:shadow-xl group-hover:shadow-blue-400/40 group-hover:scale-110 transition-all duration-300">
                <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-400 transition-all duration-300">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Active Campaigns</h3>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-400/20 to-blue-600/20 text-white border border-blue-400/30">{activeCampaigns}</span>
            </div>
            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">View and manage currently running campaigns</p>
          </div>
        </Link>

        {/* Create Campaign */}
        <Link
          to="/dashboard/owner/campaigns/create"
          className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 hover:border-[#C1B6FD]/50 hover:shadow-2xl hover:shadow-[#C1B6FD]/20 hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
        >
          {/* Gradient Accent Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C1B6FD]/20 via-transparent to-[#745CB4]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center shadow-lg shadow-[#745CB4]/30 group-hover:shadow-xl group-hover:shadow-[#C1B6FD]/40 group-hover:scale-110 transition-all duration-300">
                <Megaphone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#C1B6FD] transition-all duration-300">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#C1B6FD] transition-colors">Create Campaign</h3>
            </div>
            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Launch a new marketing campaign</p>
          </div>
        </Link>

        {/* Completed Campaigns */}
        <Link
          to="/dashboard/owner/campaigns/completed"
          className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 hover:border-green-400/50 hover:shadow-2xl hover:shadow-green-400/20 hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
        >
          {/* Gradient Accent Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/20 via-transparent to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-600/30 group-hover:shadow-xl group-hover:shadow-green-400/40 group-hover:scale-110 transition-all duration-300">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-green-400 transition-all duration-300">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-green-400 transition-colors">Completed Campaigns</h3>
            </div>
            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Review finished campaign results</p>
          </div>
        </Link>

        {/* Draft Campaigns */}
        <Link
          to="/dashboard/owner/campaigns/draft"
          className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-400/20 hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
        >
          {/* Gradient Accent Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400/20 via-transparent to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/30 group-hover:shadow-xl group-hover:shadow-amber-400/40 group-hover:scale-110 transition-all duration-300">
                <FileEdit className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-amber-400 transition-all duration-300">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-400 transition-colors">Draft Campaigns</h3>
            </div>
            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Continue working on saved drafts</p>
          </div>
        </Link>

        {/* Campaign Analytics */}
        <Link
          to="/dashboard/owner/campaigns/analytics"
          className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 hover:border-indigo-400/50 hover:shadow-2xl hover:shadow-indigo-400/20 hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
        >
          {/* Gradient Accent Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/20 via-transparent to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:shadow-xl group-hover:shadow-indigo-400/40 group-hover:scale-110 transition-all duration-300">
                <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-indigo-400 transition-all duration-300">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">Campaign Analytics</h3>
            </div>
            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Detailed performance insights</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default CampaignsOverview;
