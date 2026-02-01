import { Clock, AlertCircle, CheckCircle2, MessageSquare } from 'lucide-react';

function StatsOverview({ collaborations }) {
  const inProgressCount = collaborations.filter(c => c.status === 'in-progress').length;
  const pendingCount = collaborations.filter(c => c.status === 'pending').length;
  const completedCount = collaborations.filter(c => c.status === 'completed').length;
  const unreadMessagesCount = collaborations.reduce((sum, c) => sum + c.unreadMessages, 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{inProgressCount}</p>
            <p className="text-xs text-gray-400">In Progress</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{pendingCount}</p>
            <p className="text-xs text-gray-400">Pending</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{completedCount}</p>
            <p className="text-xs text-gray-400">Completed</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{unreadMessagesCount}</p>
            <p className="text-xs text-gray-400">Unread Messages</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsOverview;
