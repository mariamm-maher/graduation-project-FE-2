import { CheckCircle2, Clock, AlertCircle, Instagram, Youtube, ListTodo, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

function CollaborationCard({ collab }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return { 
          label: 'Completed', 
          icon: CheckCircle2, 
          color: 'text-green-400', 
          bg: 'bg-green-500/20',
          border: 'border-green-500/30'
        };
      case 'in-progress':
        return { 
          label: 'In Progress', 
          icon: Clock, 
          color: 'text-blue-400', 
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/30'
        };
      case 'pending':
        return { 
          label: 'Pending', 
          icon: AlertCircle, 
          color: 'text-yellow-400', 
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/30'
        };
      default:
        return { 
          label: status, 
          icon: Clock, 
          color: 'text-gray-400', 
          bg: 'bg-gray-500/20',
          border: 'border-gray-500/30'
        };
    }
  };

  const getPlatformIcon = (platform) => {
    if (platform === 'instagram') return <Instagram className="w-4 h-4 text-pink-400" />;
    if (platform === 'youtube') return <Youtube className="w-4 h-4 text-red-400" />;
    return null;
  };

  const statusConfig = getStatusConfig(collab.status);
  const StatusIcon = statusConfig.icon;
  const completedTasks = collab.currentTasks.filter(t => t.completed).length;
  const totalTasks = collab.currentTasks.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all group"
    >
      {/* Card Header */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-start gap-4 mb-4">
          {/* Influencer Avatar */}
          <div className="relative">
            {collab.influencerImage ? (
              <img 
                src={collab.influencerImage} 
                alt={collab.influencerName}
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-white/10"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center font-bold text-white">
                {collab.influencerAvatar}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1">
              {getPlatformIcon(collab.platform)}
            </div>
          </div>

          {/* Influencer & Campaign Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white truncate">{collab.influencerName}</h3>
            <p className="text-sm text-gray-400 truncate mb-2">{collab.campaignName}</p>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.border} border`}>
              <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
              <span className={statusConfig.color}>{statusConfig.label}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="font-semibold text-white">{collab.progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${collab.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD]"
            />
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-white">Tasks</span>
          </div>
          <span className="text-xs text-gray-400">{completedTasks}/{totalTasks}</span>
        </div>
        
        <div className="space-y-2">
          {collab.currentTasks.slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                task.completed 
                  ? 'bg-green-500/20 border border-green-500/50' 
                  : 'bg-white/5 border border-white/10'
              }`}>
                {task.completed && <CheckCircle2 className="w-3 h-3 text-green-400" />}
              </div>
              <span className={`text-xs truncate ${
                task.completed ? 'text-gray-500 line-through' : 'text-gray-300'
              }`}>
                {task.title}
              </span>
            </div>
          ))}
          {totalTasks > 3 && (
            <p className="text-xs text-gray-500 pl-6">+{totalTasks - 3} more tasks</p>
          )}
        </div>

        {/* Meta Info */}
        <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-gray-500">Budget</p>
            <p className="font-semibold text-[#C1B6FD]">{collab.budget}</p>
          </div>
          <div>
            <p className="text-gray-500">Deadline</p>
            <p className="font-semibold text-white">{new Date(collab.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-white/10 bg-white/5 grid grid-cols-2 gap-2">
        <button className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-all flex items-center justify-center gap-1.5">
          <ListTodo className="w-3.5 h-3.5" />
          Tasks
        </button>
        <button className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-all flex items-center justify-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          Contract
        </button>
      </div>

      {/* Last Activity */}
      <div className="px-4 pb-3">
        <p className="text-xs text-gray-500">Last activity: {collab.lastActivity}</p>
      </div>
    </motion.div>
  );
}

export default CollaborationCard;
