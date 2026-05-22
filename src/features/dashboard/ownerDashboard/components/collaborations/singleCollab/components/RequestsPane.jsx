import { Ban, CheckCircle2, Clock3, Handshake, MessageSquare, XCircle, DollarSign } from 'lucide-react';
import { useState } from 'react';
import InterestMessagesPane from './InterestMessagesPane';

const STATUS_META = {
  pending: {
    label: 'Pending',
    chip: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/25',
    accent: 'border-l-yellow-400/70',
    icon: Clock3,
    helper: 'Awaiting first response',
  },
  negotiating: {
    label: 'Negotiating',
    chip: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
    accent: 'border-l-indigo-400/70',
    icon: MessageSquare,
    helper: 'Counter offer in progress',
  },
  accepted: {
    label: 'Accepted',
    chip: 'bg-green-500/10 text-green-300 border-green-500/25',
    accent: 'border-l-green-400/70',
    icon: Handshake,
    helper: 'Ready for contract stage',
  },
  rejected: {
    label: 'Rejected',
    chip: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
    accent: 'border-l-rose-400/70',
    icon: XCircle,
    helper: 'Request was declined',
  },
  cancelled: {
    label: 'Cancelled',
    chip: 'bg-orange-500/10 text-orange-300 border-orange-500/25',
    accent: 'border-l-orange-400/70',
    icon: Ban,
    helper: 'Request withdrawn',
  },
  expired: {
    label: 'Expired',
    chip: 'bg-slate-500/10 text-slate-300 border-slate-500/25',
    accent: 'border-l-slate-400/70',
    icon: Clock3,
    helper: 'No response within deadline',
  },
};

