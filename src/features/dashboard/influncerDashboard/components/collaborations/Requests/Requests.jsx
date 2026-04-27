import { Search, X, Check, Clock, User, MessageSquare, Loader2, DollarSign, Handshake, AlertCircle, ChevronDown, Briefcase, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import useCollaborationRequestsStore from '../../../../../../stores/CollaborationRequestsStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Requests() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [negotiationOpenId, setNegotiationOpenId] = useState(null);
  const [negotiationBudget, setNegotiationBudget] = useState('');
  const [negotiationMessage, setNegotiationMessage] = useState('');
  const [respondingId, setRespondingId] = useState(null);

  const { receivedRequests, isLoading, error, respondToRequest, getMyReceivedRequests } = useCollaborationRequestsStore();

  useEffect(() => {
    getMyReceivedRequests({ page: 1, limit: 10 });
  }, [getMyReceivedRequests]);

  useEffect(() => {
    if (error) {
      toast.error(error === 'Unauthorized' ? 'Not authenticated — please log in.' : error);
    }
  }, [error]);

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

  const statusFilters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'negotiating', label: 'Negotiating' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const countByStatus = (status) => (receivedRequests || []).filter(r => r.status === status).length;

  const handleAccept = async (requestId) => {
    setRespondingId(requestId);
    const res = await respondToRequest(requestId, { action: 'accept' });
    if (res?.success) {
      toast.success('Request accepted');
    } else {
      toast.error(res?.error || 'Failed to accept request');
    }
    setRespondingId(null);
  };

  const handleReject = async (requestId) => {
    setRespondingId(requestId);
    const res = await respondToRequest(requestId, { action: 'reject' });
    if (res?.success) {
      toast.success('Request rejected');
    } else {
      toast.error(res?.error || 'Failed to reject request');
    }
    setRespondingId(null);
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

    setRespondingId(requestId);
    const res = await respondToRequest(requestId, payload);
    if (res?.success) {
      toast.success('Counter offer sent');
      closeNegotiate();
    } else {
      toast.error(res?.error || 'Failed to send counter offer');
    }
    setRespondingId(null);
  };

  const allRequests = receivedRequests || [];
  const total = allRequests.length;
  const pendingCount = countByStatus('pending');
  const negotiatingCount = countByStatus('negotiating');
  const acceptedCount = countByStatus('accepted');

  return (
    <div className="space-y-7">

      {/* ── Header ── */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-linear-to-br from-[#1A112C] via-[#241A3A] to-[#1A112C] p-6 sm:p-8">
        <div className="absolute inset-0 bg-linear-to-br from-[#745CB4]/10 via-transparent to-[#C1B6FD]/5 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-[#745CB4]/20 rounded-xl border border-[#745CB4]/30">
                <Handshake className="w-5 h-5 text-[#C1B6FD]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Collaboration Requests</h1>
            </div>
            <p className="text-gray-400 text-sm mt-1 ml-1">Manage incoming brand collaboration offers</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {pendingCount > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded-full text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {pendingCount} Pending
              </span>
            )}
            {negotiatingCount > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/15 border border-blue-500/30 text-blue-300 rounded-full text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                {negotiatingCount} Negotiating
              </span>
            )}
            <span className="px-3 py-1.5 bg-white/10 border border-white/10 text-gray-300 rounded-full text-xs font-semibold">
              {total} Total
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: total, color: 'from-[#745CB4]/20 to-[#C1B6FD]/10', border: 'border-[#745CB4]/25', text: 'text-[#C1B6FD]' },
          { label: 'Pending', value: pendingCount, color: 'from-amber-500/15 to-amber-500/5', border: 'border-amber-500/25', text: 'text-amber-300' },
          { label: 'Negotiating', value: negotiatingCount, color: 'from-blue-500/15 to-blue-500/5', border: 'border-blue-500/25', text: 'text-blue-300' },
          { label: 'Accepted', value: acceptedCount, color: 'from-green-500/15 to-green-500/5', border: 'border-green-500/25', text: 'text-green-300' },
        ].map((stat) => (
          <div key={stat.label} className={`bg-linear-to-br ${stat.color} backdrop-blur-sm border ${stat.border} rounded-xl p-4`}>
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Search + Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by campaign or brand..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]/40 focus:border-[#C1B6FD]/40 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilterStatus(f.value)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                filterStatus === f.value
                  ? 'bg-[#745CB4] border-[#C1B6FD]/40 text-white shadow-md shadow-[#745CB4]/30'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex items-center justify-center gap-3 py-16 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin text-[#C1B6FD]" />
          <span className="text-sm">Loading requests...</span>
        </div>
      )}

      {/* ── Empty State ── */}
      {!isLoading && total === 0 && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-14 text-center">
          <div className="w-16 h-16 bg-[#745CB4]/15 border border-[#745CB4]/25 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-[#C1B6FD]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Requests Yet</h3>
          <p className="text-gray-400 text-sm">Brand collaboration requests will appear here</p>
        </div>
      )}

      {!isLoading && total > 0 && filteredRequests.length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
          <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No requests match your current filters</p>
        </div>
      )}

      {/* ── Request Cards ── */}
      {!isLoading && filteredRequests.length > 0 && (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const ownerName = `${request.owner?.firstName || ''} ${request.owner?.lastName || ''}`.trim() || 'Brand Owner';
            const businessName = request.owner?.ownerProfile?.businessName || '';
            const campaignName = request.campaign?.campaignName ?? request.campaignName ?? '—';
            const isResponding = respondingId === request.id;
            const isNegotiateOpen = negotiationOpenId === request.id;
            const waitingForOwner = request.lastCounteredByRole === 'influencer';

            return (
              <div
                key={request.id}
                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-[#745CB4]/40 hover:shadow-lg hover:shadow-[#745CB4]/10 transition-all duration-300"
              >
                {/* Card top accent bar by status */}
                <div className={`h-0.5 w-full ${
                  request.status === 'pending' ? 'bg-linear-to-r from-amber-500/60 to-amber-400/20' :
                  request.status === 'negotiating' ? 'bg-linear-to-r from-blue-500/60 to-blue-400/20' :
                  request.status === 'accepted' ? 'bg-linear-to-r from-green-500/60 to-green-400/20' :
                  request.status === 'rejected' ? 'bg-linear-to-r from-red-500/60 to-red-400/20' :
                  'bg-linear-to-r from-white/10 to-transparent'
                }`} />

                <div className="p-5 sm:p-6">
                  {/* ── Card Header ── */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center shadow-lg shadow-[#745CB4]/30">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-white">{ownerName}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        {businessName && (
                          <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                            <Briefcase className="w-3 h-3" /> {businessName}
                          </p>
                        )}
                        <p className="text-xs text-[#C1B6FD] font-semibold truncate">{campaignName}</p>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {getTimeAgo(request.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Budget Panel */}
                    <div className="flex gap-2 flex-shrink-0">
                      <div className={`rounded-xl p-3.5 border text-right min-w-[120px] ${
                        request.status === 'negotiating'
                          ? 'bg-white/5 border-white/10'
                          : 'bg-[#745CB4]/10 border-[#745CB4]/25'
                      }`}>
                        <div className="flex items-center justify-end gap-1 mb-0.5">
                          <DollarSign className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-400">Proposed</p>
                        </div>
                        <p className={`text-xl font-bold ${request.status === 'negotiating' ? 'text-gray-500 line-through' : 'text-white'}`}>
                          ${(request.proposedBudget || 0).toLocaleString()}
                        </p>
                      </div>

                      {request.status === 'negotiating' && request.counterPrice && (
                        <div className="bg-blue-500/10 border border-blue-500/25 rounded-xl p-3.5 text-right min-w-[120px]">
                          <div className="flex items-center justify-end gap-1 mb-0.5">
                            <DollarSign className="w-3 h-3 text-blue-400" />
                            <p className="text-xs text-blue-400">Counter</p>
                          </div>
                          <p className="text-xl font-bold text-white">${request.counterPrice.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Messages ── */}
                  <div className="space-y-3 mb-5">
                    <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Message from Brand</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{request.message || '—'}</p>
                    </div>

                    {request.status === 'negotiating' && request.responseMessage && (
                      <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/20">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Negotiation Note</span>
                          </div>
                          {request.lastCounteredByRole && (
                            <span className="text-[10px] font-semibold text-blue-300/80 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                              By {request.lastCounteredByRole === 'influencer' ? 'You' : 'Brand'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{request.responseMessage}</p>
                      </div>
                    )}
                  </div>

                  {/* ── Actions ── */}
                  {(request.status === 'pending' || request.status === 'negotiating') ? (
                    waitingForOwner ? (
                      <div className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Waiting for brand owner's response…
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleAccept(request.id)}
                            disabled={isResponding}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-green-500/20 disabled:opacity-60"
                          >
                            {isResponding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            {request.status === 'negotiating' ? 'Accept' : 'Accept'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(request.id)}
                            disabled={isResponding}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                          >
                            {isResponding ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => (isNegotiateOpen ? closeNegotiate() : openNegotiate(request))}
                            disabled={isResponding}
                            className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl text-sm font-semibold transition-all disabled:opacity-60 ${
                              isNegotiateOpen
                                ? 'bg-[#745CB4]/20 border-[#745CB4]/40 text-[#C1B6FD]'
                                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                            }`}
                          >
                            <Handshake className="w-4 h-4" />
                            Counter
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isNegotiateOpen ? 'rotate-180' : ''}`} />
                          </button>
                        </div>

                        {/* Negotiation Panel */}
                        {isNegotiateOpen && (
                          <div className="bg-[#1A112C]/80 border border-[#745CB4]/25 rounded-xl p-4 space-y-3">
                            <p className="text-xs font-semibold text-[#C1B6FD] uppercase tracking-widest mb-1">Send Counter Offer</p>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1.5">Your Budget ($)</label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                  type="number"
                                  value={negotiationBudget}
                                  onChange={(e) => setNegotiationBudget(e.target.value)}
                                  placeholder="e.g. 2500"
                                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 text-white text-sm border border-white/10 focus:outline-none focus:border-[#C1B6FD]/40 focus:ring-1 focus:ring-[#C1B6FD]/20 transition-all"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1.5">Message <span className="text-gray-600">(optional)</span></label>
                              <textarea
                                value={negotiationMessage}
                                onChange={(e) => setNegotiationMessage(e.target.value)}
                                placeholder="Explain your counter offer..."
                                className="w-full px-4 py-2.5 rounded-lg bg-white/5 text-white text-sm border border-white/10 focus:outline-none focus:border-[#C1B6FD]/40 focus:ring-1 focus:ring-[#C1B6FD]/20 transition-all resize-none"
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => submitNegotiation(request.id)}
                                disabled={isResponding}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] hover:from-[#8B6EC7] hover:to-[#C1B6FD] text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-60 shadow-md shadow-[#745CB4]/20"
                              >
                                {isResponding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                                Send Counter
                              </button>
                              <button
                                type="button"
                                onClick={closeNegotiate}
                                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg text-sm font-medium transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-between gap-3 p-3.5 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-sm text-gray-400">
                        {request.status === 'accepted' && <span className="text-green-400 font-semibold">✓ Request accepted</span>}
                        {request.status === 'rejected' && <span className="text-red-400 font-semibold">✗ Request rejected</span>}
                        {request.status !== 'accepted' && request.status !== 'rejected' && `Status: ${request.status}`}
                      </p>
                      {request.status === 'accepted' && (
                        <button
                          type="button"
                          onClick={() => navigate(`/dashboard/influencer/collaborations/${request.collaborationId || request.id}/workspace`)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#745CB4]/20 hover:bg-[#745CB4]/30 border border-[#745CB4]/30 rounded-lg text-[#C1B6FD] text-sm font-semibold transition-all"
                        >
                          View Workspace <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Requests;
