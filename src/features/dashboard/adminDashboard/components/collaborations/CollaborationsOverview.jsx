import { Users, MessageSquare, CheckCircle, Clock, Star, Calendar, DollarSign, User, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockCollaborations } from '../adminData';

function CollaborationsOverview() {
  const collaborations = mockCollaborations;

  const activeCollabs = collaborations.filter(c => c.status === 'active').length;
  const pendingReview = collaborations.filter(c => c.status === 'pending_review').length;
  const totalMessages = collaborations.reduce((sum, c) => sum + c.unreadMessages, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Collaborations</h1>
          <p className="text-sm sm:text-base text-gray-400">View all collaborations on the platform</p>
        </div>
        <Link to="/dashboard/admin/collaborations/messages" className="w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 relative w-full sm:w-auto">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            Messages
            {totalMessages > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold">
                {totalMessages}
              </span>
            )}
          </button>
        </Link>
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
            <span className="text-xs text-yellow-400 font-semibold">Review</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{pendingReview}</p>
          <p className="text-xs sm:text-sm text-gray-400">Pending Review</p>
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
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[#C1B6FD]" />
            </div>
            <span className="text-xs text-[#C1B6FD] font-semibold">Avg</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1">4.6</p>
          <p className="text-xs sm:text-sm text-gray-400">Average Rating</p>
        </div>
      </div>

      {/* Collaborations List */}
      <div className="space-y-4">
        {collaborations.map((collab) => (
          <div 
            key={collab.id} 
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-purple-400/30 transition-all duration-300 group"
          >
            {/* Header - Who with who */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#C1B6FD] transition-colors truncate">
                  {collab.campaign}
                </h3>
                <p className="text-sm text-gray-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4 text-[#C1B6FD]" /> Owner: <span className="text-white">{collab.owner}</span>
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-green-400" /> Influencer: <span className="text-white">{collab.influencer}</span>
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {collab.platforms.map((platform) => (
                    <span key={platform} className="px-2 py-1 bg-white/5 rounded text-[10px] sm:text-xs text-gray-300">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  collab.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : collab.status === 'completed'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {collab.status.replace('_', ' ').toUpperCase()}
                </span>
                
                {collab.unreadMessages > 0 && (
                  <Link to={`/dashboard/admin/collaborations/${collab.id}/messages`}>
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

            {/* Progress and Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Progress</span>
                  <span className="text-xs font-semibold text-white">{collab.progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD]"
                    style={{ width: `${collab.progress}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">Deliverables</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-bold text-white">
                    {collab.deliverables.completed}/{collab.deliverables.total}
                  </span>
                  <span className="text-xs text-gray-400">completed</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">Payment Status</p>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold ${
                  collab.payment === 'paid' 
                    ? 'bg-green-500/20 text-green-400'
                    : collab.payment === 'approved'
                    ? 'bg-blue-500/20 text-blue-400'
                    : collab.payment === 'processing'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  <DollarSign className="w-3 h-3" />
                  {collab.payment}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">Deadline</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-white">{collab.deadline}</span>
                </div>
              </div>
            </div>

            {/* Rating Section */}
            {collab.rating && (
              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold text-white">{collab.rating}</span>
                <span className="text-xs text-gray-400">• Collaboration Rating</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 pt-4 border-t border-white/10">
              <Link to={`/dashboard/admin/collaborations/${collab.id}`} className="flex-1">
                <button className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg text-xs sm:text-sm font-semibold text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                  <Eye className="w-4 h-4" /> View full details
                </button>
              </Link>
              <Link to={`/dashboard/admin/collaborations/${collab.id}/workspace`} className="flex-1">
                <button className="w-full px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs sm:text-sm font-semibold text-gray-300 transition-all">
                  Workspace
                </button>
              </Link>
              {collab.status === 'pending_review' && (
                <Link to={`/dashboard/admin/collaborations/${collab.id}/review`} className="flex-1">
                  <button className="w-full px-3 sm:px-4 py-2 bg-[#745CB4]/50 hover:bg-[#745CB4] rounded-lg text-xs sm:text-sm font-semibold text-white transition-all">
                    Review & Rate
                  </button>
                </Link>
              )}
              <Link to={`/dashboard/admin/collaborations/${collab.id}/messages`} className="flex-1">
                <button className="w-full px-3 sm:px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-xs sm:text-sm font-semibold text-blue-400 transition-all">
                  Messages {collab.unreadMessages > 0 && `(${collab.unreadMessages})`}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CollaborationsOverview;
