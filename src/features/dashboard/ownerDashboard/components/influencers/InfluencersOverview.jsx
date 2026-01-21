import { Users, Target, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function InfluencersOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Influencers Hub</h1>
        <p className="text-sm sm:text-base text-gray-400">Manage and discover influencer collaborations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-green-400 text-sm font-semibold">+12%</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mb-1">24</p>
          <p className="text-xs sm:text-sm text-gray-400">Active Collaborators</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-green-400 text-xs sm:text-sm font-semibold">+8%</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mb-1">10</p>
          <p className="text-xs sm:text-sm text-gray-400">Ongoing Campaigns</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-green-400 text-xs sm:text-sm font-semibold">+24%</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mb-1">$146.5K</p>
          <p className="text-xs sm:text-sm text-gray-400">Total Investment</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-green-400 text-xs sm:text-sm font-semibold">+15%</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mb-1">8.2%</p>
          <p className="text-xs sm:text-sm text-gray-400">Avg Engagement</p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link
          to="/dashboard/influencers/active"
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Active Collaborators</h3>
          <p className="text-gray-400 text-xs sm:text-sm">View and manage your current influencer partnerships</p>
        </Link>

        <Link
          to="/dashboard/influencers/discover"
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Discover Talent</h3>
          <p className="text-gray-400 text-xs sm:text-sm">Find new influencers that match your campaign goals</p>
        </Link>

        <Link
          to="/dashboard/influencers/history"
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Past Collaborations</h3>
          <p className="text-gray-400 text-xs sm:text-sm">Review completed partnerships and performance history</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center font-bold text-white shrink-0">
              SJ
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm sm:text-base">Campaign completed with Sarah Johnson</p>
              <p className="text-xs sm:text-sm text-gray-400">2 hours ago</p>
            </div>
            <span className="px-2 sm:px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap">Completed</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center font-bold text-white shrink-0">
              MC
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm sm:text-base">New message from Mike Chen</p>
              <p className="text-xs sm:text-sm text-gray-400">5 hours ago</p>
            </div>
            <span className="px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap">New Message</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center font-bold text-white shrink-0">
              ED
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm sm:text-base">Contract signed with Emma Davis</p>
              <p className="text-xs sm:text-sm text-gray-400">1 day ago</p>
            </div>
            <span className="px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap">Signed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfluencersOverview;
