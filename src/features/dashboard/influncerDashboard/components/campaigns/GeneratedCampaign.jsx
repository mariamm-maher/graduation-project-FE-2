import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles, Target, DollarSign, Calendar, Users, TrendingUp, Clock, PieChart, BarChart3, CheckCircle } from 'lucide-react';

function GeneratedCampaign() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from navigation state
  const { campaign, aiPreview } = location.state || {};
  
  // If no data provided, show error or redirect
  if (!campaign || !aiPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0728] via-[#1a0f2e] to-[#0F0728] flex items-center justify-center p-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-4">No Campaign Data</h2>
          <p className="text-gray-400 mb-6">Please create a campaign first</p>
          <button 
            onClick={() => navigate('/dashboard/campaigns/create')}
            className="px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Create Campaign
          </button>
        </div>
      </div>
    );
  }

  // Extract strategy and execution data
  const { strategy, execution, estimations } = aiPreview;
  const campaignDuration = Math.ceil(
    (new Date(campaign.endDate || aiPreview.generatedAt) - new Date(campaign.startDate || aiPreview.generatedAt)) / (1000 * 60 * 60 * 24)
  );

  const handleBack = () => {
    navigate('/dashboard/campaigns/create');
  };

  const handleSaveCampaign = () => {
    // Handle save logic
    console.log('Saving campaign...');
  };

  const handleStartCampaign = () => {
    // Handle start campaign logic
    console.log('Starting campaign...');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-7xl mx-auto space-y-6 p-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl shadow-2xl shadow-purple-500/10 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="text-gray-400 hover:text-[#C1B6FD] transition-all p-2.5 hover:bg-[#745CB4]/10 rounded-xl border border-transparent hover:border-[#C1B6FD]/30"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
        
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-6 h-6 text-[#C1B6FD]" />
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-[#C1B6FD] to-white bg-clip-text text-transparent">AI-Generated Campaign</h1>
              </div>
              <p className="text-sm text-gray-400">Review and launch your optimized campaign strategy</p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveCampaign}
              className="flex-1 sm:flex-none px-5 py-3 bg-white/5 border border-white/20 rounded-xl text-white font-medium hover:bg-white/10 hover:border-[#C1B6FD]/40 transition-all"
            >
              Save Draft
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(193, 182, 253, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartCampaign}
              className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-xl text-white font-semibold shadow-lg shadow-[#745CB4]/40 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Launch Campaign
            </motion.button>
          </div>
        </div>
      </div>

      {/* Campaign Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Name & Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#745CB4]/10 via-transparent to-[#C1B6FD]/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6 shadow-lg shadow-purple-500/5"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#745CB4] to-[#C1B6FD] flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{campaign.campaignName}</h2>
                <p className="text-gray-300 leading-relaxed">{strategy.campaignSummary}</p>
              </div>
            </div>
          </motion.div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-[#C1B6FD]/40 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[#745CB4]/20 group-hover:bg-[#745CB4]/30 transition-all">
                  <Target className="w-5 h-5 text-[#C1B6FD]" />
                </div>
                <h3 className="font-medium text-gray-400 text-sm">Campaign Goal</h3>
              </div>
              <p className="text-white text-xl font-bold capitalize">{campaign.goalType?.replace('_', ' ')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-[#C1B6FD]/40 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-all">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-medium text-gray-400 text-sm">Total Budget</h3>
              </div>
              <p className="text-white text-2xl font-bold">{strategy.budgetAllocation.totalAllocated.toLocaleString()} <span className="text-emerald-400">{campaign.currency}</span></p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-[#C1B6FD]/40 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-all">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-medium text-gray-400 text-sm">Duration</h3>
              </div>
              <p className="text-white text-xl font-bold">{campaignDuration} <span className="text-blue-400">days</span></p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-[#C1B6FD]/40 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-amber-500/20 group-hover:bg-amber-500/30 transition-all">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="font-medium text-gray-400 text-sm">Status</h3>
              </div>
              <p className="text-white text-xl font-bold capitalize"><span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-2"></span>{campaign.status}</p>
            </motion.div>
          </div>

          {/* Platform Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6 shadow-lg shadow-purple-500/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#745CB4]/20">
                <Target className="w-5 h-5 text-[#C1B6FD]" />
              </div>
              <h3 className="text-xl font-bold text-white">Platform Selection</h3>
            </div>
            <div className="space-y-3">
              {strategy.platformSelection?.map((platform, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl p-4 hover:border-[#C1B6FD]/40 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-bold text-lg">{platform.platform}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      platform.priority === 'primary' 
                        ? 'bg-[#C1B6FD]/20 text-[#C1B6FD]' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {platform.priority}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{platform.rationale}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Audience Match:</span>
                    <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-full"
                        style={{ width: `${platform.audienceMatchScore}%` }}
                      />
                    </div>
                    <span className="text-[#C1B6FD] font-bold text-sm">{platform.audienceMatchScore}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Budget Allocation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6 shadow-lg shadow-purple-500/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <PieChart className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Budget Allocation</h3>
            </div>
            <div className="space-y-4">
              {strategy.budgetAllocation?.breakdown?.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-200 font-semibold capitalize">{item.category.replace('_', ' ')}</span>
                    <span className="text-white font-bold">{item.amount.toFixed(2)} {campaign.currency} <span className="text-emerald-400">({item.percentage}%)</span></span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-full"
                    />
                  </div>
                </div>
              )) || <p className="text-gray-400 text-sm">No budget allocation data available</p>}
            </div>

            {/* Platform Ad Split */}
            {strategy.budgetAllocation?.breakdown?.find(b => b.category === 'paid_ads')?.platforms && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Platform Ad Spend Distribution
                </h4>
                <div className="space-y-3">
                  {strategy.budgetAllocation.breakdown
                    .find(b => b.category === 'paid_ads')
                    ?.platforms?.map((platform, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/5 hover:border-emerald-500/30 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{platform.platform}</span>
                        <div className="text-right">
                          <div className="text-white font-bold">{platform.amount.toFixed(2)} {campaign.currency}</div>
                          <div className="text-emerald-400 text-xs">{platform.dailyBudget.toFixed(2)} {campaign.currency}/day</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Content Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6 shadow-lg shadow-purple-500/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Content Calendar</h3>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {execution.contentCalendar?.slice(0, 7).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="flex gap-4 p-4 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 hover:border-[#C1B6FD]/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all group"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-[#745CB4] to-[#C1B6FD] flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all">
                    <div className="text-center">
                      <div className="text-[10px] text-white/70 font-medium">Day</div>
                      <div className="text-xl font-bold text-white">{item.day}</div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <h4 className="font-bold text-white capitalize">{item.contentType}</h4>
                      <span className="text-xs px-2.5 py-1 bg-[#745CB4]/20 text-[#C1B6FD] rounded-full font-medium border border-[#C1B6FD]/20">{item.platform}</span>
                      <span className="text-xs px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-full font-medium border border-emerald-500/20 capitalize">{item.status}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2 line-clamp-2">{item.caption}</p>
                    <p className="text-xs text-gray-500">{item.task}</p>
                  </div>
                </motion.div>
              )) || <p className="text-gray-400 text-sm">No content calendar available</p>}
              {execution.contentCalendar?.length > 7 && (
                <div className="text-center pt-2">
                  <span className="text-sm text-gray-400">+ {execution.contentCalendar.length - 7} more days</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar - KPIs & Estimations */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6 shadow-lg shadow-purple-500/5 sticky top-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#745CB4]/20">
                <BarChart3 className="w-5 h-5 text-[#C1B6FD]" />
              </div>
              <h3 className="text-xl font-bold text-white">Estimated Results</h3>
            </div>
            {estimations?.estimatedResults && (
              <>
                <div className="mb-6 p-4 bg-gradient-to-br from-[#745CB4]/10 to-[#C1B6FD]/5 rounded-xl border border-[#C1B6FD]/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Scenario Type</span>
                    <span className="text-white font-bold capitalize px-3 py-1 bg-white/10 rounded-full text-sm">{estimations.estimatedResults.scenario}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Confidence Level</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-white/10 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-full"
                          style={{ width: `${estimations.estimatedResults.confidenceLevel}%` }}
                        />
                      </div>
                      <span className="text-[#C1B6FD] font-bold text-sm">{estimations.estimatedResults.confidenceLevel}%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {estimations.estimatedResults.metrics?.map((metric, index) => {
                    const colors = [
                      { icon: 'from-blue-500/20 to-blue-400/10', text: 'text-blue-400', border: 'border-blue-500/20' },
                      { icon: 'from-purple-500/20 to-purple-400/10', text: 'text-purple-400', border: 'border-purple-500/20' },
                      { icon: 'from-emerald-500/20 to-emerald-400/10', text: 'text-emerald-400', border: 'border-emerald-500/20' }
                    ];
                    const color = colors[index % colors.length];
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`p-4 bg-gradient-to-br from-white/5 to-transparent rounded-xl border ${color.border} hover:shadow-lg transition-all`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color.icon} flex items-center justify-center`}>
                            <TrendingUp className={`w-5 h-5 ${color.text}`} />
                          </div>
                          <span className="text-sm font-bold text-gray-300 capitalize">{metric.metric}</span>
                        </div>
                        <div className="ml-1">
                          <p className={`text-2xl font-bold ${color.text}`}>{metric.estimatedRange.mostLikely.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Range: <span className="text-gray-400">{metric.estimatedRange.min.toLocaleString()}</span> - <span className="text-gray-400">{metric.estimatedRange.max.toLocaleString()}</span>
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(193, 182, 253, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3.5 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-xl text-white font-bold shadow-lg shadow-[#745CB4]/30 transition-all"
              >
                Export as PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white font-medium hover:bg-white/10 hover:border-[#C1B6FD]/30 transition-all"
              >
                Share with Team
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default GeneratedCampaign;
