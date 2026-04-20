import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, Clock3, FileText, Loader2, MessageSquare, Target, X } from 'lucide-react';
import { toast } from 'react-toastify';
import useCollaborationStore from '../../../../../../stores/collaborationStore';
import useCollaborationRequestsStore from '../../../../../../stores/CollaborationRequestsStore';
import collaborationService from '../../../../../../api/collaborationApi';

const STAGES = ['Request', 'Contract', 'Tasks', 'Completion'];

const getMockWorkspace = (collaborationId) => ({
  collaboration: {
    id: Number(collaborationId) || 12,
    status: 'in_progress',
    startDate: '2026-04-20',
    endDate: '2026-05-20',
    owner: { id: 3, name: 'Maria Brand', brandName: 'Glow Labs' },
    influencer: { id: 8, name: 'Sarah Johnson', image: '' },
    campaign: { id: 77, name: 'Summer Fashion Launch', campaignName: 'Summer Fashion Launch' },
  },
  request: {
    id: 41,
    status: 'accepted',
    proposedBudget: 1200,
    counterPrice: null,
    message: 'We would love to collaborate on our summer campaign.',
    responseMessage: 'Sounds good, happy to join!',
    createdAt: '2026-04-18T08:30:00Z',
  },
  contract: {
    id: 15,
    status: 'signed',
    deliverables: ['2 reels', '3 stories'],
    signedAt: '2026-04-19T14:15:00Z',
  },
  tasks: {
    total: 9,
    todo: 3,
    in_review: 2,
    done: 4,
    items: [
      { id: 1, title: 'Draft first reel', status: 'done' },
      { id: 2, title: 'Submit story scripts', status: 'in_review' },
      { id: 3, title: 'Record product unboxing', status: 'todo' },
    ],
  },
  chat: {
    roomId: 6,
    unreadCount: 5,
    lastMessage: {
      content: 'I will send the final assets by tonight.',
      sentAt: '2026-04-20T11:00:00Z',
      senderId: 8,
    },
  },
  timeline: [
    { type: 'REQUEST_SENT', at: '2026-04-18T08:30:00Z', label: 'Request sent' },
    { type: 'REQUEST_ACCEPTED', at: '2026-04-18T12:00:00Z', label: 'Request accepted' },
    { type: 'CONTRACT_CREATED', at: '2026-04-19T09:00:00Z', label: 'Contract generated' },
    { type: 'CONTRACT_SIGNED', at: '2026-04-19T14:15:00Z', label: 'Contract signed' },
    { type: 'TASK_CREATED', at: '2026-04-20T07:40:00Z', label: 'Tasks created' },
  ],
  permissions: {
    canCounter: false,
    canAccept: false,
    canReject: false,
    canSignContract: false,
    canCreateTask: true,
    canUpdateTask: true,
    canCancelCollaboration: false,
  },
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const stageIndexFromWorkspace = (workspace) => {
  const contractSigned = workspace?.contract?.status === 'signed';
  const tasksDone = Number(workspace?.tasks?.done || 0) > 0;
  const status = String(workspace?.collaboration?.status || '').toLowerCase();

  if (status === 'completed') return 3;
  if (tasksDone) return 2;
  if (contractSigned) return 1;
  return 0;
};

const statusClass = (status) => {
  const s = String(status || '').toLowerCase();
  if (s === 'completed') return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
  if (s === 'cancelled') return 'bg-red-500/20 border-red-500/30 text-red-300';
  if (s === 'active' || s === 'in_progress' || s === 'in-progress') return 'bg-green-500/20 border-green-500/30 text-green-300';
  return 'bg-amber-500/20 border-amber-500/30 text-amber-300';
};

export default function CollaborationWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [counterBudget, setCounterBudget] = useState('');
  const [counterMessage, setCounterMessage] = useState('');
  const [useMockData, setUseMockData] = useState(false);

  const {
    collaborationWorkspace,
    isCollaborationWorkspaceLoading,
    collaborationWorkspaceError,
    fetchCollaborationWorkspace,
    completeCollaboration,
    cancelCollaboration,
  } = useCollaborationStore();

  const { respondToRequest } = useCollaborationRequestsStore();

  useEffect(() => {
    const loadWorkspace = async () => {
      if (!id) return;
      const res = await fetchCollaborationWorkspace(id);
      setUseMockData(!res?.success);
    };

    loadWorkspace();
  }, [id, fetchCollaborationWorkspace]);

  const workspace = useMockData ? getMockWorkspace(id) : (collaborationWorkspace || {});
  const collaboration = workspace.collaboration || {};
  const request = workspace.request || {};
  const contract = workspace.contract || {};
  const tasks = workspace.tasks || { total: 0, todo: 0, in_review: 0, done: 0, items: [] };
  const chat = workspace.chat || {};
  const timeline = Array.isArray(workspace.timeline) ? workspace.timeline : [];
  const permissions = workspace.permissions || {};

  const currentStage = stageIndexFromWorkspace(workspace);

  const handleWorkspaceRefresh = async () => {
    if (!id) return;
    const res = await fetchCollaborationWorkspace(id);
    setUseMockData(!res?.success);
  };

  const handleRespond = async (action) => {
    if (useMockData) {
      toast.info('Workspace API is not ready yet. Mock mode enabled.');
      return;
    }

    if (!request.id) {
      toast.error('Request data unavailable');
      return;
    }

    const res = await respondToRequest(request.id, { action });
    if (res?.success) {
      toast.success(`Request ${action}ed`);
      handleWorkspaceRefresh();
    } else {
      toast.error(res?.error || 'Action failed');
    }
  };

  const handleCounter = async () => {
    if (useMockData) {
      toast.info('Workspace API is not ready yet. Mock mode enabled.');
      return;
    }

    if (!request.id) {
      toast.error('Request data unavailable');
      return;
    }

    const budget = Number(counterBudget);
    if (!budget || budget <= 0) {
      toast.error('Enter a valid counter budget');
      return;
    }

    const payload = {
      action: 'counter',
      newBudget: budget,
      responseMessage: counterMessage || undefined,
    };

    const res = await respondToRequest(request.id, payload);
    if (res?.success) {
      toast.success('Counter offer sent');
      setCounterBudget('');
      setCounterMessage('');
      handleWorkspaceRefresh();
    } else {
      toast.error(res?.error || 'Failed to send counter offer');
    }
  };

  const handleSignContract = async () => {
    if (useMockData) {
      toast.info('Workspace API is not ready yet. Mock mode enabled.');
      return;
    }

    if (!contract.id) {
      toast.error('Contract data unavailable');
      return;
    }

    try {
      await collaborationService.signContract(contract.id);
      toast.success('Contract signed');
      handleWorkspaceRefresh();
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to sign contract');
    }
  };

  const handleMarkComplete = async () => {
    if (useMockData) {
      toast.info('Workspace API is not ready yet. Mock mode enabled.');
      return;
    }

    if (!collaboration.id) {
      toast.error('Collaboration data unavailable');
      return;
    }

    const res = await completeCollaboration(collaboration.id);
    if (res?.success) {
      toast.success('Collaboration completed');
      handleWorkspaceRefresh();
    } else {
      toast.error(res?.error || 'Failed to complete collaboration');
    }
  };

  const handleCancel = async () => {
    if (useMockData) {
      toast.info('Workspace API is not ready yet. Mock mode enabled.');
      return;
    }

    if (!collaboration.id) {
      toast.error('Collaboration data unavailable');
      return;
    }

    const res = await cancelCollaboration(collaboration.id);
    if (res?.success) {
      toast.success('Collaboration cancelled');
      handleWorkspaceRefresh();
    } else {
      toast.error(res?.error || 'Failed to cancel collaboration');
    }
  };

  if (isCollaborationWorkspaceLoading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-10 flex items-center justify-center gap-3 text-gray-300">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading workspace...
      </div>
    );
  }

  if (collaborationWorkspaceError && !useMockData) {
    return (
      <div className="space-y-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300">
          {collaborationWorkspaceError}
        </div>
        <button
          onClick={handleWorkspaceRefresh}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/15"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {useMockData && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-200 text-sm">
          Mock data is displayed until the workspace API is ready: <span className="font-semibold">GET /api/collaborations/:id/workspace</span>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {collaboration?.campaign?.name || collaboration?.campaign?.campaignName || 'Collaboration Workspace'}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {collaboration?.owner?.brandName || collaboration?.owner?.name || 'Owner'} · {collaboration?.influencer?.name || 'Influencer'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${statusClass(collaboration?.status)}`}>
              {String(collaboration?.status || 'pending').replace('_', ' ')}
            </span>
            <span className="text-xs text-gray-400">{formatDate(collaboration?.startDate)} - {formatDate(collaboration?.endDate)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="grid grid-cols-4 gap-2">
          {STAGES.map((stage, idx) => (
            <div key={stage} className="space-y-2">
              <p className={`text-xs font-medium ${idx <= currentStage ? 'text-white' : 'text-gray-500'}`}>{stage}</p>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className={`h-full ${idx <= currentStage ? 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD]' : 'bg-transparent'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="text-base font-semibold text-white">Request</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <p className="text-gray-300">Status: <span className="text-white">{request.status || 'N/A'}</span></p>
              <p className="text-gray-300">Proposed Budget: <span className="text-white">${Number(request.proposedBudget || 0).toLocaleString()}</span></p>
              <p className="text-gray-300">Counter Price: <span className="text-white">{request.counterPrice ? `$${Number(request.counterPrice).toLocaleString()}` : 'N/A'}</span></p>
              <p className="text-gray-300">Created: <span className="text-white">{formatDate(request.createdAt)}</span></p>
            </div>
            {request.message && <p className="text-sm text-gray-400">{request.message}</p>}
            {request.responseMessage && <p className="text-sm text-blue-300">{request.responseMessage}</p>}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="text-base font-semibold text-white">Contract</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <p className="text-gray-300">Status: <span className="text-white">{contract.status || 'N/A'}</span></p>
              <p className="text-gray-300">Signed At: <span className="text-white">{formatDate(contract.signedAt)}</span></p>
            </div>
            <p className="text-sm text-gray-400">Deliverables: {Array.isArray(contract.deliverables) ? contract.deliverables.length : 0}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="text-base font-semibold text-white">Tasks</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div className="bg-white/5 border border-white/10 rounded-lg p-2"><p className="text-gray-400 text-xs">Total</p><p className="text-white font-semibold">{tasks.total || 0}</p></div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-2"><p className="text-gray-400 text-xs">Todo</p><p className="text-white font-semibold">{tasks.todo || 0}</p></div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-2"><p className="text-gray-400 text-xs">In Review</p><p className="text-white font-semibold">{tasks.in_review || 0}</p></div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-2"><p className="text-gray-400 text-xs">Done</p><p className="text-white font-semibold">{tasks.done || 0}</p></div>
            </div>

            <div className="space-y-2">
              {(tasks.items || []).slice(0, 6).map((task, idx) => (
                <div key={task.id || task._id || idx} className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex items-center justify-between gap-2">
                  <p className="text-sm text-white truncate">{task.title || task.name || `Task ${idx + 1}`}</p>
                  <span className="text-xs text-gray-400">{task.status || 'todo'}</span>
                </div>
              ))}
              {(!tasks.items || tasks.items.length === 0) && <p className="text-sm text-gray-400">No tasks yet.</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="text-base font-semibold text-white">Quick Actions</h3>

            <div className="grid gap-2">
              <button
                onClick={() => handleRespond('accept')}
                disabled={!permissions.canAccept}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-green-500/20 border border-green-500/30 text-green-300 disabled:opacity-50"
              >
                <span className="inline-flex items-center gap-1"><Check className="w-4 h-4" /> Accept</span>
              </button>

              <button
                onClick={() => handleRespond('reject')}
                disabled={!permissions.canReject}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-red-500/20 border border-red-500/30 text-red-300 disabled:opacity-50"
              >
                <span className="inline-flex items-center gap-1"><X className="w-4 h-4" /> Reject</span>
              </button>

              {permissions.canCounter && (
                <div className="space-y-2 bg-white/5 border border-white/10 rounded-lg p-2.5">
                  <input
                    type="number"
                    value={counterBudget}
                    onChange={(e) => setCounterBudget(e.target.value)}
                    placeholder="Counter budget"
                    className="w-full px-2.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                  />
                  <textarea
                    rows={2}
                    value={counterMessage}
                    onChange={(e) => setCounterMessage(e.target.value)}
                    placeholder="Counter message"
                    className="w-full px-2.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                  />
                  <button
                    onClick={handleCounter}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white"
                  >
                    Send Counter
                  </button>
                </div>
              )}

              <button
                onClick={handleSignContract}
                disabled={!permissions.canSignContract}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-blue-500/20 border border-blue-500/30 text-blue-300 disabled:opacity-50"
              >
                <span className="inline-flex items-center gap-1"><FileText className="w-4 h-4" /> Sign Contract</span>
              </button>

              <button
                onClick={() => navigate(`/dashboard/owner/collaborations/board?collaboration=${id}`)}
                disabled={!permissions.canCreateTask}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-white/10 border border-white/20 text-white disabled:opacity-50"
              >
                <span className="inline-flex items-center gap-1"><Target className="w-4 h-4" /> Create Task</span>
              </button>

              <button
                onClick={handleMarkComplete}
                disabled={!permissions.canUpdateTask}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 disabled:opacity-50"
              >
                Mark Complete
              </button>

              <button
                onClick={handleCancel}
                disabled={!permissions.canCancelCollaboration}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-red-500/10 border border-red-500/20 text-red-300 disabled:opacity-50"
              >
                Cancel Collaboration
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="text-base font-semibold text-white">Chat Summary</h3>
            <p className="text-sm text-gray-300">Room: {chat.roomId || 'N/A'}</p>
            <p className="text-sm text-gray-300">Unread: {chat.unreadCount || 0}</p>
            <p className="text-sm text-gray-400 truncate">{chat.lastMessage?.content || 'No recent messages'}</p>
            <button
              onClick={() => navigate(`/dashboard/owner/collaborations/chat-rooms?room=${chat.roomId || ''}`)}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-white/10 border border-white/20 text-white"
            >
              <span className="inline-flex items-center gap-1"><MessageSquare className="w-4 h-4" /> Open Chat</span>
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="text-base font-semibold text-white">Timeline</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {timeline.map((event, idx) => (
                <div key={`${event.type || 'event'}-${idx}`} className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                  <p className="text-xs text-[#C1B6FD] font-medium">{event.label || event.type || 'Event'}</p>
                  <p className="text-xs text-gray-400 mt-1 inline-flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" /> {formatDate(event.at)}</p>
                </div>
              ))}
              {timeline.length === 0 && <p className="text-sm text-gray-400">No timeline events yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

