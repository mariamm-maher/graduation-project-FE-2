import { useNavigate } from 'react-router-dom';
import { LANES, LANE_LABELS } from '../constants';

const STATUS_DOT = {
  waiting_contract_sign: 'bg-yellow-500',
  live: 'bg-indigo-500',
  completed: 'bg-green-500',
  canceled: 'bg-red-500',
};

const STATUS_BAR = {
  waiting_contract_sign: 'bg-yellow-500',
  live: 'bg-indigo-500',
  completed: 'bg-green-500',
  canceled: 'bg-red-500',
};

const LANE_HEADER_ACCENT = {
  waiting_contract_sign: 'border-yellow-500/30',
  live: 'border-indigo-500/30',
  completed: 'border-green-500/30',
  canceled: 'border-red-500/30',
};

function fmt(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function CollabCard({ c, status, onClick }) {
  const hasDates = c.startDate || c.endDate;
  const closedAt = c.completedAt || c.cancelledAt;

  return (
    <div
      onClick={onClick}
      className="bg-[#1A112C]/65 backdrop-blur-sm border border-[#745CB4]/25 rounded-lg p-3 mb-2.5 cursor-pointer transition-all duration-200 hover:border-[#C1B6FD]/45 hover:shadow-md hover:scale-[1.01] last:mb-0 space-y-2.5"
    >
      {/* Campaign name */}
      <div className="text-sm font-semibold text-white leading-snug line-clamp-2">
        {c.campaignName}
      </div>

      {/* Influencer */}
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C1B6FD] inline-block shrink-0" />
        <span className="text-xs text-[#C1B6FD] truncate">{c.influencerName}</span>
      </div>

      {/* Goal */}
      {c.goal && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#9CA3AF]">Goal</span>
          <span className="text-white font-medium">{c.goal}</span>
        </div>
      )}

      {/* Budget */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#9CA3AF]">Budget</span>
        <span className="text-white font-semibold">
          {c.currency} {c.budget.toLocaleString()}
        </span>
      </div>

      {/* Duration weeks */}
      {c.durationWeeks && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#9CA3AF]">Duration</span>
          <span className="text-white">{c.durationWeeks}w</span>
        </div>
      )}

      {/* Dates */}
      {hasDates && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#9CA3AF]">{fmt(c.startDate)}</span>
          <span className="text-[#9CA3AF]">→</span>
          <span className="text-[#9CA3AF]">{fmt(c.endDate)}</span>
        </div>
      )}

      {/* Closed-at for completed/cancelled */}
      {closedAt && (
        <div className="text-[10px] text-[#9CA3AF] text-right">
          {c.completedAt ? 'Completed' : 'Cancelled'}: {fmt(closedAt)}
        </div>
      )}

      {/* Progress bar for live */}
      {status === 'live' && c.progress > 0 && (
        <div>
          <div className="flex justify-between text-[10px] text-[#9CA3AF] mb-1">
            <span>Progress</span>
            <span>{c.progress}%</span>
          </div>
          <div className="h-1.5 bg-[#745CB4]/20 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${STATUS_BAR[status]}`} style={{ width: `${c.progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AllLanesPane({ laneData, rawCollabs = [] }) {
  const navigate = useNavigate();
  const total = LANES.reduce((sum, s) => sum + (laneData[s]?.length || 0), 0);

  const rawById = rawCollabs.reduce((acc, r) => { acc[r.id ?? r._id] = r; return acc; }, {});

  return (
    <div className="space-y-4">
      {/* Summary counts row */}
      <div className="flex flex-wrap gap-2 mb-1">
        <span className="text-xs text-[#9CA3AF]">Total: <span className="text-white font-semibold">{total}</span></span>
        {LANES.map((s) => (
          laneData[s]?.length > 0 && (
            <span key={s} className="flex items-center gap-1 text-xs text-[#9CA3AF]">
              <span className={`w-2 h-2 rounded-full ${STATUS_DOT[s]}`} />
              {LANE_LABELS[s]}: <span className="text-white font-semibold">{laneData[s].length}</span>
            </span>
          )
        ))}
      </div>

      {/* Lanes grid */}
      <div className="grid grid-cols-1 min-[681px]:grid-cols-2 min-[1101px]:grid-cols-4 gap-3">
        {LANES.map((status) => (
          <div
            key={status}
            className={`bg-linear-to-b from-[#241A3A]/70 to-[#1A112C]/70 backdrop-blur-md border rounded-xl p-3.5 shadow-sm ${LANE_HEADER_ACCENT[status]}`}
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
                <CollabCard
                  key={c.id}
                  c={c}
                  status={status}
                  onClick={() =>
                    navigate(
                      `/dashboard/owner/collaborations/${c.id}/workspace`,
                      { state: { collab: rawById[c.id] || null } }
                    )
                  }
                />
              ))
            ) : (
              <p className="text-xs text-[#9CA3AF] py-2">No items</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


