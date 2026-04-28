import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, Calendar, LayoutGrid, ListChecks, Loader2, RefreshCw, User, XCircle } from 'lucide-react';
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import BoardColumn from '../../../ownerDashboard/components/collaborations/CollaborationBoard/BoardColumn';
import TaskCard from '../../../ownerDashboard/components/collaborations/CollaborationBoard/TaskCard';
import collaborationTasksService from '../../../../../api/CollaborationTasksApi';
import useCollaborationTasksStore from '../../../../../stores/CollaborationTasksStore';

const STATUS_MAP = {
  todo:        'todo',
  in_progress: 'in_progress',
  in_review:   'review',
  Approved:    'completed',
  approved:    'completed',
  rejected:    'todo',
};

function normalizeTask(t) {
  return {
    ...t,
    id: String(t.id),
    status: STATUS_MAP[t.status] ?? t.status,
  };
}

export default function TasksPane() {
  const { groupedCollaborations, getMyTasksAsInfluencer, isLoading: isCollabsLoading } =
    useCollaborationTasksStore();

  const [selectedCollabId, setSelectedCollabId] = useState(null);
  const [tasks, setTasks]           = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [submitModal, setSubmitModal] = useState(null);
  const [submitUrl, setSubmitUrl]     = useState('');
  const [submitNote, setSubmitNote]   = useState('');

  useEffect(() => {
    getMyTasksAsInfluencer();
  }, [getMyTasksAsInfluencer]);

  const collabs = useMemo(() =>
    (groupedCollaborations || []).map((c) => ({
      id:        String(c.collaborationId),
      name:      c.campaignName || `Collab #${c.collaborationId}`,
      ownerName: c.ownerName    || '—',
      status:    c.status       || '—',
      startDate: c.startDate    || null,
      endDate:   c.endDate      || null,
    })),
    [groupedCollaborations]
  );

  const selectedCollab = useMemo(
    () => collabs.find((c) => c.id === selectedCollabId) || null,
    [collabs, selectedCollabId]
  );

  useEffect(() => {
    if (!selectedCollabId && collabs.length > 0) {
      setSelectedCollabId(collabs[0].id);
    }
  }, [collabs, selectedCollabId]);

  const fetchTasks = useCallback(async (collabId) => {
    if (!collabId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await collaborationTasksService.getTasksByCollaboration(collabId);
      const raw = res?.data?.tasks || res?.tasks || res?.data || [];
      setTasks((Array.isArray(raw) ? raw : []).map(normalizeTask));
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedCollabId) return;
    fetchTasks(selectedCollabId);
  }, [selectedCollabId, fetchTasks]);

  const updateLocalTask = (taskId, patch) =>
    setTasks((prev) => prev.map((t) => (t.id === String(taskId) ? { ...t, ...patch } : t)));

  const handleStart = async (taskId) => {
    setActionLoading(taskId + '_start');
    try {
      const res = await collaborationTasksService.startTask(taskId);
      const updated = res?.data?.task || res?.task;
      if (updated) updateLocalTask(taskId, normalizeTask(updated));
      else updateLocalTask(taskId, { status: 'in_progress' });
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to start task');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmit = async () => {
    if (!submitModal) return;
    setActionLoading(submitModal + '_submit');
    try {
      const res = await collaborationTasksService.submitTask(submitModal, {
        submissionUrl:  submitUrl  || undefined,
        submissionNote: submitNote || undefined,
      });
      const updated = res?.data?.task || res?.task;
      if (updated) updateLocalTask(submitModal, normalizeTask(updated));
      else updateLocalTask(submitModal, { status: 'review' });
      setSubmitModal(null);
      setSubmitUrl('');
      setSubmitNote('');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to submit task');
    } finally {
      setActionLoading(null);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const tasksByStatus = useMemo(() => ({
    todo:        tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    review:      tasks.filter((t) => t.status === 'review'),
    completed:   tasks.filter((t) => t.status === 'completed'),
  }), [tasks]);

  const dragOriginalStatus = useRef(null);

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t.id === event.active.id) || null;
    setActiveTask(task);
    dragOriginalStatus.current = task?.status ?? null;
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeItem = tasks.find((t) => t.id === active.id);
    const overTask   = tasks.find((t) => t.id === over.id);
    if (!activeItem) return;
    const nextStatus = overTask ? overTask.status : over.id;
    if (!nextStatus || activeItem.status === nextStatus) return;
    setTasks((prev) => prev.map((t) =>
      t.id === active.id ? { ...t, status: nextStatus } : t
    ));
  };

  const handleDragEnd = (event) => {
    const { active } = event;
    setActiveTask(null);
    const prevStatus = dragOriginalStatus.current;
    dragOriginalStatus.current = null;
    if (prevStatus) {
      setTasks((prev) => prev.map((t) =>
        t.id === active.id ? { ...t, status: prevStatus } : t
      ));
    }
  };

  const onOpenTaskDetails = useCallback((task) => {
    if (task.status === 'todo') handleStart(task.id);
    else if (task.status === 'in_progress') setSubmitModal(task.id);
  }, []);

  return (
    <>
      {submitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#745CB4]/30 bg-[#1A112C] p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Submit Task for Review</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Submission URL (optional)</label>
                <input
                  type="url"
                  value={submitUrl}
                  onChange={(e) => setSubmitUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-[#241A3A]/70 border border-[#745CB4]/25 text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#C1B6FD]/45"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Submission Note (optional)</label>
                <textarea
                  rows={3}
                  value={submitNote}
                  onChange={(e) => setSubmitNote(e.target.value)}
                  placeholder="Add any notes for the brand..."
                  className="w-full px-3 py-2 rounded-lg bg-[#241A3A]/70 border border-[#745CB4]/25 text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#C1B6FD]/45 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => { setSubmitModal(null); setSubmitUrl(''); setSubmitNote(''); }}
                className="px-4 py-2 rounded-lg border border-[#745CB4]/25 text-[#9CA3AF] text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!!actionLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#745CB4] border border-[#C1B6FD]/30 text-white text-sm font-semibold hover:bg-[#5e4a9a] disabled:opacity-50 transition-colors"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Submit for Review
              </button>
            </div>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <section className="space-y-4">
          <div className="rounded-xl border border-[#745CB4]/25 bg-linear-to-b from-[#241A3A]/70 to-[#1A112C]/70 backdrop-blur-md p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white inline-flex items-center gap-2.5">
                  <LayoutGrid className="w-6 h-6 text-[#C1B6FD]" />
                  My Task Board
                </h3>
                <p className="text-sm text-[#9CA3AF] mt-1">
                  Click a <span className="text-blue-300">To Do</span> task to start it, or an <span className="text-blue-300">In Progress</span> task to submit for review.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/50">
                  <ListChecks className="w-4 h-4 text-[#C1B6FD]" />
                  <span className="text-xs font-semibold text-[#C1B6FD]">{tasks.length} tasks</span>
                </div>
                <button
                  type="button"
                  onClick={() => fetchTasks(selectedCollabId)}
                  disabled={isLoading}
                  className="p-2 rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/50 text-[#C1B6FD] hover:bg-[#241A3A]/70 transition-colors disabled:opacity-40"
                  aria-label="Refresh tasks"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {isCollabsLoading ? (
              <div className="mt-3 flex items-center gap-2 text-xs text-[#9CA3AF]">
                <Loader2 className="w-3 h-3 animate-spin" /> Loading collaborations…
              </div>
            ) : collabs.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {collabs.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCollabId(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selectedCollabId === c.id
                        ? 'bg-[#745CB4] border-[#C1B6FD]/40 text-white'
                        : 'bg-[#1A112C]/50 border-[#745CB4]/25 text-[#9CA3AF] hover:text-white hover:border-[#745CB4]/50'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedCollab && (
            <div className="rounded-xl border border-[#745CB4]/25 bg-[#1A112C]/60 px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span className="font-semibold text-white text-base">{selectedCollab.name}</span>
              <span className="flex items-center gap-1.5 text-[#C1B6FD]">
                <User className="w-3.5 h-3.5" />
                {selectedCollab.ownerName}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                selectedCollab.status === 'live' || selectedCollab.status === 'in_progress'
                  ? 'bg-green-500/15 border-green-500/30 text-green-300'
                  : selectedCollab.status === 'completed'
                  ? 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                  : 'bg-[#745CB4]/20 border-[#745CB4]/30 text-[#C1B6FD]'
              }`}>
                {selectedCollab.status.replace(/_/g, ' ')}
              </span>
              {(selectedCollab.startDate || selectedCollab.endDate) && (
                <span className="flex items-center gap-1.5 text-[#9CA3AF]">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedCollab.startDate ?? '?'} → {selectedCollab.endDate ?? '?'}
                </span>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-500/25 bg-red-500/10 text-red-300 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
              <button type="button" onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-200">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-[#9CA3AF]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading tasks…</span>
            </div>
          ) : !selectedCollabId ? (
            <div className="text-center py-16 text-[#9CA3AF] text-sm">
              <ListChecks className="w-10 h-10 mx-auto mb-3 opacity-25" />
              No collaborations yet.
            </div>
          ) : (
            <div className="overflow-x-auto pb-3 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#1A112C] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#745CB4]/60 hover:[&::-webkit-scrollbar-thumb]:bg-[#C1B6FD]/70">
              <div className="grid grid-cols-4 gap-4 min-w-[1200px]">
                <BoardColumn status="todo"        title="To Do"       tasks={tasksByStatus.todo}        color="bg-gray-400"   onOpenTaskDetails={onOpenTaskDetails} onAddTask={() => {}} />
                <BoardColumn status="in_progress" title="In Progress" tasks={tasksByStatus.in_progress} color="bg-blue-400"   onOpenTaskDetails={onOpenTaskDetails} onAddTask={() => {}} />
                <BoardColumn status="review"      title="In Review"   tasks={tasksByStatus.review}      color="bg-purple-400" onOpenTaskDetails={onOpenTaskDetails} onAddTask={() => {}} />
                <BoardColumn status="completed"   title="Completed"   tasks={tasksByStatus.completed}   color="bg-green-400"  onOpenTaskDetails={onOpenTaskDetails} onAddTask={() => {}} />
              </div>
            </div>
          )}

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} onOpenDetails={() => {}} /> : null}
          </DragOverlay>
        </section>
      </DndContext>
    </>
  );
}
