import { X, User, Calendar, Paperclip, MessageSquare, Eye, Edit3, Trash2 } from 'lucide-react';

function TaskDetailsModal({ task, onClose }) {
  if (!task) return null;

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
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'completed' || status === 'cancelled') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a2e] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{task.taskName}</h2>
                <span className={`text-xs px-3 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority} priority
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Created {formatDate(task.createdAt)}</span>
                <span>•</span>
                <span className="capitalize">in {task.status.replace('_', ' ')}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Task Details */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
              <p className="text-gray-400">{task.description}</p>
            </div>

            {/* Meta Information Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Assigned To</h3>
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-sm text-white font-semibold">
                    {task.assignedToName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-white">{task.assignedToName}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Due Date</h3>
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    isOverdue(task.dueDate, task.status) ? 'bg-red-500/20' : 'bg-white/5'
                  }`}
                >
                  <Calendar
                    className={`w-4 h-4 ${
                      isOverdue(task.dueDate, task.status) ? 'text-red-400' : 'text-purple-400'
                    }`}
                  />
                  <span className={isOverdue(task.dueDate, task.status) ? 'text-red-400' : 'text-white'}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Progress */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Status</h3>
              <div className="flex items-center gap-2">
                {['todo', 'in_progress', 'review', 'completed'].map((status, index) => (
                  <div
                    key={status}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      ['todo', 'in_progress', 'review', 'completed'].indexOf(task.status) >= index
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                        : 'bg-white/10'
                    }`}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>To Do</span>
                <span>In Progress</span>
                <span>Review</span>
                <span>Completed</span>
              </div>
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments & Comments Count */}
            <div className="flex gap-6 p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400">
                <Paperclip className="w-4 h-4" />
                <span className="text-sm">{task.attachments || 0} attachments</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">{task.comments || 0} comments</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{task.watchers || 0} watchers</span>
              </div>
            </div>

            {/* Completion Info */}
            {task.completedAt && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">Completed on {formatDate(task.completedAt)}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button className="flex-1 px-4 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit Task
              </button>
              <button className="px-4 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Comment
              </button>
              <button className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsModal;
