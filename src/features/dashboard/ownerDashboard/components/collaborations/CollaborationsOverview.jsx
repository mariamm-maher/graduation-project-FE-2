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
  const totalMessages = overview?.totalMessages ?? 0;

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-indigo-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{totalCollaborations}</p>
          <p className="text-sm text-gray-400">Total Collaborations</p>
        </div>

        <div className="bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-md border border-green-500/20 rounded-xl p-5 hover:border-green-400/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{activeCollabs}</p>
          <p className="text-sm text-gray-400">Active</p>
        </div>

        <div className="bg-linear-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-md border border-blue-500/20 rounded-xl p-5 hover:border-blue-400/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{completedCollabs}</p>
          <p className="text-sm text-gray-400">Completed</p>
        </div>

        <div className="bg-linear-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-md border border-amber-500/20 rounded-xl p-5 hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{pendingContractSignCollabs}</p>
          <p className="text-sm text-gray-400">Pending Contract Sign</p>
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

          {/* LIVE COLLABORATION */}
          <Link
            to="/dashboard/owner/collaborations/active"
            className="group relative overflow-hidden bg-white/5 hover:bg-linear-to-br hover:from-green-500/10 hover:to-green-600/5 border border-white/5 hover:border-green-500/30 rounded-2xl p-5 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(34,197,94,0.15)] hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-green-500/20"></div>
            <div className="relative z-10 flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 group-hover:bg-green-500/20 group-hover:scale-110 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-green-300 transition-colors">Live Collaboration</h3>
              <p className="text-sm text-gray-400">Currently running</p>
            </div>
            <div className="relative z-10 mt-5 flex items-center justify-between">
              <span className="text-xs font-medium text-green-400/0 group-hover:text-green-400/90 transition-colors duration-300">Track progress</span>
              <span className="opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-green-500/20 p-1.5 rounded-lg">
                <ChevronRight className="w-4 h-4 text-green-300" />
              </span>
            </div>
          </Link>

          {/* COMPLETED */}
          <Link
            to="/dashboard/owner/collaborations/completed"
            className="group relative overflow-hidden bg-white/5 hover:bg-linear-to-br hover:from-blue-500/10 hover:to-blue-600/5 border border-white/5 hover:border-blue-500/30 rounded-2xl p-5 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-blue-500/20"></div>
            <div className="relative z-10 flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:scale-110 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner">
                <Award className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">Completed</h3>
              <p className="text-sm text-gray-400">Finished projects</p>
            </div>
            <div className="relative z-10 mt-5 flex items-center justify-between">
              <span className="text-xs font-medium text-blue-400/0 group-hover:text-blue-400/90 transition-colors duration-300">Review results</span>
              <span className="opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-blue-500/20 p-1.5 rounded-lg">
                <ChevronRight className="w-4 h-4 text-blue-300" />
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
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors">Collaborations Analytics</h3>
              <p className="text-sm text-gray-400">Performance insights</p>
            </div>
            <div className="relative z-10 mt-5 flex items-center justify-between">
              <span className="text-xs font-medium text-cyan-400/0 group-hover:text-cyan-400/90 transition-colors duration-300">View reports</span>
              <span className="opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-cyan-500/20 p-1.5 rounded-lg">
                <ChevronRight className="w-4 h-4 text-cyan-300" />
              </span>
            </div>
          </Link>

          {/* CHAT ROOMS */}
          <Link
            to="/dashboard/owner/collaborations/chat-rooms"
            className="group relative overflow-hidden bg-white/5 hover:bg-linear-to-br hover:from-emerald-500/10 hover:to-emerald-600/5 border border-white/5 hover:border-emerald-500/30 rounded-2xl p-5 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-emerald-500/20"></div>
            <div className="relative z-10 flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:scale-110 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner">
                <MessageSquare className="w-6 h-6 text-emerald-400" />
              </div>
              {totalMessages > 0 && (
                <span className="bg-emerald-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                  {totalMessages}
                </span>
              )}
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-emerald-300 transition-colors">Collaboration Messaging</h3>
              <p className="text-sm text-gray-400">Communication hub</p>
            </div>
            <div className="relative z-10 mt-5 flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-400/0 group-hover:text-emerald-400/90 transition-colors duration-300">Open messages</span>
              <span className="opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-emerald-500/20 p-1.5 rounded-lg">
                <ChevronRight className="w-4 h-4 text-emerald-300" />
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
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">Collaboration Tasks Board</h3>
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
