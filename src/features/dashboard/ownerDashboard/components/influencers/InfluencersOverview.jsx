import { UserCheck, UserPlus, History, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function InfluencersOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Influencers Hub</h1>
        <p className="text-sm sm:text-base text-gray-400">Manage and discover influencer collaborations</p>
      </div>

      {/*  Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link
          to="/dashboard/owner/influencers/active"
          className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 hover:border-[#C1B6FD]/50 hover:shadow-2xl hover:shadow-[#C1B6FD]/20 hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
        >
          {/* Gradient Accent Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C1B6FD]/20 via-transparent to-[#745CB4]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center shadow-lg shadow-[#745CB4]/30 group-hover:shadow-xl group-hover:shadow-[#C1B6FD]/40 group-hover:scale-110 transition-all duration-300">
                <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#C1B6FD] transition-all duration-300">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#C1B6FD] transition-colors">Active Collaborators</h3>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#C1B6FD]/20 to-[#745CB4]/20 text-white border border-[#C1B6FD]/30">24</span>
            </div>
            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Manage partnerships currently running and their progress</p>
          </div>
        </Link>

        <Link
          to="/dashboard/owner/influencers/discover"
          className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 hover:border-[#C1B6FD]/50 hover:shadow-2xl hover:shadow-[#C1B6FD]/20 hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
        >
          {/* Gradient Accent Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C1B6FD]/20 via-transparent to-[#745CB4]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center shadow-lg shadow-[#745CB4]/30 group-hover:shadow-xl group-hover:shadow-[#C1B6FD]/40 group-hover:scale-110 transition-all duration-300">
                <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#C1B6FD] transition-all duration-300">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#C1B6FD] transition-colors">Discover Collaborators</h3>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#C1B6FD]/20 to-[#745CB4]/20 text-white border border-[#C1B6FD]/30">128</span>
            </div>
            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Browse and invite new influencers for upcoming campaigns</p>
          </div>
        </Link>

        <Link
          to="/dashboard/owner/influencers/history"
          className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 hover:border-[#C1B6FD]/50 hover:shadow-2xl hover:shadow-[#C1B6FD]/20 hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
        >
          {/* Gradient Accent Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C1B6FD]/20 via-transparent to-[#745CB4]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center shadow-lg shadow-[#745CB4]/30 group-hover:shadow-xl group-hover:shadow-[#C1B6FD]/40 group-hover:scale-110 transition-all duration-300">
                <History className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#C1B6FD] transition-all duration-300">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#C1B6FD] transition-colors">Past Collaborators</h3>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#C1B6FD]/20 to-[#745CB4]/20 text-white border border-[#C1B6FD]/30">56</span>
            </div>
            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">See people you've worked with before and their performance</p>
          </div>
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
