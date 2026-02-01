import { Search, Send, X, Check, Clock, User, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Requests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  // Mock data - CollaborationRequest entity from ERD
  const collaborationRequests = [
    {
      id: 1,
      campaignId: 1,
      campaignName: 'Summer Fashion Launch',
      influencerId: 8,
      influencerName: 'Sophie Martinez',
      influencerFollowers: 125000,
      status: 'pending',
      proposedBudget: 4800,
      message: 'I would love to collaborate on this campaign. My audience aligns perfectly with your target demographic.',
      createdAt: '2026-01-28T10:30:00',
      updatedAt: '2026-01-28T10:30:00'
    },
    {
      id: 2,
      campaignId: 4,
      campaignName: 'Tech Product Launch Q1',
      influencerId: 9,
      influencerName: 'David Kim',
      influencerFollowers: 89000,
      status: 'pending',
      proposedBudget: 6200,
      message: 'As a tech reviewer with 89K followers, I can provide authentic product reviews and unboxing content.',
      createdAt: '2026-01-27T14:15:00',
      updatedAt: '2026-01-27T14:15:00'
    },
    {
      id: 3,
      campaignId: 1,
      campaignName: 'Summer Fashion Launch',
      influencerId: 10,
      influencerName: 'Rachel Green',
      influencerFollowers: 210000,
      status: 'accepted',
      proposedBudget: 8500,
      message: 'Excited to work together! I specialize in fashion content and have strong engagement rates.',
      createdAt: '2026-01-25T09:00:00',
      updatedAt: '2026-01-26T16:45:00'
    },
    {
      id: 4,
      campaignId: 3,
      campaignName: 'Spring Wellness Campaign',
      influencerId: 11,
      influencerName: 'Maya Patel',
      influencerFollowers: 67000,
      status: 'rejected',
      proposedBudget: 3500,
      message: 'I focus on wellness and mindfulness content. Would love to be part of this campaign.',
      createdAt: '2026-01-24T11:20:00',
      updatedAt: '2026-01-25T10:00:00'
    }
  ];

  const filteredRequests = collaborationRequests.filter(request => {
    const matchesSearch = searchQuery === '' ||
      request.campaignName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.influencerName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      accepted: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
      cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || ''}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDateTime(dateString);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Collaboration Requests</h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Incoming requests from influencers ({filteredRequests.length})
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Requests</p>
          <p className="text-2xl font-bold text-white">{collaborationRequests.length}</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-400">
            {collaborationRequests.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Accepted</p>
          <p className="text-2xl font-bold text-green-400">
            {collaborationRequests.filter(r => r.status === 'accepted').length}
          </p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-400">
            {collaborationRequests.filter(r => r.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search requests..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-transparent transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Requests Found</h3>
          <p className="text-gray-400">No collaboration requests match your filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Influencer Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white">{request.influencerName}</h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{request.influencerFollowers.toLocaleString()} followers</p>
                    <p className="text-sm text-gray-400">
                      <span className="text-[#C1B6FD] font-semibold">{request.campaignName}</span>
                      {' • '}
                      <Clock className="inline w-3 h-3" /> {getTimeAgo(request.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Budget */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 min-w-[140px]">
                  <p className="text-xs text-gray-400 mb-1">Proposed Budget</p>
                  <p className="text-2xl font-bold text-white">${request.proposedBudget.toLocaleString()}</p>
                </div>
              </div>

              {/* Message */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-400 uppercase">Message</span>
                </div>
                <p className="text-sm text-gray-300">{request.message}</p>
              </div>

              {/* Actions */}
              {request.status === 'pending' ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      // Handle accept logic
                      console.log('Accept request:', request.id);
                    }}
                    className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Accept Request
                  </button>
                  <button
                    onClick={() => {
                      // Handle reject logic
                      console.log('Reject request:', request.id);
                    }}
                    className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-400">
                    {request.status === 'accepted' && 'Request accepted - Contract created'}
                    {request.status === 'rejected' && 'Request was rejected'}
                    {request.status === 'cancelled' && 'Request was cancelled'}
                  </p>
                  <button
                    onClick={() => navigate(`/dashboard/owner/campaigns/${request.campaignId}`)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white text-sm font-medium transition-all"
                  >
                    View Campaign
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Requests;
