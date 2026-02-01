import { Search, CheckCircle, Calendar, Users, Target, Clock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ActiveCollaborations() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Mock data - Filter: Collaboration.status = 'active'
  const activeCollaborations = [
    {
      id: 1,
      campaignId: 1,
      campaignName: 'Summer Fashion Launch',
      influencerId: 2,
      influencerName: 'Sarah Johnson',
      influencerImage: null,
      contractId: 1,
      status: 'active',
      budget: 5000,
      startDate: '2026-01-15',
      endDate: '2026-03-15',
      // Task metrics (from CollaborationTask table)
      totalTasks: 12,
      completedTasks: 7,
      // Content metrics (from ContentCalendar table)
      scheduledContent: 8,
      postedContent: 5,
      createdAt: '2026-01-10'
    },
    {
      id: 5,
      campaignId: 4,
      campaignName: 'Tech Product Launch Q1',
      influencerId: 6,
      influencerName: 'Alex Rivera',
      influencerImage: null,
      contractId: 5,
      status: 'active',
      budget: 7500,
      startDate: '2026-01-20',
      endDate: '2026-04-20',
      totalTasks: 15,
      completedTasks: 3,
      scheduledContent: 10,
      postedContent: 2,
      createdAt: '2026-01-15'
    }
  ];

  const filteredCollaborations = activeCollaborations.filter(collab =>
    searchQuery === '' ||
    collab.campaignName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collab.influencerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate time progress
  const getTimeProgress = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    const percentage = Math.min(100, Math.max(0, (elapsed / total) * 100));
    return Math.round(percentage);
  };

  // Get days remaining
  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Active Collaborations</h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Currently running collaboration relationships ({filteredCollaborations.length})
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-md border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Active Now</p>
          <p className="text-2xl font-bold text-green-400">{activeCollaborations.length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Tasks</p>
          <p className="text-2xl font-bold text-white">
            {activeCollaborations.reduce((sum, c) => sum + c.totalTasks, 0)}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Completed Tasks</p>
          <p className="text-2xl font-bold text-white">
            {activeCollaborations.reduce((sum, c) => sum + c.completedTasks, 0)}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Content Posted</p>
          <p className="text-2xl font-bold text-white">
            {activeCollaborations.reduce((sum, c) => sum + c.postedContent, 0)}
          </p>
        </div>
      </div>

      {/* Search */}
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

      {/* Collaborations List */}
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
            const taskProgress = collab.totalTasks > 0 
              ? Math.round((collab.completedTasks / collab.totalTasks) * 100) 
              : 0;

            return (
              <div
                key={collab.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3
                        onClick={() => navigate(`/dashboard/owner/collaborations/${collab.id}/workspace`)}
                        className="text-xl font-bold text-white cursor-pointer hover:text-green-400 transition-colors"
                      >
                        {collab.campaignName}
                      </h3>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold animate-pulse">
                        ● Active
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{collab.influencerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-amber-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">{daysRemaining} days remaining</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Progress */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Timeline Progress</span>
                    <span className="text-sm font-semibold text-white">{timeProgress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700"
                      style={{ width: `${timeProgress}%` }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                  {/* Tasks */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <p className="text-xs text-gray-400">Tasks</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{collab.completedTasks}/{collab.totalTasks}</p>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                        style={{ width: `${taskProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Content Posted */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-purple-400" />
                      <p className="text-xs text-gray-400">Content Posted</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-400">{collab.postedContent}</p>
                    <p className="text-xs text-gray-400 mt-1">{collab.scheduledContent} scheduled</p>
                  </div>

                  {/* Budget */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <p className="text-xs text-gray-400">Budget</p>
                    </div>
                    <p className="text-2xl font-bold text-white">${collab.budget.toLocaleString()}</p>
                  </div>

                  {/* Duration */}
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

                {/* Actions */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => navigate(`/dashboard/owner/collaborations/${collab.id}/workspace`)}
                    className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg hover:shadow-green-500/30 rounded-xl text-white font-medium transition-all"
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
