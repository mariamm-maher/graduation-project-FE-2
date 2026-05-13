import { Users, MessageSquare, Clock, Calendar, DollarSign, Loader2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import useInfluncerStore from '../../../../../stores/influncerStore';

function CollaborationsOverview() {
  const { 
    receivedRequests = [],
    influencerCollaborations = [],
    influencerCollaborationsLoading,
    getMyInfluencerCollaborations 
  } = useInfluncerStore();

  useEffect(() => {
    getMyInfluencerCollaborations();
  }, [getMyInfluencerCollaborations]);

  const progressMap = {
    pending_contract_sign: 10,
    live: 40,
    in_progress: 70,
    completed: 100,
    cancelled: 0,
  };

  const collaborations = influencerCollaborations.map(collab => {
    const status = collab?.status || 'pending_contract_sign';
    const owner = collab?.owner || {};
    const brandName =
      owner?.ownerProfile?.brand_name ||
      `${owner?.firstName || ''} ${owner?.lastName || ''}`.trim() ||
      'Unknown Brand';
    const campaignName = collab?.campaign?.campaignName || 'Unknown Campaign';
    const deadline = collab?.endDate || collab?.campaign?.endDate || collab?.updatedAt;
    const budget = collab?.request?.counterPrice ?? collab?.request?.proposedBudget ?? collab?.agreedBudget ?? collab?.budget ?? 0;

    return {
      id: collab._id || collab.id,
      brand: brandName,
      campaign: campaignName,
      status,
      progress: progressMap[status] ?? 0,
      deadline: deadline ? new Date(deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'No deadline',
      earnings: `$${Number(budget).toLocaleString()}`,
    };
  });

  const activeCollabs = collaborations.filter(c => c.status === 'live' || c.status === 'in_progress').length;
  const pendingContractSign = collaborations.filter(c => c.status === 'pending_contract_sign').length;
  const totalMessages = collaborations.reduce((sum, c) => sum + (c.unreadMessages || 0), 0);
  const requestsCount = Array.isArray(receivedRequests) ? receivedRequests.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">My Collaborations</h1>
          <p className="text-sm sm:text-base text-gray-400">Active campaigns you're working on - accepted and in progress</p>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <Link to="/dashboard/influencer/collaborations/contracts" className="w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-white/10 border border-white/10 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-white/20 transition-all duration-300 w-full sm:w-auto">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              Contracts
            </button>
          </Link>

          <Link to="/dashboard/influencer/collaborations/requests" className="w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 relative w-full sm:w-auto">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              Requests
              {requestsCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold">
                  {requestsCount}
                </span>
              )}
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-green-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-green-400 font-semibold">Active</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{activeCollabs}</p>
          <p className="text-xs sm:text-sm text-gray-400">Active Collaborations</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-5 hover:border-yellow-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            </div>
            <span className="text-xs text-yellow-400 font-semibold">Pending</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{pendingContractSign}</p>
          <p className="text-xs sm:text-sm text-gray-400">Pending Contract Sign</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-5 hover:border-blue-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            {totalMessages > 0 && (
              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-[10px] sm:text-xs font-semibold">
                {totalMessages} New
              </span>
            )}
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{totalMessages}</p>
          <p className="text-xs sm:text-sm text-gray-400">Unread Messages</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-5 hover:border-purple-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-[#C1B6FD]" />
            </div>
            <span className="text-xs text-[#C1B6FD] font-semibold">Requests</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{requestsCount}</p>
          <p className="text-xs sm:text-sm text-gray-400">Collaboration Requests</p>
        </div>
      </div>

      {/* Collaborations List */}
      <div className="space-y-4">
        {influencerCollaborationsLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-[#C1B6FD] animate-spin" />
          </div>
        ) : collaborations.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center text-gray-400">
            No active collaborations found.
          </div>
        ) : (
          collaborations.map((collab) => (
            <div 
              key={collab.id} 
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-purple-400/30 transition-all duration-300 group"
            >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center text-2xl sm:text-3xl shadow-lg shrink-0">
                  🏢
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#C1B6FD] transition-colors truncate">
                    {collab.brand}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">{collab.campaign}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  collab.status === 'pending_contract_sign'
                    ? 'bg-amber-500/20 text-amber-400'
                    : collab.status === 'live'
                    ? 'bg-blue-500/20 text-blue-400'
                    : collab.status === 'in_progress'
                    ? 'bg-green-500/20 text-green-400'
                    : collab.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {collab.status.replace('_', ' ').toUpperCase()}
                </span>
                
                {collab.unreadMessages > 0 && (
                  <Link to={`/dashboard/influencer/collaborations/${collab.id}/messages`}>
                    <button className="relative px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all">
                      <MessageSquare className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {collab.unreadMessages}
                      </span>
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progress</span>
                <span>{collab.progress}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD] transition-all duration-500"
                  style={{ width: `${collab.progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Deadline</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-white">{collab.deadline}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Earnings</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-white">{collab.earnings}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 pt-4 border-t border-white/10">
              <Link to={`/dashboard/influencer/collaborations/${collab.id}/workspace`} className="flex-1">
                <button className="w-full px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs sm:text-sm font-semibold text-gray-300 transition-all">
                  View Workspace
                </button>
              </Link>
              
              {collab.status === 'pending_contract_sign' && (
                <Link to={`/dashboard/influencer/collaborations/contracts/${collab.id}`} className="flex-1">
                  <button className="w-full px-3 sm:px-4 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg text-xs sm:text-sm font-semibold text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                    Review Contract
                  </button>
                </Link>
              )}
              
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}

export default CollaborationsOverview;
