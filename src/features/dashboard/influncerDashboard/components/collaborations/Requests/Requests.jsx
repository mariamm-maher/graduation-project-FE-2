import { Search, X, Check, Clock, User, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import useInfluncerStore from '../../../../../../stores/influncerStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Requests() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [negotiationOpenId, setNegotiationOpenId] = useState(null);
  const [negotiationBudget, setNegotiationBudget] = useState('');
  const [negotiationMessage, setNegotiationMessage] = useState('');

  const receivedRequests = useInfluncerStore((s) => s.receivedRequests);
  const receivedRequestsLoading = useInfluncerStore((s) => s.receivedRequestsLoading);
  const receivedRequestsError = useInfluncerStore((s) => s.receivedRequestsError);
  const respondToRequest = useInfluncerStore((s) => s.respondToRequest);
  const respondingId = useInfluncerStore((s) => s.respondingId);
  const getReceivedRequests = useInfluncerStore((s) => s.getReceivedRequests);

  useEffect(() => {
    getReceivedRequests(1, 10);
  }, [getReceivedRequests]);

  useEffect(() => {
    if (receivedRequestsError) {
      toast.error(receivedRequestsError === 'Unauthorized' ? 'Not authenticated — please log in.' : receivedRequestsError);
    }
  }, [receivedRequestsError]);
console.log('Received requests:', receivedRequests);
  const filteredRequests = (receivedRequests || []).filter(request => {
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
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
      </span>
    );
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(dateString).toLocaleString();
  };

  if (receivedRequestsLoading) return <div>Loading requests...</div>;

  const handleAccept = async (requestId) => {
    const res = await respondToRequest(requestId, { action: 'accept' });
    if (res?.success) {
      toast.success('Request accepted');
    } else {
      toast.error(res?.error || 'Failed to accept request');
    }
  };

  const handleReject = async (requestId) => {
    const res = await respondToRequest(requestId, { action: 'reject' });
    if (res?.success) {
      toast.success('Request rejected');
    } else {
      toast.error(res?.error || 'Failed to reject request');
    }
  };

  const openNegotiate = (request) => {
    setNegotiationOpenId(request.id);
    setNegotiationBudget(request.proposedBudget?.toString() || '');
    setNegotiationMessage('');
  };

  const closeNegotiate = () => {
    setNegotiationOpenId(null);
    setNegotiationBudget('');
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
      closeNegotiate();
    } else {
      toast.error(res?.error || 'Failed to send counter offer');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Collaboration Requests</h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">Incoming requests ({(receivedRequests || []).length})</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Requests</p>
          <p className="text-2xl font-bold text-white">{(receivedRequests || []).length}</p>
        </div>
      </div>

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

      {(receivedRequests || []).length === 0 ? (
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
            <div key={request.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white">{(request.owner?.firstName || '') + ' ' + (request.owner?.lastName || '')}</h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-gray-400 mb-1">{request.owner?.ownerProfile?.businessName || ''}</p>
                    <p className="text-sm text-gray-400 mb-2">{(request.influencerFollowers || 0).toLocaleString()} followers</p>
                    <p className="text-sm text-gray-400"><span className="text-[#C1B6FD] font-semibold">{request.campaign?.campaignName ?? request.campaignName}</span> {' • '} <Clock className="inline w-3 h-3" /> {getTimeAgo(request.createdAt)}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 min-w-[140px]">
                    <p className="text-xs text-gray-400 mb-1">Proposed Budget</p>
                    <p className={`text-xl font-bold ${request.status === 'negotiating' ? 'text-gray-500 line-through' : 'text-white'}`}>
                      ${request.proposedBudget?.toLocaleString() || 0}
                    </p>
                  </div>
                  
                  {request.status === 'negotiating' && request.counterPrice && (
                    <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 min-w-[140px]">
                      <p className="text-xs text-blue-400 mb-1">Counter Offer</p>
                      <p className="text-xl font-bold text-white">${request.counterPrice.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 mb-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase">Original Message</span>
                  </div>
                  <p className="text-sm text-gray-300">{request.message}</p>
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
                          By {request.lastCounteredByRole === 'influencer' ? 'You' : 'Brand Owner'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">{request.responseMessage}</p>
                  </div>
                )}
              </div>

              {(request.status === 'pending' || request.status === 'negotiating') ? (
                request.lastCounteredByRole === 'influencer' ? (
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                    <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Waiting for Brand Owner's response...
                    </p>
                  </div>
                ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleAccept(request.id)}
                      disabled={respondingId === request.id}
                      className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      {request.status === 'negotiating' ? 'Accept Counter' : 'Accept'}
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={respondingId === request.id}
                      className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => openNegotiate(request)}
                      className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all"
                    >
                      Negotiate
                    </button>
                  </div>

                  {negotiationOpenId === request.id && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="mb-2">
                        <label className="block text-xs text-gray-400 mb-1">Proposed Budget</label>
                        <input
                          type="number"
                          value={negotiationBudget}
                          onChange={(e) => setNegotiationBudget(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/3 text-white border border-white/10 focus:outline-none"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="block text-xs text-gray-400 mb-1">Message (optional)</label>
                        <textarea
                          value={negotiationMessage}
                          onChange={(e) => setNegotiationMessage(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/3 text-white border border-white/10 focus:outline-none"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => submitNegotiation(request.id)} disabled={respondingId === request.id} className="px-4 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg">Send Counter</button>
                        <button onClick={closeNegotiate} className="px-4 py-2 bg-white/5 text-white rounded-lg">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
                )
              ) : (
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-400">{request.status === 'accepted' ? 'Request accepted' : request.status === 'rejected' ? 'Request rejected' : 'Status: ' + request.status}</p>
                  <button onClick={() => navigate(`/dashboard/influencer/collaborations/${request.collaborationId || request.id}/workspace`)} className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white text-sm font-medium transition-all">View Collaboration</button>
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
