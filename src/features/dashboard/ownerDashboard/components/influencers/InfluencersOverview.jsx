import { useEffect } from 'react';
import { UserCheck, UserPlus, History, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useInfluncerStore from '../../../../../stores/influncerStore';
import InfluencersHistory from './pastCollborators/InfluencersHistory';
import DiscoverInfluencers from './DiscoverCollborators/DiscoverInfluencers';

function InfluencersOverview() {
  const {
    overview,
    overviewLoading,
    overviewError,
    fetchInfluencerOverviewStats
  } = useInfluncerStore();

  useEffect(() => {
    fetchInfluencerOverviewStats();
  }, [fetchInfluencerOverviewStats]);

  const activeCollaboratorNow = overview?.activeCollaboratorNow ?? 0;
  const pastCollaboratingNumber = overview?.pastCollaboratingNumber ?? 0;

  return (
    <div className="space-y-6">
      {/* Header & Navigation Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Discover Talent</h1>
          <p className="text-gray-400 text-sm sm:text-base">Find influencers that match your campaign goals</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Link
          to="/dashboard/owner/influencers/active"
          className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-3.5 py-2 flex items-center gap-3 hover:bg-white/10 hover:border-[#C1B6FD]/40 hover:shadow-md hover:shadow-[#C1B6FD]/10 hover:-translate-y-0.5 transition-all duration-300 group"
        >
          <div className="flex items-center justify-center w-7 h-7 rounded shrink-0 bg-linear-to-br from-[#C1B6FD]/20 to-[#745CB4]/20 border border-[#C1B6FD]/30 group-hover:scale-105 transition-transform">
            <UserCheck className="w-3.5 h-3.5 text-[#C1B6FD]" />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-200 group-hover:text-[#C1B6FD] transition-colors">Active</span>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
          </div>
          
          <div className="flex items-center gap-2 border-l border-white/10 pl-3 ml-1">
            <span className="text-sm font-bold text-white">{activeCollaboratorNow}</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#C1B6FD] group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link
          to="/dashboard/owner/influencers/history"
          className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-3.5 py-2 flex items-center gap-3 hover:bg-white/10 hover:border-[#C1B6FD]/40 hover:shadow-md hover:shadow-[#C1B6FD]/10 hover:-translate-y-0.5 transition-all duration-300 group"
        >
          <div className="flex items-center justify-center w-7 h-7 rounded shrink-0 bg-linear-to-br from-[#C1B6FD]/20 to-[#745CB4]/20 border border-[#C1B6FD]/30 group-hover:scale-105 transition-transform">
            <History className="w-3.5 h-3.5 text-[#C1B6FD]" />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-200 group-hover:text-[#C1B6FD] transition-colors">Past</span>
          </div>
          
          <div className="flex items-center gap-2 border-l border-white/10 pl-3 ml-1">
            <span className="text-sm font-bold text-white">{pastCollaboratingNumber}</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#C1B6FD] group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>
    </div>

    <DiscoverInfluencers/>
  </div>
  );
}

export default InfluencersOverview;
