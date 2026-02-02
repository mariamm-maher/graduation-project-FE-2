import { useState } from 'react';
import { User, CheckCircle, Clock, AlertCircle, TrendingUp, MessageSquare, Calendar as CalendarIcon, DollarSign, LayoutGrid } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import BoardHeader from './BoardHeader';
import BoardColumn from './BoardColumn';
import TaskCard from './TaskCard';
import TaskDetailsModal from './TaskDetailsModal';
import ActivityPanel from './ActivityPanel';
import CollaborationChat from './CollaborationChat';
import CalendarView from './CalendarView';
import ContractPayments from './ContractPayments';

function CollaborationBoard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showActivityPanel, setShowActivityPanel] = useState(false);
  const [activeView, setActiveView] = useState('board'); // 'board', 'chat', 'calendar', 'payments'

  // Sensors for drag and drop
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

  // Enhanced mock data
  const [boards, setBoards] = useState([
    {
      id: 1,
      collaborationId: 1,
      campaignName: 'Summer Fashion Launch',
      influencerName: 'Sarah Johnson',
      name: 'Content Production Board',
      description: 'Track all content creation tasks',
      createdAt: '2026-01-15T09:00:00',
      tasks: [
        {
          id: 'task-1',
          boardId: 1,
          taskName: 'Create product photos',
          description: 'Shoot 10 product photos with summer theme',
          status: 'completed',
          priority: 'high',
          assignedTo: 2,
          assignedToName: 'Sarah Johnson',
          dueDate: '2026-01-20',
          completedAt: '2026-01-19',
          createdAt: '2026-01-15T10:00:00',
          tags: ['photography', 'urgent'],
          attachments: 3,
          comments: 5,
          watchers: 2
        },
        {
          id: 'task-2',
          boardId: 1,
          taskName: 'Write Instagram captions',
          description: 'Create engaging captions for 5 posts',
          status: 'in_progress',
          priority: 'medium',
          assignedTo: 2,
          assignedToName: 'Sarah Johnson',
          dueDate: '2026-02-05',
          completedAt: null,
          createdAt: '2026-01-15T10:15:00',
          tags: ['content', 'copywriting'],
          attachments: 1,
          comments: 3,
          watchers: 1
        },
        {
          id: 'task-3',
          boardId: 1,
          taskName: 'Review brand guidelines',
          description: 'Ensure all content aligns with brand voice',
          status: 'review',
          priority: 'high',
          assignedTo: 1,
          assignedToName: 'You (Owner)',
          dueDate: '2026-02-03',
          completedAt: null,
          createdAt: '2026-01-15T10:30:00',
          tags: ['review', 'brand'],
          attachments: 2,
          comments: 7,
          watchers: 3
        },
        {
          id: 'task-4',
          boardId: 1,
          taskName: 'Schedule posts',
          description: 'Plan posting schedule for next 2 weeks',
          status: 'todo',
          priority: 'low',
          assignedTo: 2,
          assignedToName: 'Sarah Johnson',
          dueDate: '2026-02-10',
          completedAt: null,
          createdAt: '2026-01-15T10:45:00',
          tags: ['scheduling'],
          attachments: 0,
          comments: 1,
          watchers: 1
        },
        {
          id: 'task-5',
          boardId: 1,
          taskName: 'Edit product videos',
          description: 'Color grade and add transitions to product showcase videos',
          status: 'todo',
          priority: 'high',
          assignedTo: 2,
          assignedToName: 'Sarah Johnson',
          dueDate: '2026-02-08',
          completedAt: null,
          createdAt: '2026-01-16T09:00:00',
          tags: ['video', 'editing'],
          attachments: 0,
          comments: 2,
          watchers: 2
        }
      ]
    },
    {
      id: 2,
      collaborationId: 5,
      campaignName: 'Tech Product Launch Q1',
      influencerName: 'Alex Rivera',
      name: 'Product Review Tasks',
      description: 'Tasks for tech product review campaign',
      createdAt: '2026-01-20T10:30:00',
      tasks: [
        {
          id: 'task-6',
          boardId: 2,
          taskName: 'Unbox product and initial testing',
          description: 'Document unboxing experience and first impressions',
          status: 'completed',
          priority: 'high',
          assignedTo: 6,
          assignedToName: 'Alex Rivera',
          dueDate: '2026-01-25',
          completedAt: '2026-01-24',
          createdAt: '2026-01-20T11:00:00',
          tags: ['video', 'testing'],
          attachments: 5,
          comments: 4,
          watchers: 2
        },
        {
          id: 'task-7',
          boardId: 2,
          taskName: 'Film review video',
          description: 'Create comprehensive 10-minute review',
          status: 'in_progress',
          priority: 'high',
          assignedTo: 6,
          assignedToName: 'Alex Rivera',
          dueDate: '2026-02-08',
          completedAt: null,
          createdAt: '2026-01-20T11:15:00',
          tags: ['video', 'editing'],
          attachments: 2,
          comments: 8,
          watchers: 3
        },
        {
          id: 'task-8',
          boardId: 2,
          taskName: 'Edit video content',
          description: 'Add graphics, transitions, and color grading',
          status: 'todo',
          priority: 'medium',
          assignedTo: 6,
          assignedToName: 'Alex Rivera',
          dueDate: '2026-02-12',
          completedAt: null,
          createdAt: '2026-01-20T11:30:00',
          tags: ['video', 'post-production'],
          attachments: 0,
          comments: 2,
          watchers: 2
        }
      ]
    }
  ]);

  // Activity timeline data
  const activities = [
    { id: 1, type: 'status_change', user: 'Sarah Johnson', action: 'moved "Create product photos" to Completed', time: '2 hours ago', taskId: 'task-1' },
    { id: 2, type: 'comment', user: 'You', action: 'commented on "Review brand guidelines"', time: '4 hours ago', taskId: 'task-3' },
    { id: 3, type: 'assigned', user: 'You', action: 'assigned "Write Instagram captions" to Sarah Johnson', time: '1 day ago', taskId: 'task-2' },
    { id: 4, type: 'created', user: 'You', action: 'created "Schedule posts"', time: '2 days ago', taskId: 'task-4' },
  ];

  const activeBoard = selectedBoard ? boards.find(b => b.id === selectedBoard) : boards[0];

  // Filter tasks
  const filteredTasks = activeBoard?.tasks.filter(task => {
    const matchesSearch = task.taskName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAssignee = filterAssignee === 'all' || task.assignedTo.toString() === filterAssignee;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesAssignee && matchesPriority;
  }) || [];

  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
    review: filteredTasks.filter(t => t.status === 'review'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
  };

  // Drag handlers
  const handleDragStart = (event) => {
    const { active } = event;
    const task = filteredTasks.find(t => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = filteredTasks.find(t => t.id === active.id);
    const overTask = filteredTasks.find(t => t.id === over.id);

    if (!activeTask) return;

    const activeStatus = activeTask.status;
    const overStatus = overTask ? overTask.status : over.id;

    if (activeStatus !== overStatus) {
      setBoards(boards.map(board => {
        if (board.id === activeBoard.id) {
          return {
            ...board,
            tasks: board.tasks.map(task => 
              task.id === active.id 
                ? { ...task, status: overStatus }
                : task
            )
          };
        }
        return board;
      }));
    }
  };

  const handleDragEnd = () => {
    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Header with Search and Filters */}
        <BoardHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          showActivityPanel={showActivityPanel}
          onToggleActivity={() => setShowActivityPanel(!showActivityPanel)}
          filterAssignee={filterAssignee}
          onAssigneeChange={setFilterAssignee}
          filterPriority={filterPriority}
          onPriorityChange={setFilterPriority}
          onAddTask={() => console.log('Add new task')}
        />

        {/* Board Selector */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {boards.map((board) => (
            <button
              key={board.id}
              onClick={() => setSelectedBoard(board.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all ${
                (selectedBoard === board.id || (!selectedBoard && board.id === boards[0].id))
                  ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <p className="font-semibold">{board.name}</p>
              <p className="text-xs opacity-80">{board.campaignName}</p>
            </button>
          ))}
        </div>

        {/* View Switcher - Business Collaboration Tabs */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1 inline-flex gap-1">
          <button
            onClick={() => setActiveView('board')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeView === 'board'
                ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="font-medium">Task Board</span>
          </button>
          <button
            onClick={() => setActiveView('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeView === 'chat'
                ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">Messages</span>
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeView === 'calendar'
                ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span className="font-medium">Calendar</span>
          </button>
          <button
            onClick={() => setActiveView('payments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeView === 'payments'
                ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">Contract & Payments</span>
          </button>
        </div>

        {/* Board Info with Progress */}
        {activeBoard && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">{activeBoard.name}</h2>
                <p className="text-sm text-gray-400">{activeBoard.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-400">{activeBoard.influencerName}</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>Overall Progress</span>
                <span>{Math.round((tasksByStatus.completed.length / filteredTasks.length) * 100) || 0}% Complete</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] transition-all duration-500"
                  style={{ width: `${(tasksByStatus.completed.length / filteredTasks.length) * 100 || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-400">{tasksByStatus.completed.length} completed</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">{tasksByStatus.in_progress.length} in progress</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400">{tasksByStatus.review.length} in review</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">{tasksByStatus.todo.length} to do</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area with Activity Panel */}
        {activeView === 'board' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Kanban Board */}
            <div className={`${showActivityPanel ? 'lg:col-span-3' : 'lg:col-span-4'} grid grid-cols-1 md:grid-cols-2 ${showActivityPanel ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4`}>
              <BoardColumn
                status="todo"
                title="To Do"
                tasks={tasksByStatus.todo}
                color="bg-gray-400"
                onOpenTaskDetails={setSelectedTask}
                onAddTask={(status) => console.log('Add task to', status)}
              />
              <BoardColumn
                status="in_progress"
                title="In Progress"
                tasks={tasksByStatus.in_progress}
                color="bg-blue-400"
                onOpenTaskDetails={setSelectedTask}
              />
              <BoardColumn
                status="review"
                title="Review"
                tasks={tasksByStatus.review}
                color="bg-purple-400"
                onOpenTaskDetails={setSelectedTask}
              />
              <BoardColumn
                status="completed"
                title="Completed"
                tasks={tasksByStatus.completed}
                color="bg-green-400"
                onOpenTaskDetails={setSelectedTask}
              />
            </div>

            {/* Activity Panel */}
            {showActivityPanel && (
              <div className="lg:col-span-1">
                <ActivityPanel activities={activities} />
              </div>
            )}
          </div>
        )}

        {/* Chat View */}
        {activeView === 'chat' && (
          <CollaborationChat collaboration={activeBoard} />
        )}

        {/* Calendar View */}
        {activeView === 'calendar' && (
          <CalendarView tasks={activeBoard?.tasks || []} />
        )}

        {/* Contract & Payments View */}
        {activeView === 'payments' && (
          <ContractPayments collaboration={activeBoard} />
        )}

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 scale-105">
              <TaskCard task={activeTask} onOpenDetails={() => {}} />
            </div>
          ) : null}
        </DragOverlay>

        {/* Task Details Modal */}
        <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      </div>
    </DndContext>
  );
}

export default CollaborationBoard;
