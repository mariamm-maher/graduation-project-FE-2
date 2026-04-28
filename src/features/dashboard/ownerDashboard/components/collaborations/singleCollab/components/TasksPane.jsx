import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, LayoutGrid, ListChecks, Loader2, Plus, RefreshCw, XCircle } from 'lucide-react';
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
import BoardColumn from '../../CollaborationBoard/BoardColumn';
import TaskCard from '../../CollaborationBoard/TaskCard';
import collaborationTasksService from '../../../../../../../api/CollaborationTasksApi';

const STATUS_MAP = {
  todo:        'todo',
  in_progress: 'in_progress',
  in_review:   'review',
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

export default function TasksPane({ items = [] }) {
  const [selectedCollabId, setSelectedCollabId] = useState(null);
  const [tasks, setTasks]     = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const dragOriginalStatus = useRef(null);
  const [createModal, setCreateModal]   = useState(false);
  const [newTaskName, setNewTaskName]   = useState('');
  const [newTaskDesc, setNewTaskDesc]   = useState('');
  const [newTaskDue,  setNewTaskDue]    = useState('');
  const [newTaskPlatform, setNewTaskPlatform] = useState('');
  const [createLoading, setCreateLoading]     = useState(false);

  // Dropdown states
  const [platformQuery, setPlatformQuery] = useState('');
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);

  const platformOptions = [
    { value: '', label: 'Any' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'Tiktok' },
    { value: 'youtube', label: 'Youtube' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'Linkedin' },
    { value: 'snapchat', label: 'Snapchat' },
    { value: 'other', label: 'Other' },
  ];

  const filteredPlatforms = platformOptions.filter((opt) =>
    opt.label.toLowerCase().includes(platformQuery.trim().toLowerCase())
  );

  const collabs = useMemo(() =>
    (items || []).map((c) => ({
      id:   String(c.id || c._id),
      name: c.campaign?.name || c.campaignName || `Collab #${c.id || c._id}`,
    })),
    [items]
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
    if (selectedCollabId) fetchTasks(selectedCollabId);
  }, [selectedCollabId, fetchTasks]);

  const updateLocalTask = (taskId, patch) =>
    setTasks((prev) => prev.map((t) => (t.id === String(taskId) ? { ...t, ...patch } : t)));

  const handleApprove = useCallback(async (taskId) => {
    setActionLoading(taskId + '_approve');
    try {
      const res = await collaborationTasksService.approveTask(taskId);
      const updated = res?.data?.task || res?.task;
      if (updated) updateLocalTask(taskId, normalizeTask(updated));
      else updateLocalTask(taskId, { status: 'completed', completedAt: new Date().toISOString() });
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to approve task');
    } finally {
      setActionLoading(null);
    }
  }, []);

  const handleCreate = async () => {
    if (!newTaskName.trim() || !selectedCollabId) return;
    setCreateLoading(true);
    try {
      const res = await collaborationTasksService.createTask(selectedCollabId, {
        taskName:    newTaskName.trim(),
        description: newTaskDesc.trim() || undefined,
        dueDate:     newTaskDue  || undefined,
        platform:    newTaskPlatform || undefined,
      });
      const created = res?.data?.task || res?.task;
      if (created) setTasks((prev) => [normalizeTask(created), ...prev]);
      setCreateModal(false);
      setNewTaskName('');
      setNewTaskDesc('');
      setNewTaskDue('');
      setNewTaskPlatform('');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to create task');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleReject = async (taskId) => {
    setActionLoading(taskId + '_reject');
    try {
      const res = await collaborationTasksService.rejectTask(taskId, { reviewNote: 'Please revise and resubmit.' });
      const updated = res?.data?.task || res?.task;
      if (updated) updateLocalTask(taskId, normalizeTask(updated));
      else updateLocalTask(taskId, { status: 'todo' });
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to reject task');
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

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t.id === event.active.id) || null;
    setActiveTask(task);
    dragOriginalStatus.current = task?.status ?? null;
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeItem = tasks.find((t) => t.id === active.id);
    if (!activeItem) return;
    const overTask   = tasks.find((t) => t.id === over.id);
    const nextStatus = overTask ? overTask.status : over.id;
    if (!nextStatus || activeItem.status === nextStatus) return;
    setTasks((prev) => prev.map((t) =>
      t.id === active.id
        ? { ...t, status: nextStatus }
        : t
    ));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const droppedTask = tasks.find((t) => t.id === active.id);
    if (!droppedTask) return;

    const overTask   = tasks.find((t) => t.id === over.id && t.id !== active.id);
    const nextStatus = overTask ? overTask.status : over.id;

    const prevStatus = dragOriginalStatus.current;
    dragOriginalStatus.current = null;

    if (!nextStatus || prevStatus === nextStatus) return;

    try {
      await collaborationTasksService.moveTask(droppedTask.id, nextStatus);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to move task');
      if (prevStatus) {
        setTasks((prev) => prev.map((t) =>
          t.id === droppedTask.id ? { ...t, status: prevStatus } : t
        ));
      } else {
        fetchTasks(selectedCollabId);
      }
    }
  };

  const onOpenTaskDetails = useCallback((task) => {
    if (task.status === 'review') {
      if (window.confirm(`Approve task "${task.taskName}"?`)) handleApprove(task.id);
    }
  }, [handleApprove]);

  return (
    <>
    {createModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="w-full max-w-md rounded-2xl border border-[#745CB4]/30 bg-[#1A112C] p-6 space-y-4 shadow-2xl">
          <h3 className="text-lg font-bold text-white">New Task</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1">Task name <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="e.g. Record product reel"
                className="w-full px-3 py-2 rounded-lg bg-[#241A3A]/70 border border-[#745CB4]/25 text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#C1B6FD]/45"
              />
            </div>
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1">Description (optional)</label>
              <textarea
                rows={2}
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="What should the influencer do?"
                className="w-full px-3 py-2 rounded-lg bg-[#241A3A]/70 border border-[#745CB4]/25 text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#C1B6FD]/45 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Due date (optional)</label>
                <input
                  type="date"
                  value={newTaskDue}
                  onChange={(e) => setNewTaskDue(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#241A3A]/70 border border-[#745CB4]/25 text-sm text-white focus:outline-none focus:border-[#C1B6FD]/45"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Platform (optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={isPlatformOpen ? platformQuery : (platformOptions.find(p => p.value === newTaskPlatform)?.label || '')}
                    onChange={(e) => {
                      setPlatformQuery(e.target.value);
                      setIsPlatformOpen(true);
                    }}
                    onFocus={() => { setPlatformQuery(''); setIsPlatformOpen(true); }}
                    onBlur={() => setTimeout(() => { setIsPlatformOpen(false); setPlatformQuery(''); }, 150)}
                    placeholder="Search platforms"
                    className="w-full px-3 py-2 rounded-lg bg-[#241A3A]/70 border border-[#745CB4]/25 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/45"
                  />
                  {isPlatformOpen && (
                    <div className="absolute top-full mt-2 w-full z-20 bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                      {filteredPlatforms.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setNewTaskPlatform(option.value);
                            setPlatformQuery('');
                            setIsPlatformOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                        >
                          <span className="flex items-center justify-between">
                            {option.label}
                            {newTaskPlatform === option.value && (
                              <CheckCircle2 className="w-4 h-4 text-[#C1B6FD]" />
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={() => setCreateModal(false)}
              className="px-4 py-2 rounded-lg border border-[#745CB4]/25 text-[#9CA3AF] text-sm hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={!newTaskName.trim() || createLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#745CB4] border border-[#C1B6FD]/30 text-white text-sm font-semibold hover:bg-[#5e4a9a] disabled:opacity-50 transition-colors"
            >
              {createLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Create Task
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
                Task Board
              </h3>
              <p className="text-sm text-[#9CA3AF] mt-1">Approve or reject submitted tasks from your influencers.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/50">
                <ListChecks className="w-4 h-4 text-[#C1B6FD]" />
                <span className="text-xs font-semibold text-[#C1B6FD]">{tasks.length} tasks</span>
              </div>
              <button
                type="button"
                onClick={() => setCreateModal(true)}
                disabled={!selectedCollabId}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#C1B6FD]/30 bg-[#745CB4]/70 text-white text-xs font-semibold hover:bg-[#745CB4] transition-colors disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" /> Add Task
              </button>
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

          {collabs.length > 1 && (
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
          <>
            {tasksByStatus.review.length > 0 && (
              <div className="rounded-xl border border-purple-500/25 bg-purple-500/5 p-4 space-y-2">
                <p className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {tasksByStatus.review.length} task{tasksByStatus.review.length > 1 ? 's' : ''} awaiting your review
                </p>
                <div className="flex flex-wrap gap-2">
                  {tasksByStatus.review.map((task) => (
                    <div key={task.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 text-sm text-purple-200">
                      <span className="truncate max-w-[160px]">{task.taskName}</span>
                      <button
                        type="button"
                        disabled={!!actionLoading}
                        onClick={() => handleApprove(task.id)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/20 border border-green-500/30 text-green-300 text-xs hover:bg-green-500/35 disabled:opacity-40 transition-colors"
                      >
                        {actionLoading === task.id + '_approve' ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={!!actionLoading}
                        onClick={() => handleReject(task.id)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/20 border border-red-500/30 text-red-300 text-xs hover:bg-red-500/35 disabled:opacity-40 transition-colors"
                      >
                        {actionLoading === task.id + '_reject' ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                        Reject
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <div className="grid grid-cols-4 gap-4 min-w-[1200px]">
                <BoardColumn status="todo"        title="To Do"       tasks={tasksByStatus.todo}        color="bg-gray-400"   onOpenTaskDetails={onOpenTaskDetails} onAddTask={() => setCreateModal(true)} />
                <BoardColumn status="in_progress" title="In Progress" tasks={tasksByStatus.in_progress} color="bg-blue-400"   onOpenTaskDetails={onOpenTaskDetails} onAddTask={() => {}} />
                <BoardColumn status="review"      title="In Review"   tasks={tasksByStatus.review}      color="bg-purple-400" onOpenTaskDetails={onOpenTaskDetails} onAddTask={() => {}} />
                <BoardColumn status="completed"   title="Completed"   tasks={tasksByStatus.completed}   color="bg-green-400"  onOpenTaskDetails={onOpenTaskDetails} onAddTask={() => {}} />
              </div>
            </div>
          </>
        )}

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} onOpenDetails={() => {}} /> : null}
        </DragOverlay>
      </section>
    </DndContext>
    </>
  );
}
