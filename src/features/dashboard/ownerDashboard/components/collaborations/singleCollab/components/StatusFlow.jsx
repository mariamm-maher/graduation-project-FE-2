import { ArrowRight, CircleDot, ShieldCheck, Sparkles, XCircle } from 'lucide-react';

const STAGES = [
  {
    id: 'waiting_contract_sign',
    label: 'Waiting contract sign',
    helper: 'Legal alignment and approval',
    icon: CircleDot,
    chip: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    dot: 'bg-[#ef9f27]',
  },
  {
    id: 'live',
    label: 'Live',
    helper: 'Execution in progress',
    icon: Sparkles,
    chip: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    dot: 'bg-[#378add]',
  },
  {
    id: 'completed',
    label: 'Completed',
    helper: 'Delivered and verified',
    icon: ShieldCheck,
    chip: 'bg-green-500/10 text-green-400 border-green-500/20',
    dot: 'bg-[#639922]',
  },
  {
    id: 'canceled',
    label: 'Canceled',
    helper: 'Closed without completion',
    icon: XCircle,
    chip: 'bg-red-500/10 text-red-400 border-red-500/20',
    dot: 'bg-[#e24b4a]',
  },
];

function StageChip({ stage }) {
  const Icon = stage.icon;

  return (
    <div className="flex items-center gap-2 min-w-max">
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border shadow-sm ${stage.chip}`}>
        <Icon className="w-3.5 h-3.5" />
        {stage.label}
      </span>
      <span className="hidden lg:inline text-[10px] text-[#9CA3AF]">{stage.helper}</span>
    </div>
  );
}

function StageConnector({ critical = false }) {
  return (
    <span className={`inline-flex items-center justify-center px-1 ${critical ? 'text-[#e24b4a]' : 'text-[#9CA3AF]'}`}>
      <ArrowRight className={`w-3.5 h-3.5 ${critical ? 'rotate-45' : ''}`} />
    </span>
  );
}

function StageLegend() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      {STAGES.map((stage) => (
        <span key={stage.id} className="inline-flex items-center gap-1.5 text-[10px] text-[#C1B6FD]">
          <span className={`w-2 h-2 rounded-full ${stage.dot}`} />
          {stage.label}
        </span>
      ))}
    </div>
  );
}

export default function StatusFlow() {
  return (
    <section className="mb-6 rounded-xl border border-[#745CB4]/25 bg-[#241A3A]/65 backdrop-blur-md p-3 sm:p-4">
      <div className="mb-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">Collaboration Lifecycle</p>
      </div>

      <div className="flex items-center overflow-x-auto pb-1">
        <StageChip stage={STAGES[0]} />
        <StageConnector />
        <StageChip stage={STAGES[1]} />
        <StageConnector />
        <StageChip stage={STAGES[2]} />
        <StageConnector critical />
        <StageChip stage={STAGES[3]} />
      </div>

      <StageLegend />
    </section>
  );
}

