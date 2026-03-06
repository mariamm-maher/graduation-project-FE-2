import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowLeft, Sparkles, Target, DollarSign, Calendar, TrendingUp,
  Clock, PieChart, BarChart3, CheckCircle, Globe, FileText,
  BookOpen, Megaphone, Save, Rocket, ChevronDown, ChevronUp,
  Edit2, RefreshCw, PlusCircle, X,
} from 'lucide-react';
import useCampaignStore from '../../../../../../stores/campaignStore';

function GeneratedCampaign() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveDraftCampaign, saveCampaign, saveAndPublishCampaign, generateCampaignAI, isLoading } = useCampaignStore();
  const [showAllCalendar, setShowAllCalendar] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [editData, setEditData] = useState(null);

  // Get data from navigation state
  const { campaignData, aiPreview } = location.state || {};
  
  // If no data provided, show fallback
  if (!campaignData || !aiPreview) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center max-w-md">
          <Sparkles className="w-12 h-12 text-[#C1B6FD] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Generated Campaign</h2>
          <p className="text-gray-400 mb-6">Please fill in the campaign form and generate with AI first.</p>
          <button
            onClick={() => navigate('/dashboard/owner/campaigns/create')}
            className="px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Back to Create Campaign
          </button>
        </div>
      </div>
    );
  }

  const { strategy, execution, estimations, generatedAt } = aiPreview;
  const calendarItems = execution?.contentCalendar || [];
  const visibleCalendar = showAllCalendar ? calendarItems : calendarItems.slice(0, 7);

  const campaignDuration = (() => {
    const start = new Date(campaignData.startDate);
    const end = new Date(campaignData.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  })();

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // ── Edit / Regenerate helpers ──
  const handleEditToggle = () => {
    if (!isEditing) setEditData({ ...campaignData });
    setIsEditing(v => !v);
  };

  const handleRegenerate = async () => {
    const data = isEditing ? editData : campaignData;
    setIsEditing(false);
    setIsRegenerating(true);
    try {
      const result = await generateCampaignAI(data);
      if (result.success) {
        toast.success('Campaign regenerated!', { position: 'top-right', autoClose: 3000 });
        navigate('/dashboard/owner/campaigns/generated', {
          state: { campaignData: data, aiPreview: result.aiPreview },
          replace: true,
        });
      } else {
        toast.error(result.error || 'Failed to regenerate campaign', { position: 'top-right', autoClose: 4000 });
      }
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleNewCampaign = () => navigate('/dashboard/owner/campaigns/create');

  // ── Save helpers ──
  const buildPayload = (extra = {}) => ({
    campaignName: campaignData.campaignName,
    userDescription: campaignData.userDescription,
    goalType: campaignData.goalType,
    totalBudget: campaignData.totalBudget,
    currency: campaignData.currency,
    budgetFlexibility: campaignData.budgetFlexibility,
    startDate: campaignData.startDate,
    endDate: campaignData.endDate,
    targetAudience: {
      ageRange: campaignData.targetAudience?.ageRange || '',
      gender: campaignData.targetAudience?.gender || 'all',
      interests: campaignData.targetAudience?.interests || [],
      platformsUsed: strategy?.platformSelection?.map(p => p.platform.toLowerCase()) || [],
    },
    kpis: estimations?.estimatedResults?.metrics?.map(m => ({
      metric: m.metric,
      targetValue: String(m.estimatedRange?.mostLikely ?? ''),
    })) || [],
    contentCalendar: execution?.contentCalendar || [],
    aiVersion: {
      versionNumber: 1,
      strategy: strategy || {},
      execution: execution || {},
      estimations: estimations || {},
      isActive: true,
    },
    ...extra,
  });

  const handleSaveAsDraft = async () => {
    const result = await saveDraftCampaign(buildPayload({ lifecycleStage: 'draft' }));
    if (result.success) {
      toast.success('Campaign saved as draft!', { position: 'top-right', autoClose: 3000 });
      navigate('/dashboard/owner/campaigns/draft');
    } else {
      toast.error(result.error || 'Failed to save as draft', { position: 'top-right', autoClose: 4000 });
    }
  };

  const handleSave = async () => {
    const result = await saveCampaign(buildPayload());
    if (result.success) {
      toast.success('Campaign saved!', { position: 'top-right', autoClose: 3000 });
      navigate('/dashboard/owner/campaigns/all');
    } else {
      toast.error(result.error || 'Failed to save campaign', { position: 'top-right', autoClose: 4000 });
    }
  };

  const handleSaveAndPublish = async () => {
    const result = await saveAndPublishCampaign(buildPayload({ lifecycleStage: 'active' }));
    if (result.success) {
      toast.success('Campaign published to marketplace!', { position: 'top-right', autoClose: 3000 });
      navigate('/dashboard/owner/campaigns/active');
    } else {
      toast.error(result.error || 'Failed to publish campaign', { position: 'top-right', autoClose: 4000 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-6"
    >
      {/* ─── Top Header Bar ─── */}
      <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl shadow-2xl shadow-purple-500/10 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1, x: -4 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/dashboard/owner/campaigns/create')}
              className="text-gray-400 hover:text-[#C1B6FD] transition-all p-2.5 hover:bg-[#745CB4]/10 rounded-xl border border-transparent hover:border-[#C1B6FD]/30"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-6 h-6 text-[#C1B6FD]" />
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-[#C1B6FD] to-white bg-clip-text text-transparent">
                  AI-Generated Campaign
                </h1>
              </div>
              <p className="text-sm text-gray-400">
                Generated {generatedAt ? formatDate(generatedAt) : 'just now'} · Review your strategy below
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveAsDraft}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-white/20 rounded-xl text-white font-medium hover:bg-white/10 hover:border-[#C1B6FD]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BookOpen className="w-4 h-4" />
              Save as Draft
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-[#C1B6FD]/40 rounded-xl text-[#C1B6FD] font-semibold hover:bg-[#745CB4]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(193,182,253,0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveAndPublish}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-xl text-white font-bold shadow-lg shadow-[#745CB4]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Publishing...</>
              ) : (
                <><Rocket className="w-4 h-4" /> Save &amp; Publish</>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* ─── Input Summary / Edit Panel ─── */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <FileText className="w-5 h-5 text-[#C1B6FD]" />
            <h2 className="text-base font-bold text-white">Your Input</h2>
            {!isEditing && (
              <span className="text-xs px-2 py-0.5 bg-[#745CB4]/20 text-[#C1B6FD] rounded-full border border-[#C1B6FD]/20">
                AI used this to generate your strategy
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handleEditToggle}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:border-[#C1B6FD]/40 hover:text-[#C1B6FD] transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit &amp; Regenerate
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handleNewCampaign}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> New Campaign
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isRegenerating ? (
                    <><span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" /> Regenerating...</>
                  ) : (
                    <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handleEditToggle}
                  className="p-1.5 text-gray-400 hover:text-white bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Read-only summary */}
        {!isEditing && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Campaign Name', value: campaignData.campaignName },
              { label: 'Goal', value: campaignData.goalType?.replace('_', ' '), caps: true },
              { label: 'Budget', value: `${campaignData.currency} ${Number(campaignData.totalBudget).toLocaleString()}` },
              { label: 'Flexibility', value: campaignData.budgetFlexibility, caps: true },
              { label: 'Start Date', value: formatDate(campaignData.startDate) },
              { label: 'End Date', value: formatDate(campaignData.endDate) },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">{item.label}</p>
                <p className={`text-sm text-white font-semibold truncate ${item.caps ? 'capitalize' : ''}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Editable fields */}
        {isEditing && editData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Campaign Name</label>
              <input
                type="text"
                value={editData.campaignName}
                onChange={e => setEditData({ ...editData, campaignName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Goal Type</label>
              <select
                value={editData.goalType}
                onChange={e => setEditData({ ...editData, goalType: e.target.value })}
                className="w-full bg-[#1e1632] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
              >
                <option value="awareness">Awareness</option>
                <option value="consideration">Consideration</option>
                <option value="conversion">Conversion</option>
                <option value="lead_generation">Lead Generation</option>
                <option value="retention">Retention</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Total Budget</label>
              <input
                type="number"
                value={editData.totalBudget}
                onChange={e => setEditData({ ...editData, totalBudget: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Currency</label>
              <select
                value={editData.currency}
                onChange={e => setEditData({ ...editData, currency: e.target.value })}
                className="w-full bg-[#1e1632] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Start Date</label>
              <input
                type="date"
                value={editData.startDate?.split('T')[0]}
                onChange={e => setEditData({ ...editData, startDate: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">End Date</label>
              <input
                type="date"
                value={editData.endDate?.split('T')[0]}
                onChange={e => setEditData({ ...editData, endDate: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] transition-all"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <textarea
                value={editData.userDescription}
                onChange={e => setEditData({ ...editData, userDescription: e.target.value })}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] resize-none transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── Body ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left / Main ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Campaign Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#745CB4]/10 via-transparent to-[#C1B6FD]/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#745CB4] to-[#C1B6FD] flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{campaignData.campaignName}</h2>
                <p className="text-gray-300 leading-relaxed">{strategy?.campaignSummary}</p>
              </div>
            </div>
          </motion.div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Target className="w-5 h-5 text-[#C1B6FD]" />, bg: 'bg-[#745CB4]/20', label: 'Goal', value: campaignData.goalType?.replace('_', ' '), color: 'text-white' },
              { icon: <DollarSign className="w-5 h-5 text-emerald-400" />, bg: 'bg-emerald-500/20', label: 'Budget', value: `${campaignData.currency} ${Number(campaignData.totalBudget).toLocaleString()}`, color: 'text-emerald-400' },
              { icon: <Clock className="w-5 h-5 text-blue-400" />, bg: 'bg-blue-500/20', label: 'Duration', value: `${campaignDuration} days`, color: 'text-blue-400' },
              { icon: <Globe className="w-5 h-5 text-amber-400" />, bg: 'bg-amber-500/20', label: 'Platforms', value: `${strategy?.platformSelection?.length || 0} platforms`, color: 'text-amber-400' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-[#C1B6FD]/30 transition-all"
              >
                <div className={`p-2 rounded-lg ${item.bg} w-fit mb-3`}>{item.icon}</div>
                <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                <p className={`text-base font-bold capitalize ${item.color}`}>{item.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Platform Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-[#745CB4]/20"><Target className="w-5 h-5 text-[#C1B6FD]" /></div>
              <h3 className="text-xl font-bold text-white">Platform Selection</h3>
            </div>
            <div className="space-y-3">
              {strategy?.platformSelection?.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.08 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#C1B6FD]/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-bold text-lg">{p.platform}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.priority === 'primary' ? 'bg-[#C1B6FD]/20 text-[#C1B6FD]' : 'bg-blue-500/20 text-blue-400'}`}>
                      {p.priority}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{p.rationale}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 flex-shrink-0">Audience Match</span>
                    <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${p.audienceMatchScore}%` }} transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-full"
                      />
                    </div>
                    <span className="text-[#C1B6FD] font-bold text-sm">{p.audienceMatchScore}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Budget Allocation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-emerald-500/20"><PieChart className="w-5 h-5 text-emerald-400" /></div>
              <h3 className="text-xl font-bold text-white">Budget Allocation</h3>
              <span className="ml-auto text-sm text-emerald-400 font-semibold">
                Total: {strategy?.budgetAllocation?.totalAllocated?.toLocaleString()} {campaignData.currency}
              </span>
            </div>
            <div className="space-y-4">
              {strategy?.budgetAllocation?.breakdown?.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-gray-200 font-medium capitalize">{item.category.replace('_', ' ')}</span>
                    <span className="text-white font-bold text-sm">
                      {item.amount.toLocaleString()} {campaignData.currency}
                      <span className="text-emerald-400 ml-1">({item.percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${item.percentage}%` }} transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-full"
                    />
                  </div>
                  {/* Platform sub-breakdown for paid_ads */}
                  {item.platforms && (
                    <div className="mt-2 ml-4 space-y-1.5">
                      {item.platforms.map((pl, j) => (
                        <div key={j} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                          <span className="text-sm text-gray-300">{pl.platform}</span>
                          <div className="text-right">
                            <span className="text-white text-sm font-semibold">{pl.amount.toLocaleString()} {campaignData.currency}</span>
                            <span className="text-emerald-400 text-xs ml-2">({pl.dailyBudget?.toFixed(2)}/day)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Ad Strategy */}
          {execution?.adStrategy?.campaigns?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
              className="bg-white/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-amber-500/20"><Megaphone className="w-5 h-5 text-amber-400" /></div>
                <h3 className="text-xl font-bold text-white">Ad Strategy</h3>
              </div>
              <div className="space-y-3">
                {execution.adStrategy.campaigns.map((ad, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-amber-500/30 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-bold">{ad.platform}</span>
                      <span className="text-xs px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full capitalize">{ad.objective}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Campaign Type</p>
                        <p className="text-sm text-gray-200">{ad.campaignType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Duration</p>
                        <p className="text-sm text-gray-200">{ad.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Daily Budget</p>
                        <p className="text-sm text-emerald-400 font-semibold">{ad.dailyBudget?.toFixed(2)} {campaignData.currency}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Content Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-blue-500/20"><Calendar className="w-5 h-5 text-blue-400" /></div>
              <h3 className="text-xl font-bold text-white">Content Calendar</h3>
              <span className="ml-auto text-xs text-gray-400">{calendarItems.length} entries</span>
            </div>
            <div className="space-y-3">
              {visibleCalendar.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + i * 0.04 }}
                  className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#C1B6FD]/40 transition-all"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#745CB4] to-[#C1B6FD] flex items-center justify-center shadow-md">
                    <div className="text-center">
                      <div className="text-[9px] text-white/70 font-medium leading-none">Day</div>
                      <div className="text-lg font-bold text-white leading-snug">{item.day}</div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1.5">
                      <span className="font-semibold text-white capitalize">{item.contentType}</span>
                      <span className="text-xs px-2.5 py-0.5 bg-[#745CB4]/20 text-[#C1B6FD] rounded-full border border-[#C1B6FD]/20">{item.platform}</span>
                      <span className="text-xs px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/20 capitalize">{item.status}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-1 line-clamp-1">{item.caption}</p>
                    <p className="text-xs text-gray-500">{formatDate(item.date)} · {item.task}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            {calendarItems.length > 7 && (
              <button
                onClick={() => setShowAllCalendar(v => !v)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-[#C1B6FD]/30 transition-all text-sm font-medium"
              >
                {showAllCalendar
                  ? <><ChevronUp className="w-4 h-4" /> Show Less</>
                  : <><ChevronDown className="w-4 h-4" /> Show All {calendarItems.length} Days</>}
              </button>
            )}
          </motion.div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="space-y-6">

          {/* Estimated Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl p-6 sticky top-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-[#745CB4]/20"><BarChart3 className="w-5 h-5 text-[#C1B6FD]" /></div>
              <h3 className="text-xl font-bold text-white">Estimated Results</h3>
            </div>

            {estimations?.estimatedResults && (
              <>
                {/* Scenario & Confidence */}
                <div className="p-4 bg-gradient-to-br from-[#745CB4]/10 to-[#C1B6FD]/5 rounded-xl border border-[#C1B6FD]/20 mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400">Scenario</span>
                    <span className="text-white font-bold capitalize px-3 py-1 bg-white/10 rounded-full text-xs">
                      {estimations.estimatedResults.scenario}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Confidence</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-white/10 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${estimations.estimatedResults.confidenceLevel}%` }}
                          transition={{ duration: 1.2, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-full"
                        />
                      </div>
                      <span className="text-[#C1B6FD] font-bold text-sm">{estimations.estimatedResults.confidenceLevel}%</span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-4">
                  {estimations.estimatedResults.metrics?.map((metric, i) => {
                    const palette = [
                      { grad: 'from-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/20' },
                      { grad: 'from-[#745CB4]/20', text: 'text-[#C1B6FD]', border: 'border-[#745CB4]/20' },
                      { grad: 'from-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/20' },
                    ];
                    const c = palette[i % palette.length];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                        className={`p-4 bg-gradient-to-br ${c.grad} to-transparent rounded-xl border ${c.border}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className={`w-4 h-4 ${c.text}`} />
                          <span className="text-sm font-semibold text-gray-300 capitalize">{metric.metric}</span>
                        </div>
                        <p className={`text-2xl font-bold ${c.text}`}>{metric.estimatedRange.mostLikely.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Range: {metric.estimatedRange.min.toLocaleString()} – {metric.estimatedRange.max.toLocaleString()}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>

          {/* Campaign Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-white/10"><FileText className="w-5 h-5 text-gray-300" /></div>
              <h3 className="text-lg font-bold text-white">Campaign Details</h3>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Name', value: campaignData.campaignName },
                { label: 'Goal', value: campaignData.goalType?.replace('_', ' '), capitalize: true },
                { label: 'Budget', value: `${campaignData.currency} ${Number(campaignData.totalBudget).toLocaleString()}` },
                { label: 'Flexibility', value: campaignData.budgetFlexibility, capitalize: true },
                { label: 'Start Date', value: formatDate(campaignData.startDate) },
                { label: 'End Date', value: formatDate(campaignData.endDate) },
                { label: 'Duration', value: `${campaignDuration} days` },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-gray-400">{row.label}</span>
                  <span className={`text-white font-medium text-right ${row.capitalize ? 'capitalize' : ''}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom Action Buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleSaveAndPublish}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-xl text-white font-bold shadow-lg shadow-[#745CB4]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Rocket className="w-4 h-4" />
              Save &amp; Publish to Marketplace
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 border border-[#C1B6FD]/40 rounded-xl text-[#C1B6FD] font-semibold hover:bg-[#745CB4]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save Campaign
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleSaveAsDraft}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BookOpen className="w-4 h-4" />
              Save as Draft
            </motion.button>
          </div>

          {/* Info note */}
          <div className="flex items-start gap-3 p-4 bg-[#745CB4]/10 border border-[#C1B6FD]/20 rounded-xl text-sm text-gray-400">
            <CheckCircle className="w-5 h-5 text-[#C1B6FD] flex-shrink-0 mt-0.5" />
            <p>Publishing to the marketplace will make your campaign visible to all influencers on the platform.</p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

export default GeneratedCampaign;
