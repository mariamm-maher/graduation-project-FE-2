import { Search, Send, X, Check, Clock, User, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCollaborationRequestsStore from '../../../../../../stores/CollaborationRequestsStore';
import { toast } from 'react-toastify';

function Requests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [negotiationOpenId, setNegotiationOpenId] = useState(null);
  const [negotiationBudget, setNegotiationBudget] = useState('');
  const [negotiationMessage, setNegotiationMessage] = useState('');
  
  const navigate = useNavigate();

  const { sentRequests, getMySentRequests, isLoading, error, respondToRequest, cancelRequest } = useCollaborationRequestsStore();

  useEffect(() => {
    getMySentRequests({ page: 1, limit: 10 });
  }, [getMySentRequests]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const filteredRequests = (sentRequests || []).filter(request => {
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
      cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      negotiating: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
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

  const handleAccept = async (requestId) => {
    const res = await respondToRequest(requestId, { action: 'accept' });
    if (res?.success) toast.success('Request accepted');
  };

  const handleReject = async (requestId) => {
    const res = await respondToRequest(requestId, { action: 'reject' });
    if (res?.success) toast.success('Request rejected');
  };

  const handleCancel = async (requestId) => {
    const res = await cancelRequest(requestId);
    if (res?.success) toast.success('Request cancelled successfully');
  };

  const openNegotiate = (request) => {
    setNegotiationOpenId(request.id);
    setNegotiationBudget(request.counterPrice?.toString() || request.proposedBudget?.toString() || '');
    setNegotiationMessage('');
  };

  const submitNegotiation = async (requestId) => {
    const budget = Number(negotiationBudget);
    if (!budget || budget <= 0) {
      toast.error('Enter a valid budget');
      return;
    }
    const payload = {
      action: 'counter',
      responseMessage: negotiationMessage || undefined,
      newBudget: budget
    };
    const res = await respondToRequest(requestId, payload);
    if (res?.success) {
      toast.success('Counter offer sent');
      setNegotiationOpenId(null);
    }
  };

  if (isLoading) {
    return <div>Loading sent requests...</div>;
  }

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
          <p className="text-2xl font-bold text-white">{(sentRequests || []).length}</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-400">
            {(sentRequests || []).filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Accepted</p>
          <p className="text-2xl font-bold text-green-400">
            {(sentRequests || []).filter(r => r.status === 'accepted').length}
          </p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-400">
            {(sentRequests || []).filter(r => r.status === 'rejected').length}
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
                      <h3 className="text-lg font-bold text-white">{request.influencer?.firstName || request.influencer?.lastName ? `${request.influencer.firstName} ${request.influencer.lastName}` : request.influencerName || 'Unknown'}</h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{(request.influencer?.influencerProfile?.followersCount || request.influencerFollowers || 0).toLocaleString()} followers</p>
                    <p className="text-sm text-gray-400">
                      <span className="text-[#C1B6FD] font-semibold">{request.campaign?.campaignName || request.campaignName || 'Campaign'}</span>
                      {' • '}
                      <Clock className="inline w-3 h-3" /> {getTimeAgo(request.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Budget */}
                <div className="flex flex-col gap-2">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 min-w-[140px]">
                    <p className="text-xs text-gray-400 mb-1">Proposed Budget</p>
                    <p className="text-xl font-bold text-white ${request.status === 'negotiating' ? 'line-through text-gray-500' : ''}">
                      ${(request.proposedBudget || 0).toLocaleString()}
                    </p>
                  </div>
                  
                  {request.status === 'negotiating' && request.counterPrice && (
                    <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 min-w-[140px]">
                      <p className="text-xs text-blue-400 mb-1">Counter Offer</p>
                      <p className="text-xl font-bold text-white">${(request.counterPrice).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="grid gap-4 mb-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase">Original Message</span>
                  </div>
                  <p className="text-sm text-gray-300">{request.message || 'No message provided.'}</p>
                </div>

                {request.status === 'negotiating' && request.responseMessage && (
                  <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/20">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-semibold text-blue-400 uppercase">Negotiation Message</span>
                      </div>
                      {request.lastCounteredByRole && (
                        <span className="text-xs font-medium text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                          By {request.lastCounteredByRole === 'owner' ? 'You' : 'Influencer'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">{request.responseMessage}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {(request.status === 'pending' || request.status === 'negotiating') ? (
                request.lastCounteredByRole === 'owner' || (!request.lastCounteredByRole && request.status === 'pending') ? (
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                    <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Waiting for Influencer's response...
                    </p>
                    <button
                      onClick={() => handleCancel(request.id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-lg font-medium transition-all"
                    >
                      Cancel Request
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => openNegotiate(request)}
                      className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all"
                    >
                      Send New Budget
                    </button>
                  </div>

                  {negotiationOpenId === request.id && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 mt-3 animate-in fade-in slide-in-from-top-2">
                      <div className="mb-3">
                        <label className="block text-xs text-gray-400 mb-1">New Budget Proposal ($)</label>
                        <input
                          type="number"
                          value={negotiationBudget}
                          onChange={(e) => setNegotiationBudget(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
                          placeholder="Enter new budget"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-xs text-gray-400 mb-1">Message (optional)</label>
                        <textarea
                          value={negotiationMessage}
                          onChange={(e) => setNegotiationMessage(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
                          rows={3}
                          placeholder="Explain your counter offer..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => submitNegotiation(request.id)}
                          className="px-4 py-2 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] hover:from-[#634ca3] hover:to-[#a99bed] text-white rounded-lg font-medium transition-all"
                        >
                          Submit Counter Offer
                        </button>
                        <button
                          onClick={() => setNegotiationOpenId(null)}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                )
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
