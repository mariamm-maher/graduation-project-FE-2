import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Calendar, CheckCircle2, Clock, Clock3,
  Loader2, Target, TrendingUp, Users, XCircle, AlertCircle,
  CheckSquare, ListChecks, Activity, Mail,
} from 'lucide-react';
import useCollaborationStore from '../../../../../../stores/collaborationStore';

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const statusMeta = (status) => {
  const s = String(status || '').toLowerCase();
  if (s === 'completed')  return { label: 'Completed',  cls: 'bg-green-500/20 border-green-500/30 text-green-300',   Icon: CheckCircle2 };
  if (s === 'cancelled' || s === 'canceled') return { label: 'Cancelled', cls: 'bg-red-500/20 border-red-500/30 text-red-300', Icon: XCircle };
  if (s === 'in_progress' || s === 'active') return { label: 'In Progress', cls: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300', Icon: Activity };
  return { label: String(status || 'Pending').replace(/_/g, ' '), cls: 'bg-amber-500/20 border-amber-500/30 text-amber-300', Icon: Clock };
};

const taskStatusMeta = (status) => {
  const s = String(status || '').toLowerCase();
  if (s === 'completed' || s === 'done')  return { cls: 'bg-green-500/15 text-green-300 border-green-500/25',  Icon: CheckSquare };
  if (s === 'in_progress' || s === 'in_review') return { cls: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25', Icon: Activity };
  return { cls: 'bg-[#745CB4]/15 text-[#C1B6FD] border-[#745CB4]/25', Icon: Clock3 };
};

function ProgressBar({ percent, colorClass = 'bg-[#745CB4]' }) {
  const pct = Math.min(100, Math.max(0, Number(percent) || 0));
  return (
    <div className="relative h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function TrackCard({ Icon, label, value, sub, accent = 'border-[#745CB4]/25' }) {
  return (
    <div className={`bg-white/5 border ${accent} rounded-xl p-4 flex items-start gap-3`}>
      <div className="mt-0.5 w-8 h-8 rounded-lg bg-[#745CB4]/15 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#C1B6FD]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-[#9CA3AF] leading-none mb-1">{label}</p>
        <p className="text-base font-bold text-white leading-tight">{value}</p>
        {sub && <p className="text-xs text-[#9CA3AF] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CollaborationWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const seedCollab = location.state?.collab || null;

  const {
    currentCollaboration,
    isCurrentCollaborationLoading,
    currentCollaborationError,
    getCollaborationById,
  } = useCollaborationStore();

  useEffect(() => {
    if (id) getCollaborationById(id);
  }, [id, getCollaborationById]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isCurrentCollaborationLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-24 text-[#C1B6FD]">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading collaboration...</span>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (currentCollaborationError && !currentCollaboration) {
    return (
      <div className="space-y-4 py-10">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {currentCollaborationError}
        </div>
        <button
          onClick={() => getCollaborationById(id)}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm hover:bg-white/15"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Data extraction — matches exact API shape ─────────────────────────────
  const collab        = currentCollaboration || {};
  const campaign      = collab.campaign      || {};
  const participants  = collab.participants  || {};
  const owner         = participants.owner   || {};
  const influencer    = participants.influencer || {};
  const request       = collab.request      || {};
  const tasks         = Array.isArray(collab.tasks) ? collab.tasks : [];
  const timeline      = collab.timeline     || {};  // { startDate, endDate, completedAt, cancelledAt }
  const tracking      = collab.tracking     || {};
  const duration      = tracking.duration   || {};
  const taskTracking  = tracking.tasks      || {};
  const health        = tracking.health     || {};

  // Fallback to seed data from navigation state for fields not in single-collab response
  const seed         = seedCollab || {};
  const seedCampaign = seed.campaign || {};

  const campaignName   = campaign.name  || seedCampaign.campaignName || 'Collaboration';
  const collabStatus   = collab.status  || seed.status || '';
  const sm             = statusMeta(collabStatus);
  const StatusIcon     = sm.Icon;

  const startDate      = timeline.startDate  || campaign.startDate  || seed.startDate;
  const endDate        = timeline.endDate    || campaign.endDate    || seed.endDate;
  const completedAt    = timeline.completedAt;
  const cancelledAt    = timeline.cancelledAt;

  const durTotal     = duration.totalDays     ?? '—';
  const durElapsed   = duration.elapsedDays   ?? '—';
  const durRemaining = duration.remainingDays ?? '—';
  const durProgress  = Number(duration.progressPercent) || 0;

  const tasksTotal     = taskTracking.total     ?? tasks.length;
  const tasksCompleted = taskTracking.completed ?? 0;
  const tasksPending   = taskTracking.pending   ?? (tasks.length - tasksCompleted);
  const tasksProgress  = Number(taskTracking.progressPercent) || 0;

  return (
    <div className="space-y-6 font-sans text-white">
      {/* ── Back ── */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Collaborations
      </button>

      {/* ── Header ── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-[11px] uppercase tracking-widest text-[#9CA3AF]">Collaboration #{collab.id || id}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{campaignName}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-[#9CA3AF]">
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {influencer.name || '—'}
                <span className="text-[#745CB4]/60 mx-1">↔</span>
                {owner.name || '—'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {fmt(startDate)} – {fmt(endDate)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${sm.cls}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {sm.label}
            </span>
            {health.isOverdue && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border bg-red-500/20 border-red-500/30 text-red-300 text-xs font-semibold">
                <AlertCircle className="w-3.5 h-3.5" /> Overdue
              </span>
            )}
            {completedAt && (
              <span className="text-xs text-[#9CA3AF]">Completed {fmt(completedAt)}</span>
            )}
            {cancelledAt && (
              <span className="text-xs text-red-400">Cancelled {fmt(cancelledAt)}</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Tracking KPIs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <TrackCard Icon={Calendar}     label="Total Days"     value={durTotal}     accent="border-[#745CB4]/25" />
        <TrackCard Icon={TrendingUp}   label="Elapsed"        value={`${durElapsed}d`}   sub={`${durProgress}% done`}  accent="border-indigo-500/25" />
        <TrackCard Icon={Clock}        label="Remaining"      value={`${durRemaining}d`}  accent="border-amber-500/25" />
        <TrackCard Icon={ListChecks}   label="Tasks Done"     value={`${tasksCompleted}/${tasksTotal}`} sub={`${tasksProgress}% complete`} accent="border-green-500/25" />
        <TrackCard Icon={Target}       label="Pending Tasks"  value={tasksPending}  accent="border-rose-500/25" />
      </div>

      {/* ── Progress bars ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" /> Timeline Progress
            </span>
            <span className="text-sm font-bold text-indigo-300">{durProgress}%</span>
          </div>
          <ProgressBar percent={durProgress} colorClass="bg-indigo-500" />
          <div className="flex justify-between text-xs text-[#9CA3AF]">
            <span>{fmt(startDate)}</span>
            <span>{durElapsed}d elapsed · {durRemaining}d left</span>
            <span>{fmt(endDate)}</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-green-400" /> Task Progress
            </span>
            <span className="text-sm font-bold text-green-300">{tasksProgress}%</span>
          </div>
          <ProgressBar percent={tasksProgress} colorClass="bg-green-500" />
          <div className="flex justify-between text-xs text-[#9CA3AF]">
            <span>{tasksCompleted} completed</span>
            <span>{tasksPending} pending</span>
            <span>{tasksTotal} total</span>
          </div>
        </div>
      </div>

      {/* ── Main body ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left col */}
        <div className="xl:col-span-2 space-y-4">

          {/* Participants */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C1B6FD]" /> Participants
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[{ role: 'Owner', person: owner }, { role: 'Influencer', person: influencer }].map(({ role, person }) => (
                <div key={role} className="bg-[#1A112C]/60 border border-[#745CB4]/20 rounded-lg p-3 space-y-1">
                  <p className="text-[10px] uppercase tracking-wide text-[#9CA3AF]">{role}</p>
                  <p className="text-sm font-semibold text-white">{person.name || '—'}</p>
                  {person.email && (
                    <p className="text-xs text-[#9CA3AF] inline-flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {person.email}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Request */}
          {request.id && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#C1B6FD]" /> Collaboration Request
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${statusMeta(request.status).cls}`}>
                  {String(request.status || '').replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-[#9CA3AF] flex items-center gap-1">
                  <span className="text-white">Request #{request.id}</span>
                </span>
              </div>
              {request.message && (
                <div className="border-l-2 border-[#745CB4]/40 pl-3 text-sm text-[#C1B6FD]">
                  {request.message}
                </div>
              )}
            </div>
          )}

          {/* Tasks */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-[#C1B6FD]" /> Tasks
              <span className="ml-auto text-xs text-[#9CA3AF] font-normal">{tasks.length} total</span>
            </h3>

            {tasks.length === 0 ? (
              <p className="text-sm text-[#9CA3AF]">No tasks assigned yet.</p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task, idx) => {
                  const tm = taskStatusMeta(task.status);
                  const TIcon = tm.Icon;
                  return (
                    <div
                      key={task.id || idx}
                      className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 ${tm.cls}`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <TIcon className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-medium truncate">{task.title || `Task ${idx + 1}`}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {task.dueDate && (
                          <span className="text-[10px] text-[#9CA3AF] inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {fmt(task.dueDate)}
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-full border font-semibold capitalize border-current opacity-80">
                          {String(task.status || 'pending').replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-4">

          {/* Health */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#C1B6FD]" /> Health
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#9CA3AF]">Status</span>
                <span className={`font-semibold ${health.isActive ? 'text-green-400' : 'text-[#9CA3AF]'}`}>
                  {health.statusLabel || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#9CA3AF]">Overdue</span>
                <span className={`font-semibold ${health.isOverdue ? 'text-red-400' : 'text-green-400'}`}>
                  {health.isOverdue ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#9CA3AF]">Active</span>
                <span className={`font-semibold ${health.isActive ? 'text-green-400' : 'text-[#9CA3AF]'}`}>
                  {health.isActive ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Campaign */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-[#C1B6FD]" /> Campaign
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">Name</span>
                <span className="text-white font-medium">{campaign.name || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">Published</span>
                <span className={campaign.isPublished ? 'text-green-400 font-medium' : 'text-[#9CA3AF]'}>
                  {campaign.isPublished ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">Start</span>
                <span className="text-white">{fmt(campaign.startDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">End</span>
                <span className="text-white">{fmt(campaign.endDate)}</span>
              </div>
            </div>
          </div>

          {/* Timeline dates */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock3 className="w-4 h-4 text-[#C1B6FD]" /> Key Dates
            </h3>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Start',       val: startDate    },
                { label: 'End',         val: endDate      },
                { label: 'Completed',   val: completedAt  },
                { label: 'Cancelled',   val: cancelledAt  },
              ].map(({ label, val }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[#9CA3AF]">{label}</span>
                  <span className="text-white">{fmt(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

