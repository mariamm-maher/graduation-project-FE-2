function RequestCard({ item, type, onAccept, onReject, onCancel }) {
  const canRespond = type === 'incoming' && item.status === 'pending';
  const waitingForInfluencer =
    type === 'outgoing' && item.status === 'negotiating' && String(item.lastCounteredBy).toLowerCase() === 'owner';
  const waitingForOwner =
    type === 'incoming' && item.status === 'negotiating' && String(item.lastCounteredBy).toLowerCase() === 'influencer';
  const canCancel = type === 'outgoing' && (item.status === 'pending' || item.status === 'negotiating');

  return (
    <div className="bg-[#1A112C]/65 backdrop-blur-sm border border-[#745CB4]/25 rounded-lg p-2.5 mb-2 last:mb-0">
      <div className="flex justify-between items-start gap-2 mb-1">
        <div>
          <div className="text-xs font-medium text-white">{item.influencerName}</div>
          <div className="text-[11px] text-[#C1B6FD] mb-1">{item.campaignName}</div>
        </div>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-[10px] border whitespace-nowrap ${
            item.status === 'negotiating'
              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
          }`}
        >
          {item.status === 'negotiating' ? 'Negotiating' : 'Pending'}
        </span>
      </div>

      <div className="text-[11px] text-[#C1B6FD] mb-[7px]">${item.proposedBudget.toLocaleString()}</div>
      {item.message ? (
        <div className="text-[11px] text-[#C1B6FD] leading-[1.4] border-l-2 border-[#745CB4]/40 pl-1.5 mb-[7px]">
          {item.message}
        </div>
      ) : null}

      <div className="flex gap-1.5 flex-wrap">
        {canRespond ? (
          <>
            <button
              type="button"
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-green-500/10 text-green-400 border border-green-500/20 cursor-pointer"
              onClick={() => onAccept(item.id)}
            >
              Accept
            </button>
            <button
              type="button"
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 cursor-pointer"
              onClick={() => onReject(item.id)}
            >
              Reject
            </button>
          </>
        ) : null}

        {waitingForInfluencer ? <span className="text-[11px] text-[#9CA3AF] italic">Waiting for response...</span> : null}

        {waitingForOwner ? (
          <>
            <button
              type="button"
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-green-500/10 text-green-400 border border-green-500/20 cursor-pointer"
              onClick={() => onAccept(item.id)}
            >
              Accept counter
            </button>
            <button
              type="button"
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 cursor-pointer"
              onClick={() => onReject(item.id)}
            >
              Decline
            </button>
          </>
        ) : null}

        {canCancel && !waitingForInfluencer ? (
          <button
            type="button"
            className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#241A3A]/70 backdrop-blur-sm text-[#C1B6FD] border border-[#745CB4]/45 cursor-pointer"
            onClick={() => onCancel(item.id)}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
}

function RequestsColumn({ title, count, items, type, onAccept, onReject, onCancel }) {
  return (
    <div className="bg-[#241A3A]/65 backdrop-blur-md border border-[#745CB4]/25 rounded-xl p-3">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[13px] font-medium text-white">{title}</span>
        <span className="text-[11px] text-[#9CA3AF] bg-[#1A112C]/70 backdrop-blur-sm border border-[#745CB4]/25 rounded-[10px] px-1.5 py-px">
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
          />
        ))
      ) : (
        <p className="text-xs text-[#9CA3AF] py-1">No {type} requests.</p>
      )}
    </div>
  );
}

export default function RequestsPane({ incoming, outgoing, requestsLoading, requestsError, onAccept, onReject, onCancel }) {
  return (
    <div>
      {requestsError ? (
        <div className="mb-2.5 p-2.5 rounded-lg text-xs bg-red-500/10 text-red-400 border border-red-500/20/80">
          {requestsError}
        </div>
      ) : null}
      {requestsLoading ? <div className="mb-2.5 text-xs text-[#C1B6FD]">Loading requests...</div> : null}

      <div className="grid grid-cols-1 min-[901px]:grid-cols-2 gap-3">
        <RequestsColumn
          title="Incoming"
          count={incoming.length}
          items={incoming}
          type="incoming"
          onAccept={onAccept}
          onReject={onReject}
          onCancel={onCancel}
        />

        <RequestsColumn
          title="Outgoing"
          count={outgoing.length}
          items={outgoing}
          type="outgoing"
          onAccept={onAccept}
          onReject={onReject}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}

