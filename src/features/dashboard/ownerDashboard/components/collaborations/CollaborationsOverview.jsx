import { useEffect } from 'react';
import { Users, MessageSquare, CheckCircle, Star, TrendingUp, FileText, Inbox, Layout, ChevronRight, Activity, Award, PenTool, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCollaborationStore from '../../../../../stores/collaborationStore';

function CollaborationsOverview() {
  const {
    collaborationsOverview,
    isCollaborationsOverviewLoading,
    collaborationsOverviewError,
    getCollaborationsOverview
  } = useCollaborationStore();

  useEffect(() => {
    getCollaborationsOverview();
  }, [getCollaborationsOverview]);

  const overview = collaborationsOverview?.overview || collaborationsOverview || {};
  const totalCollaborations = overview?.totalCollaborations ?? 0;
  const activeCollabs = overview?.liveCollab ?? 0;
  const completedCollabs = overview?.completedCollabs ?? 0;
  const pendingContractSignCollabs =
    overview?.pending_contract_signCollab ?? overview?.pendingContractSignCollab ?? 0;
  // const totalMessages = overview?.totalMessages ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Collaborations</h1>
          <p className="text-sm sm:text-base text-gray-400">
            {isCollaborationsOverviewLoading
              ? 'Loading collaborations overview...'
              : collaborationsOverviewError || 'Manage influencer partnerships and track deliverables'}
          </p>
        </div>
       
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-3.5 py-2.5 flex items-center gap-3 hover:bg-white/10 hover:border-indigo-400/40 hover:shadow-md hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="flex items-center justify-center w-7 h-7 rounded shrink-0 bg-linear-to-br from-indigo-500/20 to-indigo-600/20 border border-indigo-400/30 group-hover:scale-105 transition-transform">
            <Users className="w-3.5 h-3.5 text-indigo-300" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 group-hover:text-indigo-300 transition-colors">Total</p>
            <p className="text-xs text-gray-400 truncate">All collaborations</p>
          </div>

          <div className="flex items-center gap-2 border-l border-white/10 pl-3 ml-1">
            <span className="text-sm font-bold text-white">{totalCollaborations}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-3.5 py-2.5 flex items-center gap-3 hover:bg-white/10 hover:border-green-400/40 hover:shadow-md hover:shadow-green-500/10 hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="flex items-center justify-center w-7 h-7 rounded shrink-0 bg-linear-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 group-hover:scale-105 transition-transform">
            <CheckCircle className="w-3.5 h-3.5 text-green-300" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-200 group-hover:text-green-300 transition-colors">Active</span>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
          </div>

          <div className="flex items-center gap-2 border-l border-white/10 pl-3 ml-auto">
            <span className="text-sm font-bold text-white">{activeCollabs}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-green-300 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-3.5 py-2.5 flex items-center gap-3 hover:bg-white/10 hover:border-blue-400/40 hover:shadow-md hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="flex items-center justify-center w-7 h-7 rounded shrink-0 bg-linear-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 group-hover:scale-105 transition-transform">
            <Star className="w-3.5 h-3.5 text-blue-300" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 group-hover:text-blue-300 transition-colors">Completed</p>
            <p className="text-xs text-gray-400 truncate">Finished collaborations</p>
          </div>

          <div className="flex items-center gap-2 border-l border-white/10 pl-3 ml-1">
            <span className="text-sm font-bold text-white">{completedCollabs}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-300 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-3.5 py-2.5 flex items-center gap-3 hover:bg-white/10 hover:border-amber-400/40 hover:shadow-md hover:shadow-amber-500/10 hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="flex items-center justify-center w-7 h-7 rounded shrink-0 bg-linear-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/30 group-hover:scale-105 transition-transform">
            <FileText className="w-3.5 h-3.5 text-amber-300" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 group-hover:text-amber-300 transition-colors">Pending</p>
            <p className="text-xs text-gray-400 truncate">Contract sign</p>
          </div>

          <div className="flex items-center gap-2 border-l border-white/10 pl-3 ml-1">
            <span className="text-sm font-bold text-white">{pendingContractSignCollabs}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        {/* Subtle background glow for the whole container */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] -z-10 mix-blend-overlay"></div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-1">Collaboration Management</h2>
          <p className="text-sm text-gray-400">Navigate through your collaboration ecosystem</p>
        </div>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* ALL COLLABORATIONS */}
          <Link
            to="/dashboard/owner/collaborations/all"
            className="group relative overflow-hidden bg-white/5 hover:bg-linear-to-br hover:from-indigo-500/10 hover:to-indigo-600/5 border border-white/5 hover:border-indigo-500/30 rounded-2xl p-5 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-indigo-500/20"></div>
            <div className="relative z-10 flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:scale-110 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner">
                <LayoutGrid className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">All</h3>
              <p className="text-sm text-gray-400">View all collaborations</p>
            </div>
            <div className="relative z-10 mt-5 flex items-center justify-between">
              <span className="text-xs font-medium text-indigo-400/0 group-hover:text-indigo-400/90 transition-colors duration-300">Browse collection</span>
              <span className="opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-indigo-500/20 p-1.5 rounded-lg">
                <ChevronRight className="w-4 h-4 text-indigo-300" />
              </span>
            </div>
          </Link>

      

          {/* WAITING CONTRACT SIGN */}
          <Link
            to="/dashboard/owner/collaborations/past"
            className="group relative overflow-hidden bg-white/5 hover:bg-linear-to-br hover:from-purple-500/10 hover:to-purple-600/5 border border-white/5 hover:border-purple-500/30 rounded-2xl p-5 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-purple-500/20"></div>
            <div className="relative z-10 flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500/20 group-hover:scale-110 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner">
                <PenTool className="w-6 h-6 text-purple-400" />
              </div>
              {pendingContractSignCollabs > 0 && (
                <span className="bg-purple-500/20 text-purple-300 text-xs font-medium px-2 py-1 rounded-md border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                  {pendingContractSignCollabs} Pending
                </span>
              )}
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">Waiting Contract Sign</h3>
              <p className="text-sm text-gray-400">Archives & pending</p>
            </div>
            <div className="relative z-10 mt-5 flex items-center justify-between">
              <span className="text-xs font-medium text-purple-400/0 group-hover:text-purple-400/90 transition-colors duration-300">Review status</span>
              <span className="opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-purple-500/20 p-1.5 rounded-lg">
                <ChevronRight className="w-4 h-4 text-purple-300" />
              </span>
            </div>
          </Link>

          {/* CONTRACTS */}
          <Link
            to="/dashboard/owner/collaborations/contracts"
            className="group relative overflow-hidden bg-white/5 hover:bg-linear-to-br hover:from-amber-500/10 hover:to-amber-600/5 border border-white/5 hover:border-amber-500/30 rounded-2xl p-5 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)] hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-amber-500/20"></div>
            <div className="relative z-10 flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 group-hover:scale-110 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner">
                <FileText className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-amber-300 transition-colors">Contracts</h3>
              <p className="text-sm text-gray-400">Legal agreements</p>
            </div>
            <div className="relative z-10 mt-5 flex items-center justify-between">
              <span className="text-xs font-medium text-amber-400/0 group-hover:text-amber-400/90 transition-colors duration-300">Manage documents</span>
              <span className="opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-amber-500/20 p-1.5 rounded-lg">
                <ChevronRight className="w-4 h-4 text-amber-300" />
              </span>
            </div>
          </Link>

          {/* REQUESTS */}
          <Link
            to="/dashboard/owner/collaborations/requests"
            className="group relative overflow-hidden bg-white/5 hover:bg-linear-to-br hover:from-rose-500/10 hover:to-rose-600/5 border border-white/5 hover:border-rose-500/30 rounded-2xl p-5 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(244,63,94,0.15)] hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-rose-500/20"></div>
            <div className="relative z-10 flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 group-hover:bg-rose-500/20 group-hover:scale-110 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner">
                <Inbox className="w-6 h-6 text-rose-400" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-rose-300 transition-colors">Requests</h3>
              <p className="text-sm text-gray-400">Pending proposals</p>
            </div>
            <div className="relative z-10 mt-5 flex items-center justify-between">
              <span className="text-xs font-medium text-rose-400/0 group-hover:text-rose-400/90 transition-colors duration-300">Check inbox</span>
              <span className="opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-rose-500/20 p-1.5 rounded-lg">
                <ChevronRight className="w-4 h-4 text-rose-300" />
              </span>
            </div>
          </Link>

          {/* ANALYTICS */}
          <Link
            to="/dashboard/owner/collaborations/analytics"
            className="group relative overflow-hidden bg-white/5 hover:bg-linear-to-br hover:from-cyan-500/10 hover:to-cyan-600/5 border border-white/5 hover:border-cyan-500/30 rounded-2xl p-5 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)] hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-cyan-500/20"></div>
            <div className="relative z-10 flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20 group-hover:scale-110 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors"> Analytics</h3>
              <p className="text-sm text-gray-400">Performance insights</p>
            </div>
            <div className="relative z-10 mt-5 flex items-center justify-between">
              <span className="text-xs font-medium text-cyan-400/0 group-hover:text-cyan-400/90 transition-colors duration-300">View reports</span>
              <span className="opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-cyan-500/20 p-1.5 rounded-lg">
                <ChevronRight className="w-4 h-4 text-cyan-300" />
              </span>
            </div>
          </Link>

   

          {/* BOARD */}
          <Link
            to="/dashboard/owner/collaborations/board"
            className="group relative overflow-hidden bg-white/5 hover:bg-linear-to-br hover:from-violet-500/10 hover:to-violet-600/5 border border-white/5 hover:border-violet-500/30 rounded-2xl p-5 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-violet-500/20"></div>
            <div className="relative z-10 flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 group-hover:bg-violet-500/20 group-hover:scale-110 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner">
                <Layout className="w-6 h-6 text-violet-400" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">Tasks Board</h3>
              <p className="text-sm text-gray-400">Task management</p>
            </div>
            <div className="relative z-10 mt-5 flex items-center justify-between">
              <span className="text-xs font-medium text-violet-400/0 group-hover:text-violet-400/90 transition-colors duration-300">Manage tasks</span>
              <span className="opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-violet-500/20 p-1.5 rounded-lg">
                <ChevronRight className="w-4 h-4 text-violet-300" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CollaborationsOverview;
