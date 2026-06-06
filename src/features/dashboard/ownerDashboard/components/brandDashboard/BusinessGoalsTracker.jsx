import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

function BusinessGoalsTracker({ goals, loading }) {
  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Business Goals</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/2 mb-2" />
              <div className="h-2 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Business Goals</h3>
      
      <div className="space-y-4">
        {goals?.length > 0 ? (
          goals.map((goal, index) => (
            <div key={goal.id || goal.name || index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#C1B6FD]" />
                  <span className="text-white font-medium">{goal.name || goal.title}</span>
                </div>
                <span className="text-gray-400 text-sm">
                  {goal.current || goal.progress} / {goal.target || goal.goal}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.percentage || goal.progressPercentage || 0}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD]"
                />
              </div>
              <div className="text-right">
                <span className="text-xs text-[#C1B6FD] font-medium">
                  {goal.percentage || goal.progressPercentage || 0}%
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm text-center py-4">No goals set</p>
        )}
      </div>
    </div>
  );
}

export default BusinessGoalsTracker;
