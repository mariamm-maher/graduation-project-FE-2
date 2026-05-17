import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, DollarSign, FileText, ArrowLeft, Loader2, Users } from 'lucide-react';
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

const STATUS_COLOR = {
  completed: 'text-green-400 bg-green-500/20',
  approved: 'text-green-400 bg-green-500/20',
  done: 'text-green-400 bg-green-500/20',
  live: 'text-blue-400 bg-blue-500/20',
  in_progress: 'text-yellow-400 bg-yellow-500/20',
  pending_contract_sign: 'text-amber-400 bg-amber-500/20',
  waiting_contract_sign: 'text-amber-400 bg-amber-500/20',
  pending: 'text-gray-400 bg-gray-500/20',
  cancelled: 'text-red-400 bg-red-500/20',
};

const PROGRESS_MAP = {
  pending_contract_sign: 10,
  waiting_contract_sign: 10,
  live: 40,
  in_progress: 70,
  completed: 100,
  cancelled: 0,
};

function statusColor(s) {
  return STATUS_COLOR[s] || 'text-gray-400 bg-gray-500/20';
}

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
          merged = {
            ...listCollab,
            owner: getOwnerFromCollab(listCollab),
            tasks: parseCollaborationTasks(listCollab.tasks),
          };
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
          };
        }

        setCollab(merged);
        setTasks(loadedTasks);
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            typeof error === 'string'
              ? error
              : error?.response?.data?.message || error?.message || 'Failed to load collaboration'
          );
          setCollab(null);
          setTasks([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadWorkspace();

    return () => {
      cancelled = true;
    };
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

  const status = collab.status || 'pending_contract_sign';
  const progress = PROGRESS_MAP[status] ?? 0;
  const campaignName = getCampaignName(collab);
  const brandName = getBrandName(getOwnerFromCollab(collab));
  const agreedPrice = resolveAgreedPrice(collab);
  const timeline = collab.timeline || {};
  const startDate = timeline.startDate || collab.startDate || collab?.campaign?.startDate;
  const endDate = timeline.endDate || collab.endDate || collab?.campaign?.endDate;

  const completedTasks = tasks.filter((t) => isTaskComplete(t.status)).length;
  const taskProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not set';

  const TABS = ['overview', 'tasks', 'contract'];

  return (
    <div className="space-y-6">
      <Link to="/dashboard/influencer/collaborations" className="inline-flex items-center gap-1 text-sm text-[#C1B6FD] hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Collaborations
      </Link>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center text-3xl shadow-lg shrink-0">
              🏢
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{campaignName}</h1>
              <p className="text-sm text-gray-400 mt-0.5">by {brandName}</p>
              <span className={`inline-flex mt-2 px-3 py-1 rounded-lg text-xs font-semibold ${statusColor(status)}`}>
                {status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Collaboration Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-white/10 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 font-semibold capitalize transition-all whitespace-nowrap text-sm ${
              activeTab === tab
                ? 'text-[#C1B6FD] border-b-2 border-[#C1B6FD]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab}
            {tab === 'tasks' && tasks.length > 0 && (
              <span className="ml-1.5 text-xs opacity-70">({tasks.length})</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Agreed Price</p>
              <p className="text-xl font-bold text-white flex items-center gap-1">
                <DollarSign className="w-5 h-5 text-[#C1B6FD]" />
                {agreedPrice > 0 ? Number(agreedPrice).toLocaleString() : '—'}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Start Date</p>
              <p className="text-sm font-semibold text-white flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                {fmt(startDate)}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">End Date</p>
              <p className="text-sm font-semibold text-white flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                {fmt(endDate)}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Tasks</p>
              <p className="text-sm font-semibold text-white flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                {completedTasks} / {tasks.length} done
              </p>
            </div>
          </div>

          {(collab?.campaign?.campaign_goal || collab?.campaign?.campaignGoal) && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-2">Campaign Goal</h3>
              <p className="text-gray-300 text-sm">{collab.campaign.campaign_goal || collab.campaign.campaignGoal}</p>
            </div>
          )}

          {tasks.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Task Completion</span>
                <span>{taskProgress}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${taskProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          {tasks.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              No tasks assigned yet.
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task, idx) => {
                const ts = String(task.status || '').toLowerCase();
                return (
                  <div
                    key={task.id || task._id || idx}
                    className="flex items-center justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isTaskComplete(ts)
                            ? 'bg-green-500/20 text-green-400'
                            : ts === 'in_progress' || ts === 'in_review' || ts === 'review'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {isTaskComplete(ts) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {task.taskName || task.title || task.name || `Task ${idx + 1}`}
                        </p>
                        {(task.dueDate || task.due_date) && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            Due: {fmt(task.dueDate || task.due_date)}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusColor(ts)}`}>
                      {ts.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'contract' && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Contract</h3>
          {status === 'pending_contract_sign' || status === 'waiting_contract_sign' ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-amber-400 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-400">Contract awaiting signature</p>
                <p className="text-xs text-gray-400 mt-0.5">Review and sign the contract to proceed.</p>
              </div>
              <Link to={`/dashboard/influencer/collaborations/contracts/${id}`}>
                <button className="px-4 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all whitespace-nowrap">
                  Review Contract
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-400">Contract signed</p>
                <p className="text-xs text-gray-400 mt-0.5">Both parties have signed the contract.</p>
              </div>
              <Link to={`/dashboard/influencer/collaborations/contracts/${id}`} className="ml-auto">
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" /> View
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CollaborationWorkspace;
