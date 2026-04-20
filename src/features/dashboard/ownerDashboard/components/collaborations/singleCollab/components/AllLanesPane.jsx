import { LANES, LANE_LABELS } from '../constants';

const STATUS_DOT = {
  waiting_contract_sign: 'bg-yellow-500',
  live: 'bg-indigo-500',
  completed: 'bg-green-500',
  canceled: 'bg-red-500',
};

const STATUS_FILL = {
  waiting_contract_sign: 'bg-yellow-500',
  live: 'bg-indigo-500',
  completed: 'bg-green-500',
  canceled: 'bg-red-500',
};

export default function AllLanesPane({ laneData }) {
  return (
    <div className="grid grid-cols-1 min-[681px]:grid-cols-2 min-[1101px]:grid-cols-4 gap-3">
      {LANES.map((status) => (
        <div
          key={status}
          className="bg-linear-to-b from-[#241A3A]/70 to-[#1A112C]/70 backdrop-blur-md border border-[#745CB4]/25 rounded-xl p-3.5 shadow-sm"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-[#C1B6FD]">
              <span className={`inline-block w-2 h-2 rounded-full mr-1.5 align-middle ${STATUS_DOT[status]}`} />
              {LANE_LABELS[status]}
            </span>
            <span className="text-xs text-[#9CA3AF] bg-[#1A112C]/70 backdrop-blur-sm border border-[#745CB4]/25 rounded-full px-2 py-0.5">
              {laneData[status]?.length || 0}
            </span>
          </div>

          {laneData[status]?.length ? (
            laneData[status].map((c) => (
              <div
                key={c.id}
                className="bg-[#1A112C]/65 backdrop-blur-sm border border-[#745CB4]/25 rounded-lg p-3 mb-2.5 cursor-pointer transition-all duration-200 hover:border-[#C1B6FD]/45 hover:shadow-md last:mb-0"
              >
                <div className="text-sm font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis mb-1">
                  {c.campaignName}
                </div>
                <div className="text-xs text-[#C1B6FD] whitespace-nowrap overflow-hidden text-ellipsis mb-2.5">
                  {c.influencerName}
                </div>
                <div className="flex justify-between text-xs text-[#C1B6FD]">
                  <span>Budget</span>
                  <span className="text-xs font-semibold text-white">${c.budget.toLocaleString()}</span>
                </div>
                {status === 'live' && (
                  <div className="h-1.5 bg-[#745CB4]/20 rounded-full overflow-hidden mt-2">
                    <div className={`h-full rounded-full ${STATUS_FILL[status]}`} style={{ width: `${c.progress}%` }} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-[#9CA3AF] py-2">No items</p>
          )}
        </div>
      ))}
    </div>
  );
}


