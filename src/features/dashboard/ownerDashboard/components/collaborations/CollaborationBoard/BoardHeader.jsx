import { Search, Filter, ChevronDown, Plus, History } from 'lucide-react';

function BoardHeader({ 
  searchQuery, 
  onSearchChange, 
  showFilters, 
  onToggleFilters,
  showActivityPanel,
  onToggleActivity,
  filterAssignee,
  onAssigneeChange,
  filterPriority,
  onPriorityChange,
  onAddTask 
}) {
  return (
    <div className="space-y-4">
      {/* Title and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Collaboration Boards</h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Kanban-style task management with real-time collaboration
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={onToggleActivity}
            className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 ${
              showActivityPanel
                ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white'
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <History className="w-5 h-5" />
            <span className="hidden sm:inline">Activity</span>
          </button>
          <button
            onClick={onAddTask}
            className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          onClick={onToggleFilters}
          className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
            showFilters
              ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white'
              : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
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
                onChange={(e) => onAssigneeChange(e.target.value)}
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
                onChange={(e) => onPriorityChange(e.target.value)}
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
    </div>
  );
}

export default BoardHeader;
