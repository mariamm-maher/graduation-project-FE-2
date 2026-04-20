import ProgressRing from './ProgressRing';

const STATUS_PILL = {
  waiting_contract_sign: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  live: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
};

const STATUS_LABEL = {
  waiting_contract_sign: 'Waiting contract sign',
  live: 'Live',
};

export default function ActivePane({ items }) {
  if (!items.length) {
    return <p className="text-sm text-[#9CA3AF] py-2">No active collaborations.</p>;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
      {items.map((c) => (
        <div
          key={c.id}
          className="bg-linear-to-br from-[#1A112C]/70 to-[#241A3A]/70 backdrop-blur-md border border-[#745CB4]/25 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#C1B6FD]/45 transition-all duration-200"
        >
          <span
            className={`inline-block text-xs px-2.5 py-1 rounded-full border mb-3 font-semibold ${STATUS_PILL[c.status] || ''}`}
          >
            {STATUS_LABEL[c.status] || c.status}
          </span>
          <div className="flex items-center gap-3.5 mb-3">
            <ProgressRing percent={c.progress} />
            <div className="min-w-0">
              <div className="text-base font-semibold overflow-hidden text-ellipsis whitespace-nowrap text-white">
                {c.campaignName}
              </div>
              <div className="text-sm text-[#C1B6FD] overflow-hidden text-ellipsis whitespace-nowrap mt-0.5">
                {c.influencerName}
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-[#C1B6FD] mb-2">
            <span className="font-medium">{c.completedTasks}/{c.totalTasks} tasks</span>
            <span className="font-semibold text-white">${c.budget.toLocaleString()}</span>
          </div>
          <div className="h-1.5 bg-[#745CB4]/20 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-linear-to-r from-[#378add] to-[#77b2ea]" style={{ width: `${c.progress}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

