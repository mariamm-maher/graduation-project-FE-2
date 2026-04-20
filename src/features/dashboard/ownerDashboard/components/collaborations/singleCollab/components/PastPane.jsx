export default function PastPane({ items }) {
  if (!items.length) {
    return <p className="text-[11px] text-[#9CA3AF] py-1">No past collaborations.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((c) => (
        <div
          key={c.id}
          className="bg-[#1A112C]/65 backdrop-blur-sm border border-[#745CB4]/25 rounded-lg px-3.5 py-3 flex items-center gap-3"
        >
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-white overflow-hidden text-ellipsis whitespace-nowrap">
              {c.campaignName}
            </div>
            <div className="text-xs text-[#C1B6FD]">{c.influencerName} · ${c.budget.toLocaleString()}</div>
          </div>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-[10px] border whitespace-nowrap ${
              c.status === 'completed'
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {c.status === 'completed' ? 'Completed' : 'Canceled'}
          </span>
        </div>
      ))}
    </div>
  );
}