function RequestCard({ item, type, onAccept, onReject, onCancel, respondToRequest }) {
  const status = String(item.status || 'pending').toLowerCase();
  const meta = STATUS_META[status] || STATUS_META.pending;
  const StatusIcon = meta.icon;

  const lastBy = String(item.lastCounteredBy || '').toLowerCase();
  const canRespond = type === 'incoming' && item.status === 'pending';
  const waitingForInfluencer =
    type === 'outgoing' && item.status === 'negotiating' && lastBy === 'owner';
  const ownerCanRespondToCounter =
    type === 'outgoing' && item.status === 'negotiating' && lastBy === 'influencer';
  const waitingForOwner =
    type === 'incoming' && item.status === 'negotiating' && lastBy === 'influencer';
  const canCancel = type === 'outgoing' && (item.status === 'pending' || item.status === 'negotiating');

  // Inline negotiation state
  const [showNegotiate, setShowNegotiate] = useState(false);
  const [negotiateBudget, setNegotiateBudget] = useState('');
  const [negotiateMessage, setNegotiateMessage] = useState('');

  const openNegotiate = () => {
    setShowNegotiate(true);
    setNegotiateBudget(item.counterPrice || item.proposedBudget || '');
    setNegotiateMessage('');
  };

  const closeNegotiate = () => {
    setShowNegotiate(false);
    setNegotiateBudget('');
    setNegotiateMessage('');
  };

  const submitNegotiate = async () => {
    const budget = Number(negotiateBudget);
    if (!budget || budget <= 0) return;
    await respondToRequest(item.id, {
      action: 'counter',
      newBudget: budget,
      message: negotiateMessage,
    });
    closeNegotiate();
  };

  return (
    <div className={`bg-[#1A112C]/65 backdrop-blur-sm border border-[#745CB4]/25 rounded-lg p-3 mb-2.5 last:mb-0 border-l-4 ${meta.accent}`}>
      <div className="flex justify-between items-start gap-2 mb-1">
        <div>
          <div className="text-sm font-semibold text-white">{item.influencerName}</div>
          <div className="text-xs text-[#C1B6FD] mb-1">{item.campaignName}</div>
        </div>

        <span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border whitespace-nowrap font-medium ${meta.chip}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {meta.label}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-[#C1B6FD] mb-2">
        <span className="font-semibold text-white">${item.proposedBudget.toLocaleString()}</span>
        {item.counterPrice != null && (
          <>
            <span className="text-[#9CA3AF]">→</span>
            <span className="font-semibold text-indigo-300">Counter: ${Number(item.counterPrice).toLocaleString()}</span>
          </>
        )}
        <span className="text-[#9CA3AF]">•</span>
        <span>{meta.helper}</span>
      </div>

      {item.message ? (
        <div className="text-xs text-[#C1B6FD] leading-normal border-l-2 border-[#745CB4]/40 pl-2 mb-2">
          {item.message}
        </div>
      ) : null}

      {item.responseMessage ? (
        <div className="text-xs text-indigo-300 leading-normal border-l-2 border-indigo-400/40 pl-2 mb-2 italic">
          Counter note: {item.responseMessage}
        </div>
      ) : null}

      <div className="flex gap-1.5 flex-wrap mt-1">
        {canRespond ? (
          <>
            <button
              type="button"
              className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-green-500/10 text-green-300 border border-green-500/25 cursor-pointer"
              onClick={() => onAccept(item.id)}
            >
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" />Accept</span>
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/25 cursor-pointer"
              onClick={() => onReject(item.id)}
            >
              <span className="inline-flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" />Reject</span>
            </button>
          </>
        ) : null}

        {waitingForInfluencer ? <span className="text-[11px] text-[#9CA3AF] italic">Waiting for influencer response...</span> : null}

        {ownerCanRespondToCounter ? (
          <>
            <span className="text-[11px] text-indigo-300 font-medium mr-1">Counter received:</span>
            <button
              type="button"
              className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-green-500/10 text-green-300 border border-green-500/25 cursor-pointer"
              onClick={() => onAccept(item.id)}
            >
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" />Accept Counter</span>
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-[#241A3A]/70 text-[#C1B6FD] border border-[#745CB4]/45 cursor-pointer"
              onClick={openNegotiate}
            >
              <span className="inline-flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" />Counter Offer</span>
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/25 cursor-pointer"
              onClick={() => onReject(item.id)}
            >
              <span className="inline-flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" />Decline</span>
            </button>
          </>
        ) : null}

        {waitingForOwner ? (
          <>
            <button
              type="button"
              className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-green-500/10 text-green-300 border border-green-500/25 cursor-pointer"
              onClick={() => onAccept(item.id)}
            >
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" />Accept Counter</span>
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/25 cursor-pointer"
              onClick={() => onReject(item.id)}
            >
              <span className="inline-flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" />Decline</span>
            </button>
          </>
        ) : null}

        {canCancel && !waitingForInfluencer ? (
          <button
            type="button"
            className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-[#241A3A]/70 backdrop-blur-sm text-[#C1B6FD] border border-[#745CB4]/45 cursor-pointer"
            onClick={() => onCancel(item.id)}
          >
            <span className="inline-flex items-center gap-1.5"><Ban className="w-3.5 h-3.5" />Cancel</span>
          </button>
        ) : null}
      </div>

      {/* Inline Negotiation Form */}
      {showNegotiate && ownerCanRespondToCounter && (
        <div className="mt-3 p-3 bg-[#241A3A]/65 border border-[#745CB4]/25 rounded-lg">
          <div className="space-y-2">
            <div>
              <label className="block text-[10px] text-gray-400 mb-1">Proposed Budget</label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input
                  type="number"
                  value={negotiateBudget}
                  onChange={(e) => setNegotiateBudget(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-md pl-7 pr-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#C1B6FD]/50"
                  placeholder="Enter amount..."
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 mb-1">Message (optional)</label>
              <textarea
                value={negotiateMessage}
                onChange={(e) => setNegotiateMessage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#C1B6FD]/50"
                placeholder="Add a note..."
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={submitNegotiate}
                disabled={!negotiateBudget || Number(negotiateBudget) <= 0}
                className="flex-1 px-2 py-1.5 rounded-md text-[11px] font-semibold bg-green-500/10 text-green-300 border border-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Counter
              </button>
              <button
                onClick={closeNegotiate}
                className="px-2 py-1.5 rounded-md text-[11px] font-semibold bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RequestsColumn({ title, count, items, type, onAccept, onReject, onCancel, respondToRequest }) {
  return (
    <div className="bg-[#241A3A]/65 backdrop-blur-md border border-[#745CB4]/25 rounded-xl p-3.5">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-white">{title}</span>
        <span className="text-[11px] text-[#9CA3AF] bg-[#1A112C]/70 backdrop-blur-sm border border-[#745CB4]/25 rounded-full px-2 py-0.5">
          {count}
        </span>
      </div>

      {items.length ? (
        items.map((item) => (
          <RequestCard
            key={item.id}
            item={item}
            type={type}
            onAccept={onAccept}
            onReject={onReject}
            onCancel={onCancel}
            respondToRequest={respondToRequest}
          />
        ))
      ) : (
        <p className="text-xs text-[#9CA3AF] py-1">No {type} requests.</p>
      )}
    </div>
  );
}

export default function RequestsPane({ outgoing, requestsLoading, requestsError, onAccept, onReject, onCancel, respondToRequest }) {
  return (
    <div className="space-y-4">
      {requestsError ? (
        <div className="mb-2.5 p-2.5 rounded-lg text-xs bg-red-500/10 text-red-400 border border-red-500/20">
          {requestsError}
        </div>
      ) : null}
      {requestsLoading ? <div className="mb-2.5 text-xs text-[#C1B6FD]">Loading requests...</div> : null}

      {/* Collaboration requests sent by owner */}
      <div>
        <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">Collaboration Requests</p>
        <div className="bg-[#241A3A]/65 backdrop-blur-md border border-[#745CB4]/25 rounded-xl p-3.5">
          {outgoing.length ? (
            outgoing.map((item) => (
              <RequestCard
                key={item.id}
                item={item}
                type="outgoing"
                onAccept={onAccept}
                onReject={onReject}
                onCancel={onCancel}
                respondToRequest={respondToRequest}
              />
            ))
          ) : (
            <p className="text-xs text-[#9CA3AF] py-1">No outgoing collaboration requests.</p>
          )}
        </div>
      </div>

      {/* Interest messages from influencers — separate section */}
      <div>
        <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">Interest Messages from Influencers</p>
        <InterestMessagesPane />
      </div>
    </div>
  );
}

