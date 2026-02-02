import { Plus } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

function BoardColumn({ status, title, tasks, color, onOpenTaskDetails, onAddTask }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const taskIds = tasks.map(task => task.id);

  return (
    <div
      ref={setNodeRef}
      className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 transition-all ${
        isOver ? 'ring-2 ring-purple-500/50 bg-white/10' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <h3 className="font-semibold text-white">{title}</h3>
          <span className="text-xs text-gray-400">({tasks.length})</span>
        </div>
        <button
          onClick={() => onAddTask?.(status)}
          className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all group"
        >
          <Plus className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Tasks List */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-[200px]">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onOpenDetails={onOpenTaskDetails}
            />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              <p>No tasks yet</p>
              <p className="text-xs mt-1">Drag tasks here or click + to add</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default BoardColumn;
