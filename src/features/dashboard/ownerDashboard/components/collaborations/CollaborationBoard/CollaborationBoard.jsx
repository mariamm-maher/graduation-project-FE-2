import { Search, Plus, MoreVertical, User, Calendar, CheckCircle, Clock, AlertCircle, X, Tag, MessageSquare, Paperclip, Users, TrendingUp, Filter, ChevronDown, Bell, History, Eye, Edit3 } from 'lucide-react';
import { useState } from 'react';

function CollaborationBoard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showActivityPanel, setShowActivityPanel] = useState(false);

  // Enhanced mock data with priorities, tags, attachments, and comments
  const boards = [
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
          id: 1,
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
          id: 2,
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
          id: 3,
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
          id: 4,
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
          id: 5,
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
          id: 6,
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
          id: 7,
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
  ];

  // Activity timeline data
  const activities = [
    { id: 1, type: 'status_change', user: 'Sarah Johnson', action: 'moved "Create product photos" to Completed', time: '2 hours ago', taskId: 1 },
    { id: 2, type: 'comment', user: 'You', action: 'commented on "Review brand guidelines"', time: '4 hours ago', taskId: 3 },
    { id: 3, type: 'assigned', user: 'You', action: 'assigned "Write Instagram captions" to Sarah Johnson', time: '1 day ago', taskId: 2 },
    { id: 4, type: 'created', user: 'You', action: 'created "Schedule posts"', time: '2 days ago', taskId: 4 },
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
    cancelled: filteredTasks.filter(t => t.status === 'cancelled')
  };

  const getStatusColor = (status) => {
    const colors = {
      todo: 'bg-gray-500/20 border-gray-500/30',
      in_progress: 'bg-blue-500/20 border-blue-500/30',
      review: 'bg-purple-500/20 border-purple-500/30',
      completed: 'bg-green-500/20 border-green-500/30',
      cancelled: 'bg-red-500/20 border-red-500/30'
    };
    return colors[status] || '';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-400 bg-red-500/20',
      medium: 'text-yellow-400 bg-yellow-500/20',
      low: 'text-green-400 bg-green-500/20'
    };
    return colors[priority] || '';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'completed' || status === 'cancelled') return false;
    return new Date(dueDate) < new Date();
  };

  // Drag and drop handlers
  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (newStatus) => {
    if (draggedTask) {
      // Here you would update the task status in your state management
      console.log(`Moving task ${draggedTask.id} to ${newStatus}`);
      setDraggedTask(null);
    }
  };

  const openTaskDetails = (task) => {
    setSelectedTask(task);
  };

  const closeTaskDetails = () => {
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Collaboration Boards</h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Kanban-style task management with real-time collaboration
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setShowActivityPanel(!showActivityPanel)}
            className="px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <History className="w-5 h-5" />
            <span className="hidden sm:inline">Activity</span>
          </button>
          <button className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
            showFilters ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white' : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
          }`}
        >
          <Filter className="w-5 h-5" />
          Filters
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Assignee</label>
              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Assignees</option>
                <option value="1">You (Owner)</option>
                <option value="2">Sarah Johnson</option>
                <option value="6">Alex Rivera</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>
        </div>
      )}

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
              <span>{Math.round((tasksByStatus.completed.length / filteredTasks.length) * 100)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] transition-all duration-500"
                style={{ width: `${(tasksByStatus.completed.length / filteredTasks.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Kanban Board */}
        <div className={`${showActivityPanel ? 'lg:col-span-3' : 'lg:col-span-4'} grid grid-cols-1 md:grid-cols-2 ${showActivityPanel ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4`}>
          {/* To Do Column */}
          <div
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('todo')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <h3 className="font-semibold text-white">To Do</h3>
                <span className="text-xs text-gray-400">({tasksByStatus.todo.length})</span>
              </div>
              <button className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all">
                <Plus className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              {tasksByStatus.todo.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  onClick={() => openTaskDetails(task)}
                  className={`p-4 rounded-xl border-2 ${getStatusColor(task.status)} hover:border-gray-400 transition-all cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white text-sm flex-1">{task.taskName}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {task.comments > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{task.comments}</span>
                        </div>
                      )}
                      {task.attachments > 0 && (
                        <div className="flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          <span>{task.attachments}</span>
                        </div>
                      )}
                    </div>
                    {task.dueDate && (
                      <div className={`flex items-center gap-1 text-xs ${isOverdue(task.dueDate, task.status) ? 'text-red-400' : 'text-gray-400'}`}>
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('in_progress')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <h3 className="font-semibold text-white">In Progress</h3>
                <span className="text-xs text-gray-400">({tasksByStatus.in_progress.length})</span>
              </div>
            </div>
            <div className="space-y-3">
              {tasksByStatus.in_progress.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  onClick={() => openTaskDetails(task)}
                  className={`p-4 rounded-xl border-2 ${getStatusColor(task.status)} hover:border-blue-400 transition-all cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white text-sm flex-1">{task.taskName}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {task.comments > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{task.comments}</span>
                        </div>
                      )}
                      {task.attachments > 0 && (
                        <div className="flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          <span>{task.attachments}</span>
                        </div>
                      )}
                    </div>
                    {task.dueDate && (
                      <div className={`flex items-center gap-1 text-xs ${isOverdue(task.dueDate, task.status) ? 'text-red-400' : 'text-gray-400'}`}>
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Column */}
          <div
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('review')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <h3 className="font-semibold text-white">Review</h3>
                <span className="text-xs text-gray-400">({tasksByStatus.review.length})</span>
              </div>
            </div>
            <div className="space-y-3">
              {tasksByStatus.review.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  onClick={() => openTaskDetails(task)}
                  className={`p-4 rounded-xl border-2 ${getStatusColor(task.status)} hover:border-purple-400 transition-all cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white text-sm flex-1">{task.taskName}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {task.comments > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{task.comments}</span>
                        </div>
                      )}
                      {task.attachments > 0 && (
                        <div className="flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          <span>{task.attachments}</span>
                        </div>
                      )}
                    </div>
                    {task.dueDate && (
                      <div className={`flex items-center gap-1 text-xs ${isOverdue(task.dueDate, task.status) ? 'text-red-400' : 'text-gray-400'}`}>
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Column */}
          <div
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('completed')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <h3 className="font-semibold text-white">Completed</h3>
                <span className="text-xs text-gray-400">({tasksByStatus.completed.length})</span>
              </div>
            </div>
            <div className="space-y-3">
              {tasksByStatus.completed.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  onClick={() => openTaskDetails(task)}
                  className={`p-4 rounded-xl border-2 ${getStatusColor(task.status)} hover:border-green-400 transition-all cursor-pointer opacity-75`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white text-sm flex-1 line-through">{task.taskName}</h4>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2 line-through">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {task.comments > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{task.comments}</span>
                        </div>
                      )}
                    </div>
                    {task.completedAt && (
                      <div className="flex items-center gap-1 text-xs text-green-400">
                        <span>{formatDate(task.completedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Panel */}
        {showActivityPanel && (
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 sticky top-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-purple-400" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-gray-400"> {activity.action}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeTaskDetails}>
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">{selectedTask.taskName}</h2>
                    <span className={`text-xs px-3 py-1 rounded-full ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority} priority
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Created {formatDate(selectedTask.createdAt)}</span>
                    <span>•</span>
                    <span>in {selectedTask.status.replace('_', ' ')}</span>
                  </div>
                </div>
                <button onClick={closeTaskDetails} className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Task Details */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
                  <p className="text-gray-400">{selectedTask.description}</p>
                </div>

                {/* Meta Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Assigned To</h3>
                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                      <User className="w-4 h-4 text-purple-400" />
                      <span className="text-white">{selectedTask.assignedToName}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Due Date</h3>
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${isOverdue(selectedTask.dueDate, selectedTask.status) ? 'bg-red-500/20' : 'bg-white/5'}`}>
                      <Calendar className={`w-4 h-4 ${isOverdue(selectedTask.dueDate, selectedTask.status) ? 'text-red-400' : 'text-purple-400'}`} />
                      <span className={isOverdue(selectedTask.dueDate, selectedTask.status) ? 'text-red-400' : 'text-white'}>
                        {formatDate(selectedTask.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Attachments & Comments Count */}
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Paperclip className="w-4 h-4" />
                    <span className="text-sm">{selectedTask.attachments} attachments</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">{selectedTask.comments} comments</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{selectedTask.watchers} watchers</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button className="flex-1 px-4 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    Edit Task
                  </button>
                  <button className="px-4 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Add Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollaborationBoard;