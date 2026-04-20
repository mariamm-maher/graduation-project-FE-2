import { LayoutGrid, ListChecks } from 'lucide-react';
import { useMemo, useState } from 'react';
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

const INITIAL_TASKS = [
  {
    id: 't-1',
    taskName: 'Finalize brief for influencer',
    description: 'Share final creative brief and visual references before production starts.',
    status: 'todo',
    priority: 'high',
    assignedTo: 2,
    assignedToName: 'Ava Morgan',
    dueDate: '2026-04-24',
    completedAt: null,
    tags: ['brief', 'planning'],
    attachments: 2,
    comments: 3,
    watchers: 2,
  },
  {
    id: 't-2',
    taskName: 'Record first draft reel',
    description: 'Shoot draft reel with product highlight sequence and CTA ending.',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 2,
    assignedToName: 'Ava Morgan',
    dueDate: '2026-04-26',
    completedAt: null,
    tags: ['video', 'draft'],
    attachments: 1,
    comments: 4,
    watchers: 3,
  },
  {
    id: 't-3',
    taskName: 'Internal quality review',
    description: 'Check brand-safe messaging, pacing, and legal copy before approval.',
    status: 'review',
    priority: 'medium',
    assignedTo: 1,
    assignedToName: 'You (Owner)',
    dueDate: '2026-04-27',
    completedAt: null,
    tags: ['review', 'compliance'],
    attachments: 3,
    comments: 5,
    watchers: 2,
  },
  {
    id: 't-4',
    taskName: 'Schedule publishing window',
    description: 'Book posting slot and sync with campaign launch calendar.',
    status: 'completed',
    priority: 'low',
    assignedTo: 1,
    assignedToName: 'You (Owner)',
    dueDate: '2026-04-20',
    completedAt: '2026-04-19',
    tags: ['schedule'],
    attachments: 0,
    comments: 2,
    watchers: 1,
  },
  {
    id: 't-5',
    taskName: 'Prepare final caption pack',
    description: 'Create 3 approved caption variants and hashtags for posting day.',
    status: 'todo',
    priority: 'medium',
    assignedTo: 3,
    assignedToName: 'Noah Davis',
    dueDate: '2026-04-28',
    completedAt: null,
    tags: ['copy'],
    attachments: 1,
    comments: 1,
    watchers: 1,
  },
];

export default function TasksPane() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const tasksByStatus = useMemo(
    () => ({
      todo: tasks.filter((task) => task.status === 'todo'),
      in_progress: tasks.filter((task) => task.status === 'in_progress'),
      review: tasks.filter((task) => task.status === 'review'),
      completed: tasks.filter((task) => task.status === 'completed'),
    }),
    [tasks]
  );

  const handleDragStart = (event) => {
    const task = tasks.find((item) => item.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeItem = tasks.find((task) => task.id === active.id);
    const overTask = tasks.find((task) => task.id === over.id);

    if (!activeItem) return;

    const nextStatus = overTask ? overTask.status : over.id;
    if (!nextStatus || activeItem.status === nextStatus) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === active.id
          ? {
              ...task,
              status: nextStatus,
              completedAt: nextStatus === 'completed' ? new Date().toISOString().slice(0, 10) : null,
            }
          : task
      )
    );
  };

  const handleDragEnd = () => {
    setActiveTask(null);
  };

  const handleAddTask = (status) => {
    const id = `t-${Date.now()}`;
    const newTask = {
      id,
      taskName: 'New task',
      description: 'Add task details and assign owner.',
      status,
      priority: 'medium',
      assignedTo: 1,
      assignedToName: 'You (Owner)',
      dueDate: '2026-05-01',
      completedAt: status === 'completed' ? new Date().toISOString().slice(0, 10) : null,
      tags: ['new'],
      attachments: 0,
      comments: 0,
      watchers: 0,
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  const onOpenTaskDetails = () => {};

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <section className="space-y-4">
        <div className="rounded-xl border border-[#745CB4]/25 bg-linear-to-b from-[#241A3A]/70 to-[#1A112C]/70 backdrop-blur-md p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white inline-flex items-center gap-2.5">
                <LayoutGrid className="w-6 h-6 text-[#C1B6FD]" />
                Task Board
              </h3>
              <p className="text-sm text-[#9CA3AF] mt-1">Drag and drop tasks across columns to manage workflow.</p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/50">
              <ListChecks className="w-4 h-4 text-[#C1B6FD]" />
              <span className="text-xs font-semibold text-[#C1B6FD]">{tasks.length} total tasks</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-4 gap-4 min-w-[1200px]">
            <BoardColumn
              status="todo"
              title="To Do"
              tasks={tasksByStatus.todo}
              color="bg-gray-400"
              onOpenTaskDetails={onOpenTaskDetails}
              onAddTask={handleAddTask}
            />
            <BoardColumn
              status="in_progress"
              title="In Progress"
              tasks={tasksByStatus.in_progress}
              color="bg-blue-400"
              onOpenTaskDetails={onOpenTaskDetails}
              onAddTask={handleAddTask}
            />
            <BoardColumn
              status="review"
              title="Review"
              tasks={tasksByStatus.review}
              color="bg-purple-400"
              onOpenTaskDetails={onOpenTaskDetails}
              onAddTask={handleAddTask}
            />
            <BoardColumn
              status="completed"
              title="Completed"
              tasks={tasksByStatus.completed}
              color="bg-green-400"
              onOpenTaskDetails={onOpenTaskDetails}
              onAddTask={handleAddTask}
            />
          </div>
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} onOpenDetails={() => {}} /> : null}
        </DragOverlay>
      </section>
    </DndContext>
  );
}
