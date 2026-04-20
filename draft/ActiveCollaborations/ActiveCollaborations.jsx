import { Search, CheckCircle, Calendar, Users, Target, Clock, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCollaborationStore from '../../src/stores/collaborationStore';

function ActiveCollaborations() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const {
    ownerCollaborations,
    isOwnerCollaborationsLoading,
    ownerCollaborationsError,
    getMyOwnerCollaborations,
  } = useCollaborationStore();

  useEffect(() => {
    getMyOwnerCollaborations({ status: 'active' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCollaborations = useMemo(() => {
    const activeStatuses = new Set(['active', 'in-progress', 'in_progress']);

    return (ownerCollaborations || [])
      .filter((collab) => activeStatuses.has((collab?.status || '').toLowerCase()))
      .map((collab, index) => {
        const influencer = collab?.influencer || collab?.influencerId || {};
        const influencerName =
          `${influencer?.firstName || influencer?.user?.firstName || ''} ${
            influencer?.lastName || influencer?.user?.lastName || ''
          }`.trim() || collab?.influencerName || 'Unknown Influencer';

        const tasks = collab?.tasks || [];
        const totalTasks = Number(collab?.totalTasks ?? tasks.length ?? 0);
        const completedTasks = Number(
          collab?.completedTasks ??
            tasks.filter((task) => task?.completed || task?.status === 'completed').length
        );

        const fallbackId = `${
          collab?._id || collab?.id || collab?.campaign?._id || collab?.campaignId || 'collab'
        }-${index}`;

        return {
          id: collab?._id || collab?.id || fallbackId,
          campaignName:
            collab?.campaign?.campaignName ||
            collab?.campaign?.name ||
            collab?.campaignName ||
            'Untitled Campaign',
          influencerName,
          budget: Number(
            collab?.agreedBudget ??
              collab?.budget ??
              collab?.proposedBudget ??
              collab?.campaign?.totalBudget ??
              0
          ),
          startDate:
            collab?.startDate || collab?.campaign?.startDate || collab?.createdAt || new Date().toISOString(),
          endDate:
            collab?.endDate || collab?.campaign?.endDate || collab?.updatedAt || new Date().toISOString(),
          totalTasks,
          completedTasks,
          scheduledContent: Number(collab?.scheduledContent ?? 0),
          postedContent: Number(collab?.postedContent ?? 0),
        };
      });
  }, [ownerCollaborations]);

  const filteredCollaborations = activeCollaborations.filter((collab) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return (
      collab.campaignName?.toLowerCase().includes(query) ||
      collab.influencerName?.toLowerCase().includes(query)
    );
  });

  const getTimeProgress = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    return Math.round(Math.min(100, Math.max(0, (elapsed / total) * 100)));
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  };

  if (isOwnerCollaborationsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Active Collaborations</h1>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
            <p className="text-sm text-gray-400">Loading active collaborations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (ownerCollaborationsError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Active Collaborations</h1>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-xl font-bold text-white">Failed to load active collaborations</h3>
            <p className="text-gray-400">{ownerCollaborationsError}</p>
            <button
              onClick={() => getMyOwnerCollaborations({ status: 'active' })}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Active Collaborations</h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Currently running collaboration relationships ({filteredCollaborations.length})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-green-500/10 to-green-600/5 backdrop-blur-md border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Active Now</p>
          <p className="text-2xl font-bold text-green-400">{activeCollaborations.length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Tasks</p>
          <p className="text-2xl font-bold text-white">{activeCollaborations.reduce((sum, c) => sum + c.totalTasks, 0)}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Completed Tasks</p>
          <p className="text-2xl font-bold text-white">{activeCollaborations.reduce((sum, c) => sum + c.completedTasks, 0)}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Content Posted</p>
          <p className="text-2xl font-bold text-white">{activeCollaborations.reduce((sum, c) => sum + c.postedContent, 0)}</p>
        </div>
      </div>

      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search active collaborations..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
        />
      </div>

      {filteredCollaborations.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Active Collaborations</h3>
          <p className="text-gray-400">You don't have any active collaborations at the moment</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredCollaborations.map((collab) => {
            const timeProgress = getTimeProgress(collab.startDate, collab.endDate);
            const daysRemaining = getDaysRemaining(collab.endDate);
            const taskProgress = collab.totalTasks > 0 ? Math.round((collab.completedTasks / collab.totalTasks) * 100) : 0;

            return (
              <div
                key={collab.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3
                        onClick={() => navigate(`/dashboard/owner/collaborations/${collab.id}/workspace`)}
                        className="text-xl font-bold text-white cursor-pointer hover:text-green-400 transition-colors"
                      >
                        {collab.campaignName}
                      </h3>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">● Active</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{collab.influencerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-amber-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">
                          {daysRemaining > 0
                            ? `${daysRemaining} days remaining`
                            : daysRemaining === 0
                              ? 'Ends today'
                              : `${Math.abs(daysRemaining)} days overdue`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Timeline Progress</span>
                    <span className="text-sm font-semibold text-white">{timeProgress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-green-400 to-green-600 rounded-full transition-all duration-700"
                      style={{ width: `${timeProgress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <p className="text-xs text-gray-400">Tasks</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{collab.completedTasks}/{collab.totalTasks}</p>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-green-400 to-green-600 rounded-full"
                        style={{ width: `${taskProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-purple-400" />
                      <p className="text-xs text-gray-400">Content Posted</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-400">{collab.postedContent}</p>
                    <p className="text-xs text-gray-400 mt-1">{collab.scheduledContent} scheduled</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <p className="text-xs text-gray-400">Budget</p>
                    </div>
                    <p className="text-2xl font-bold text-white">${collab.budget.toLocaleString()}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <p className="text-xs text-gray-400">Duration</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {Math.ceil((new Date(collab.endDate) - new Date(collab.startDate)) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => navigate(`/dashboard/owner/collaborations/${collab.id}/workspace`)}
                    className="px-4 py-3 bg-linear-to-r from-green-500 to-green-600 hover:shadow-lg hover:shadow-green-500/30 rounded-xl text-white font-medium transition-all"
                  >
                    Open Workspace
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/owner/collaborations/board?collaboration=${collab.id}`)}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white font-medium transition-all"
                  >
                    View Board
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/owner/collaborations/chat-rooms?collaboration=${collab.id}`)}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white font-medium transition-all"
                  >
                    Chat Room
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ActiveCollaborations;
