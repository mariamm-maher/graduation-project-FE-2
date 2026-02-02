import { Calendar, MessageSquare, Paperclip, CheckCircle, Eye } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function TaskCard({ task, onOpenDetails }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-400 bg-red-500/20',
      medium: 'text-yellow-400 bg-yellow-500/20',
      low: 'text-green-400 bg-green-500/20'
    };
    return colors[priority] || '';
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

  const isCompleted = task.status === 'completed';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpenDetails(task)}
      className={`p-4 rounded-xl border-2 ${getStatusColor(task.status)} hover:border-opacity-50 transition-all cursor-pointer ${
        isCompleted ? 'opacity-75' : ''
      } ${isDragging ? 'shadow-2xl shadow-purple-500/50' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className={`font-semibold text-white text-sm flex-1 ${isCompleted ? 'line-through' : ''}`}>
          {task.taskName}
        </h4>
        {isCompleted ? (
          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
        ) : (
          <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        )}
      </div>
      
      <p className={`text-xs text-gray-400 mb-3 line-clamp-2 ${isCompleted ? 'line-through' : ''}`}>
        {task.description}
      </p>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">
              {tag}
            </span>
          ))}
          {task.tags.length > 2 && (
            <span className="px-2 py-0.5 bg-white/5 text-gray-400 rounded text-xs">
              +{task.tags.length - 2}
            </span>
          )}
        </div>
      )}

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
          {task.watchers > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{task.watchers}</span>
            </div>
          )}
        </div>
        {task.dueDate && (
          <div className={`flex items-center gap-1 text-xs ${
            isOverdue(task.dueDate, task.status) ? 'text-red-400' : 
            isCompleted ? 'text-green-400' : 'text-gray-400'
          }`}>
            <Calendar className="w-3 h-3" />
            <span>{isCompleted && task.completedAt ? formatDate(task.completedAt) : formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>

      {/* Assignee Avatar */}
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-xs text-white font-semibold">
          {task.assignedToName?.charAt(0) || 'U'}
        </div>
        <span className="text-xs text-gray-400">{task.assignedToName}</span>
      </div>
    </div>
  );
}

export default TaskCard;
