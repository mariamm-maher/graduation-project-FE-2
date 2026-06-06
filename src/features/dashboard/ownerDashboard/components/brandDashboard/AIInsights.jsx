import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';

function AIInsights({ insights, recommendations, loading, isInsightsLoading }) {
  const getInsightIcon = (type) => {
    const icons = {
      positive: CheckCircle,
      negative: AlertCircle,
      neutral: TrendingUp,
    };
    return icons[type] || TrendingUp;
  };

  const getInsightColor = (type) => {
    const colors = {
      positive: 'border-l-green-500 bg-green-500/5',
      negative: 'border-l-red-500 bg-red-500/5',
      neutral: 'border-l-[#C1B6FD] bg-[#C1B6FD]/5',
    };
    return colors[type] || colors.neutral;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return colors[priority?.toLowerCase()] || colors.low;
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-5 h-5 text-[#C1B6FD]" />
        </motion.div>
        <h3 className="text-lg font-semibold text-white">AI Insights</h3>
      </div>

      {isInsightsLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C1B6FD] mb-3" />
          <p className="text-gray-400 text-sm">Generating insights...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Insights Section */}
          {insights?.length > 0 && (
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Insights</p>
              <div className="space-y-3">
                {insights.map((insight) => {
                  const Icon = getInsightIcon(insight.type);
                  return (
                    <div
                      key={insight.id}
                      className={`p-3 rounded-lg border-l-4 ${getInsightColor(insight.type)}`}
                    >
                      <div className="flex items-start gap-2">
                        <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-white text-sm">{insight.message}</p>
                          {insight.metric && (
                            <p className="text-gray-400 text-xs mt-1">
                              {insight.metric} ({insight.change})
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommendations Section */}
          {recommendations?.length > 0 && (
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Recommendations</p>
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-white text-sm">{rec.action}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                    </div>
                    {rec.impact && (
                      <p className="text-gray-400 text-xs mt-1">Expected impact: {rec.impact}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!insights?.length && !recommendations?.length && (
            <p className="text-gray-400 text-sm text-center py-4">No insights available</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AIInsights;
