import { Users, MessageSquare, Clock, Calendar, DollarSign, Loader2, FileText, CheckCircle, AlertCircle, TrendingUp, ChevronRight, Target, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import useInfluncerStore from '../../../../../stores/influncerStore';
import useCollaborationRequestsStore from '../../../../../stores/CollaborationRequestsStore';
import useChatStore from '../../../../../stores/ChatStore';
import {
  getBrandName,
  getCampaignName,
  resolveAgreedPrice,
  countPendingRequests,
} from '../../utils/collaborationUtils';

const STATUS_STYLE = {
  pending_contract_sign: { label: 'Pending Contract', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
  live:                  { label: 'Live',             cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30',   dot: 'bg-blue-400'  },
  in_progress:           { label: 'In Progress',      cls: 'bg-green-500/20 text-green-400 border-green-500/30', dot: 'bg-green-400' },
  completed:             { label: 'Completed',        cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
  cancelled:             { label: 'Cancelled',        cls: 'bg-red-500/20 text-red-400 border-red-500/30',     dot: 'bg-red-400'   },
};

const PROGRESS_MAP = {
  pending_contract_sign: 10,
  live: 35,
  in_progress: 70,
  completed: 100,
  cancelled: 0,
};

function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function CollaborationsOverview() {
  const {
    influencerCollaborations = [],
    influencerCollaborationsLoading,
    getMyInfluencerCollaborations,
  } = useInfluncerStore();

  const { receivedRequests = [], getMyReceivedRequests } = useCollaborationRequestsStore();
  const { chatRooms, getChatRooms, fetchUnreadCount, totalUnreadCount } = useChatStore();

  useEffect(() => {
    getMyInfluencerCollaborations();
    getMyReceivedRequests({ page: 1, limit: 50 });
    getChatRooms();
    fetchUnreadCount();
  }, [getMyInfluencerCollaborations, getMyReceivedRequests, getChatRooms, fetchUnreadCount]);

  const unreadByCollabId = useMemo(() => {
    const map = {};
    (chatRooms || []).forEach((room) => {
      const collabId = room.collaborationId || room?.collaboration?.id || room?.collaboration?._id;
      if (!collabId) return;
      map[String(collabId)] = (map[String(collabId)] || 0) + Number(room.unreadCount || 0);
    });
    return map;
  }, [chatRooms]);

  const collaborations = useMemo(() => influencerCollaborations.map((collab) => {
    const status = collab?.status || 'pending_contract_sign';
    const collabId = String(collab._id || collab.id);
    const brandName = getBrandName(collab?.owner) || collab?.contacts?.owner?.businessName || collab?.contacts?.owner?.name || '—';
    const ownerName = collab?.contacts?.owner?.name || `${collab?.owner?.firstName || ''} ${collab?.owner?.lastName || ''}`.trim() || '—';
    const campaignName = getCampaignName(collab);
    const campaignGoal = collab?.campaign?.campaign_goal || null;
    const budget = resolveAgreedPrice(collab);
    const unreadMessages = unreadByCollabId[collabId] || collab?.unreadMessages || 0;
    const startDate = collab?.startDate || collab?.campaign?.startDate;
    const endDate = collab?.endDate || collab?.campaign?.endDate;
    const tasks = collab?.tasks || [];
    const taskSummary = collab?.taskSummary || { total: tasks.length, completed: tasks.filter(t => ['approved','completed'].includes(String(t.status||'').toLowerCase())).length };
    const taskProgress = taskSummary.total > 0 ? Math.round((taskSummary.completed / taskSummary.total) * 100) : 0;

    return {
      id: collabId,
      brand: brandName,
      ownerName,
      campaign: campaignName,
      campaignGoal,
      status,
      progress: PROGRESS_MAP[status] ?? 0,
      taskProgress,
      taskSummary,
      startDate: fmt(startDate),
      endDate: fmt(endDate),
      budget: Number(budget),
      unreadMessages,
    };
  }), [influencerCollaborations, unreadByCollabId]);

  const activeCollabs    = collaborations.filter((c) => c.status === 'live' || c.status === 'in_progress').length;
  const pendingContract  = collaborations.filter((c) => c.status === 'pending_contract_sign').length;
  const completedCollabs = collaborations.filter((c) => c.status === 'completed').length;
  const totalEarnings    = collaborations.reduce((sum, c) => sum + c.budget, 0);
  const totalMessages    = totalUnreadCount > 0 ? totalUnreadCount : collaborations.reduce((sum, c) => sum + (c.unreadMessages || 0), 0);
  const requestsCount    = countPendingRequests(receivedRequests);

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">My Collaborations</h1>
          <p className="text-sm text-gray-400">All your brand partnerships in one place</p>
        </div>
        <div className="flex w-full sm:w-auto gap-2 flex-wrap">
          <Link to="/dashboard/influencer/collaborations/contracts" className="w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 border border-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-all w-full sm:w-auto relative">
              <FileText className="w-4 h-4" />
              Contracts
              {pendingContract > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {pendingContract}
                </span>
              )}
            </button>
          </Link>
          <Link to="/dashboard/influencer/collaborations/requests" className="w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/40 transition-all relative w-full sm:w-auto">
              <MessageSquare className="w-4 h-4" />
              Requests
              {requestsCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {requestsCount}
                </span>
              )}
            </button>
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {([
          { icon: <Users className="w-4 h-4 text-green-400" />,         label: 'Active',          value: activeCollabs,                        color: 'text-green-400',   bg: 'bg-green-500/20'   },
          { icon: <Clock className="w-4 h-4 text-amber-400" />,         label: 'Pending Contract',value: pendingContract,                       color: 'text-amber-400',   bg: 'bg-amber-500/20'   },
          { icon: <CheckCircle className="w-4 h-4 text-emerald-400" />, label: 'Completed',       value: completedCollabs,                      color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
          { icon: <MessageSquare className="w-4 h-4 text-blue-400" />,  label: 'Unread Msgs',     value: totalMessages,                         color: 'text-blue-400',    bg: 'bg-blue-500/20'    },
          { icon: <DollarSign className="w-4 h-4 text-[#C1B6FD]" />,   label: 'Total Earnings',  value: `$${totalEarnings.toLocaleString()}`,  color: 'text-[#C1B6FD]',  bg: 'bg-purple-500/20'  },
        ]).map(({ icon, label, value, color, bg }) => (
          <div key={label} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              {icon}
            </div>
            <p className={`text-xl font-bold ${color} mb-0.5`}>{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Collaboration Cards ── */}
      <div className="space-y-4">
        {influencerCollaborationsLoading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="w-8 h-8 text-[#C1B6FD] animate-spin" />
          </div>
        ) : collaborations.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-14 text-center">
            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No collaborations yet</p>
            <p className="text-gray-500 text-sm mt-1">Apply to campaigns to start collaborating with brands.</p>
          </div>
        ) : (
          collaborations.map((collab) => {
            const st = STATUS_STYLE[collab.status] || STATUS_STYLE.cancelled;
            return (
              <div
                key={collab.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-[#745CB4]/40 transition-all duration-300 group"
              >
                {/* Top row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center text-2xl shadow-lg shrink-0">
                      🏢
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#C1B6FD] transition-colors truncate">
                        {collab.campaign}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-gray-400">{collab.brand}</span>
                        {collab.ownerName && collab.ownerName !== collab.brand && (
                          <>
                            <span className="text-gray-600 text-xs">·</span>
                            <span className="text-xs text-gray-500">{collab.ownerName}</span>
                          </>
                        )}
                      </div>
                      {collab.campaignGoal && (
                        <div className="flex items-center gap-1 mt-1">
                          <Target className="w-3 h-3 text-[#C1B6FD]" />
                          <span className="text-xs text-[#C1B6FD]/80 capitalize">{collab.campaignGoal}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${st.cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                    {collab.unreadMessages > 0 && (
                      <Link to="/dashboard/influencer/messages">
                        <span className="relative inline-flex items-center justify-center w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-full hover:bg-blue-500/30 transition-all cursor-pointer">
                          <MessageSquare className="w-4 h-4 text-blue-400" />
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                            {collab.unreadMessages}
                          </span>
                        </span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Key Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-white/5 rounded-lg px-3 py-2.5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Budget</p>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#C1B6FD]" />
                      <span className="text-sm font-bold text-white">
                        {collab.budget > 0 ? collab.budget.toLocaleString() : '—'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg px-3 py-2.5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Start Date</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs font-semibold text-white">{collab.startDate}</span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg px-3 py-2.5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Deadline</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs font-semibold text-white">{collab.endDate}</span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg px-3 py-2.5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Tasks</p>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-sm font-bold text-white">
                        {collab.taskSummary.completed}
                        <span className="text-gray-400 font-normal text-xs"> / {collab.taskSummary.total}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bars */}
                <div className="space-y-2 mb-4">
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                      <span>Collaboration Stage</span>
                      <span>{collab.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD] transition-all duration-500" style={{ width: `${collab.progress}%` }} />
                    </div>
                  </div>
                  {collab.taskSummary.total > 0 && (
                    <div>
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>Task Completion</span>
                        <span>{collab.taskProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${collab.taskProgress}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-white/10">
                  <Link to={`/dashboard/influencer/collaborations/${collab.id}/workspace`} className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-semibold text-gray-300 hover:text-white transition-all">
                      <TrendingUp className="w-4 h-4" />
                      View Workspace
                      <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />
                    </button>
                  </Link>
                  {collab.status === 'pending_contract_sign' && (
                    <Link to={`/dashboard/influencer/collaborations/contracts/${collab.id}`} className="flex-1 relative">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg text-sm font-semibold text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                        <FileText className="w-4 h-4" />
                        Sign Contract
                      </button>
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default CollaborationsOverview;
