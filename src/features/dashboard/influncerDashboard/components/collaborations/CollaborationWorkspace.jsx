import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, CheckCircle, Clock, DollarSign, FileText, ArrowLeft, Loader2,
  Users, Target, User, Mail, Globe, AlertTriangle, TrendingUp, Layers
} from 'lucide-react';
import collaborationService from '../../../../../api/collaborationApi';
import collaborationContractsService from '../../../../../api/CollaborationContractsApi';
import collaborationTasksService from '../../../../../api/CollaborationTasksApi';
import useInfluncerStore from '../../../../../stores/influncerStore';
import {
  getBrandName,
  getCampaignName,
  getOwnerFromCollab,
  resolveAgreedPrice,
  parseCollaborationTasks,
} from '../../utils/collaborationUtils';

const STATUS_STYLE = {
  completed:             { label: 'Completed',       cls: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' },
  approved:              { label: 'Approved',        cls: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' },
  done:                  { label: 'Done',            cls: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' },
  live:                  { label: 'Live',            cls: 'text-blue-400 bg-blue-500/20 border-blue-500/30'         },
  in_progress:           { label: 'In Progress',     cls: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'   },
  in_review:             { label: 'In Review',       cls: 'text-purple-400 bg-purple-500/20 border-purple-500/30'   },
  review:                { label: 'In Review',       cls: 'text-purple-400 bg-purple-500/20 border-purple-500/30'   },
  pending_contract_sign: { label: 'Pending Contract',cls: 'text-amber-400 bg-amber-500/20 border-amber-500/30'      },
  waiting_contract_sign: { label: 'Pending Contract',cls: 'text-amber-400 bg-amber-500/20 border-amber-500/30'      },
  pending:               { label: 'Pending',         cls: 'text-gray-400 bg-gray-500/20 border-gray-500/30'         },
  todo:                  { label: 'To Do',           cls: 'text-gray-400 bg-gray-500/20 border-gray-500/30'         },
  cancelled:             { label: 'Cancelled',       cls: 'text-red-400 bg-red-500/20 border-red-500/30'            },
};

const PROGRESS_MAP = {
  pending_contract_sign: 10,
  waiting_contract_sign: 10,
  live: 35,
  in_progress: 70,
  completed: 100,
  cancelled: 0,
};

function isTaskComplete(status) {
  const s = String(status || '').toLowerCase();
  return ['approved', 'completed', 'done'].includes(s);
}

function parseCollaborationPayload(payload) {
  const root = payload?.data ?? payload ?? {};
  const workspace = root?.workspace ?? root;
  const collab = workspace?.collaboration ?? workspace?.collaborationData ?? workspace;

  if (!collab || typeof collab !== 'object') return null;

  return {
    ...collab,
    owner: collab.owner ?? collab.participants?.owner,
    request: collab.request ?? workspace?.request ?? collab.collaborationRequest,
    contract: collab.contract ?? workspace?.contract,
    tasks: parseCollaborationTasks(collab.tasks ?? workspace?.tasks),
    timeline: collab.timeline ?? workspace?.timeline,
    tracking: collab.tracking ?? workspace?.tracking,
  };
}

function parseContractPayload(payload) {
  const root = payload?.data ?? payload ?? {};
  const contract = root?.contract ?? root;
  return contract && typeof contract === 'object' ? contract : null;
}

function CollaborationWorkspace() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [collab, setCollab] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const { influencerCollaborations, getMyInfluencerCollaborations } = useInfluncerStore();

  const listCollab = useMemo(
    () => influencerCollaborations.find((c) => String(c._id || c.id) === String(id)),
    [influencerCollaborations, id]
  );

  useEffect(() => {
    if (influencerCollaborations.length === 0) {
      getMyInfluencerCollaborations();
    }
  }, [getMyInfluencerCollaborations, influencerCollaborations.length]);

  useEffect(() => {
    if (!id) return undefined;
    let cancelled = false;

    const loadWorkspace = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [workspaceResult, byIdResult, contractResult, tasksResult] = await Promise.allSettled([
          collaborationService.getCollaborationWorkspace(id),
          collaborationService.getCollaborationById(id),
          collaborationContractsService.getContractByCollaboration(id),
          collaborationTasksService.getTasksByCollaboration(id),
        ]);

        if (cancelled) return;

        let merged =
          (workspaceResult.status === 'fulfilled' && parseCollaborationPayload(workspaceResult.value)) ||
          (byIdResult.status === 'fulfilled' && parseCollaborationPayload(byIdResult.value)) ||
          null;

        if (!merged && listCollab) {
          merged = { ...listCollab, owner: getOwnerFromCollab(listCollab), tasks: parseCollaborationTasks(listCollab.tasks) };
        }

        if (!merged) {
          setLoadError('Collaboration not found.');
          setCollab(null);
          setTasks([]);
          return;
        }

        if (contractResult.status === 'fulfilled') {
          const contract = parseContractPayload(contractResult.value);
          if (contract) merged = { ...merged, contract };
        }

        let loadedTasks = merged.tasks || [];
        if (tasksResult.status === 'fulfilled') {
          const fromApi = parseCollaborationTasks(tasksResult.value);
          if (fromApi.length > 0) loadedTasks = fromApi;
        }

        if (listCollab) {
          merged = {
            ...listCollab,
            ...merged,
            owner: merged.owner ?? getOwnerFromCollab(listCollab),
            request: merged.request ?? listCollab.request,
            contract: merged.contract ?? listCollab.contract,
            tasks: loadedTasks.length > 0 ? loadedTasks : (listCollab.tasks || []),
          };
          if (listCollab.tasks && loadedTasks.length === 0) loadedTasks = parseCollaborationTasks(listCollab.tasks);
        }

        setCollab(merged);
        setTasks(loadedTasks);
      } catch (error) {
        if (!cancelled) {
          setLoadError(typeof error === 'string' ? error : error?.response?.data?.message || error?.message || 'Failed to load collaboration');
          setCollab(null);
          setTasks([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadWorkspace();
    return () => { cancelled = true; };
  }, [id, listCollab]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="w-8 h-8 text-[#C1B6FD] animate-spin" />
      </div>
    );
  }

  if (!collab) {
    return (
      <div className="space-y-4">
        <Link to="/dashboard/influencer/collaborations" className="inline-flex items-center gap-1 text-sm text-[#C1B6FD] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Collaborations
        </Link>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-gray-400">
          {loadError || 'Collaboration not found.'}
        </div>
      </div>
    );
  }

  const status       = collab.status || 'pending_contract_sign';
  const progress     = PROGRESS_MAP[status] ?? 0;
  const campaignName = getCampaignName(collab);
  const ownerObj     = getOwnerFromCollab(collab);
  const brandName    = getBrandName(ownerObj) || collab?.contacts?.owner?.businessName || collab?.contacts?.owner?.name || '—';
  const ownerFullName = collab?.contacts?.owner?.name || (ownerObj ? `${ownerObj.firstName || ''} ${ownerObj.lastName || ''}`.trim() : null);
  const ownerEmail   = collab?.contacts?.owner?.email || ownerObj?.email;
  const ownerWebsite = collab?.owner?.ownerProfile?.website || collab?.contacts?.owner?.website;
  const agreedPrice  = resolveAgreedPrice(collab);
  const timeline     = collab.timeline || {};
  const startDate    = timeline.startDate || collab.startDate || collab?.campaign?.startDate;
  const endDate      = timeline.endDate || collab.endDate || collab?.campaign?.endDate;
  const campaignGoal = collab?.campaign?.campaign_goal || collab?.campaign?.campaignGoal;
  const tracking     = collab?.tracking || {};

  const completedTasksCount = tasks.filter((t) => isTaskComplete(t.status)).length;
  const taskProgress        = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'tasks',    label: `Tasks${tasks.length > 0 ? ` (${tasks.length})` : ''}` },
    { key: 'contract', label: 'Contract' },
  ];

  const stStyle = STATUS_STYLE[status] || STATUS_STYLE.pending;

  return (
    <div className="space-y-5">
      <Link to="/dashboard/influencer/collaborations" className="inline-flex items-center gap-1 text-sm text-[#C1B6FD] hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Collaborations
      </Link>

      {/* ── Hero Card ── */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center text-3xl shadow-lg shrink-0">
              🏢
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{campaignName}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{brandName}{ownerFullName && ownerFullName !== brandName && <span className="text-gray-500"> · {ownerFullName}</span>}</p>
              {campaignGoal && (
                <div className="flex items-center gap-1 mt-1.5">
                  <Target className="w-3.5 h-3.5 text-[#C1B6FD]" />
                  <span className="text-xs text-[#C1B6FD]/80 capitalize">{campaignGoal}</span>
                </div>
              )}
            </div>
          </div>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shrink-0 ${stStyle.cls}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {stStyle.label}
          </span>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Collaboration Stage</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          {tasks.length > 0 && (
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Task Completion</span>
                <span>{taskProgress}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${taskProgress}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 border-b border-white/10 overflow-x-auto">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2.5 font-semibold whitespace-nowrap text-sm transition-all ${
              activeTab === key
                ? 'text-[#C1B6FD] border-b-2 border-[#C1B6FD]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-2">Budget</p>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-[#C1B6FD]" />
                <span className="text-lg font-bold text-white">{agreedPrice > 0 ? Number(agreedPrice).toLocaleString() : '—'}</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-2">Start Date</p>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-white">{fmt(startDate)}</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-2">Deadline</p>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-white">{fmt(endDate)}</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-2">Tasks Done</p>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-lg font-bold text-white">{completedTasksCount}<span className="text-gray-400 text-sm font-normal"> / {tasks.length}</span></span>
              </div>
            </div>
          </div>

          {/* Tracking info if available */}
          {tracking?.duration?.totalDays > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#C1B6FD]" /> Timeline Tracking
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-white">{tracking.duration.elapsedDays ?? '—'}</p>
                  <p className="text-xs text-gray-400">Days Elapsed</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{tracking.duration.remainingDays ?? '—'}</p>
                  <p className="text-xs text-gray-400">Days Remaining</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{tracking.duration.totalDays}</p>
                  <p className="text-xs text-gray-400">Total Days</p>
                </div>
              </div>
              {tracking.health?.isOverdue && (
                <div className="flex items-center gap-2 mt-3 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-400 font-medium">This collaboration is overdue</p>
                </div>
              )}
            </div>
          )}

          {/* Brand / Owner Info */}
          {(ownerFullName || ownerEmail || ownerWebsite || brandName) && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#C1B6FD]" /> Brand Contact
              </h3>
              <div className="space-y-2">
                {brandName && brandName !== '—' && (
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="text-sm text-white font-medium">{brandName}</span>
                  </div>
                )}
                {ownerFullName && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="text-sm text-gray-300">{ownerFullName}</span>
                  </div>
                )}
                {ownerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="text-sm text-gray-300">{ownerEmail}</span>
                  </div>
                )}
                {ownerWebsite && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500 shrink-0" />
                    <a href={ownerWebsite} target="_blank" rel="noopener noreferrer" className="text-sm text-[#C1B6FD] hover:underline">{ownerWebsite}</a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Campaign Details */}
          {collab?.campaign && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C1B6FD]" /> Campaign Details
              </h3>
              <div className="space-y-3">
                {campaignGoal && (
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Goal</p>
                    <p className="text-sm text-gray-200 capitalize">{campaignGoal}</p>
                  </div>
                )}
                {collab.campaign.budget_amount && (
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Campaign Budget</p>
                    <p className="text-sm text-gray-200">
                      {collab.campaign.budget_currency || '$'}{Number(collab.campaign.budget_amount).toLocaleString()}
                    </p>
                  </div>
                )}
                {collab.campaign.campaign_duration_weeks && (
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Duration</p>
                    <p className="text-sm text-gray-200">{collab.campaign.campaign_duration_weeks} weeks</p>
                  </div>
                )}
                {collab.campaign.lifecycleStage && (
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Lifecycle Stage</p>
                    <p className="text-sm text-gray-200 capitalize">{collab.campaign.lifecycleStage}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Request details */}
          {collab?.request && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C1B6FD]" /> Agreement Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {collab.request.proposedBudget && (
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Proposed Budget</p>
                    <p className="text-sm font-semibold text-white">${Number(collab.request.proposedBudget).toLocaleString()}</p>
                  </div>
                )}
                {collab.request.counterPrice && (
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Counter Price</p>
                    <p className="text-sm font-semibold text-[#C1B6FD]">${Number(collab.request.counterPrice).toLocaleString()}</p>
                  </div>
                )}
                {collab.request.message && (
                  <div className="col-span-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Message</p>
                    <p className="text-sm text-gray-300 italic">"{collab.request.message}"</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tasks Tab ── */}
      {activeTab === 'tasks' && (
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
              <Users className="w-10 h-10 mx-auto mb-3 text-gray-600" />
              <p className="text-gray-400 font-medium">No tasks assigned yet</p>
              <p className="text-gray-500 text-sm mt-1">Tasks will appear here once the owner adds them.</p>
            </div>
          ) : (
            tasks.map((task, idx) => {
              const ts  = String(task.status || 'pending').toLowerCase();
              const tsSt = STATUS_STYLE[ts] || STATUS_STYLE.pending;
              const complete = isTaskComplete(ts);
              return (
                <div
                  key={task.id || task._id || idx}
                  className={`bg-white/5 border rounded-xl p-4 transition-all ${complete ? 'border-green-500/20 opacity-80' : 'border-white/10 hover:border-white/20'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${complete ? 'bg-green-500/20' : 'bg-white/10'}`}>
                      {complete ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Clock className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <p className={`text-sm font-semibold truncate ${complete ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {task.taskName || task.title || task.name || `Task ${idx + 1}`}
                        </p>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border whitespace-nowrap ${tsSt.cls}`}>
                          {tsSt.label}
                        </span>
                      </div>
                      {(task.description) && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {(task.dueDate || task.due_date) && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-400">Due {fmt(task.dueDate || task.due_date)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Contract Tab ── */}
      {activeTab === 'contract' && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#C1B6FD]" /> Contract Status
          </h3>
          {status === 'pending_contract_sign' || status === 'waiting_contract_sign' ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-amber-400 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-400">Awaiting your signature</p>
                <p className="text-xs text-gray-400 mt-0.5">Review the contract terms and sign to activate the collaboration.</p>
              </div>
              <Link to={`/dashboard/influencer/collaborations/contracts/${id}`}>
                <button className="px-5 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all whitespace-nowrap">
                  Review & Sign
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-400">Contract active</p>
                <p className="text-xs text-gray-400 mt-0.5">Both parties have signed. The collaboration is underway.</p>
              </div>
              <Link to={`/dashboard/influencer/collaborations/contracts/${id}`} className="ml-auto">
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-all">
                  <FileText className="w-4 h-4" /> View
                </button>
              </Link>
            </div>
          )}

          {collab?.contract && (
            <div className="space-y-3 mt-2">
              {collab.contract.signedAt && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  Signed on {fmt(collab.contract.signedAt)}
                </div>
              )}
              {collab.contract.terms && (
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Terms Summary</p>
                  <p className="text-xs text-gray-300 line-clamp-3">{collab.contract.terms}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CollaborationWorkspace;
