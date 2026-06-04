import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  Save,
  Sparkles,
  Clock,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Edit3,
  X,
  Target,
  Users,
  MessageSquare,
  TrendingUp,
  Calendar,
  DollarSign,
  Award,
  Layers,
  Megaphone,
  Lightbulb,
  BarChart3,
  Flag,
  Zap,
  FileText,
  Hash,
  Compass,
  Briefcase,
  Star,
  PieChart,
  Filter,
  Heart,
  Share2,
  ShoppingCart,
} from 'lucide-react';
import campaignService from '../../../../../../api/campaign';
import aiCampaignApi, { buildCampaignBriefPayload } from '../../../../../../api/aiCampaignApi';
import useCampaignDraftStore from '../../../../../../stores/campaignDraftStore';
import { NavigationGuardDialog } from './components';
import { useCampaignNavigationGuard } from './hooks';

function EditDraftCampaign() {
  const navigate = useNavigate();
  const location = useLocation();
  const { draftId: urlDraftId } = useParams();

  const draftId = urlDraftId || location.state?.draftId;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftData, setDraftData] = useState(null);
  
  // UI State
  const [showInputsPanel, setShowInputsPanel] = useState(false);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);

  // Editable inputs state
  const [inputs, setInputs] = useState({
    campaign_name: '',
    goal: '',
    budget: '',
    duration_weeks: '',
    start_date: '',
    end_date: '',
    extra_notes: '',
  });

  const rehydrateDraft = useCampaignDraftStore((state) => state.rehydrateDraft);
  const addVersion = useCampaignDraftStore((state) => state.addVersion);
  const clearAll = useCampaignDraftStore((state) => state.clearAll);

  const {
    showDialog,
    isSaving: isNavSaving,
    handleSaveAsDraft,
    handleLeaveWithoutSaving,
    handleStay,
  } = useCampaignNavigationGuard();

  // Load draft from backend
  useEffect(() => {
    if (!draftId) {
      toast.error('No draft ID provided');
      navigate('/dashboard/owner/campaigns/all?status=draft');
      return;
    }

    loadDraft();
  }, [draftId]);

  const loadDraft = async () => {
    setIsLoading(true);
    try {
      const result = await campaignService.loadCampaignDraft(draftId);
      console.log('Draft API Response:', result);
      
      const draft = result?.draft || result;

      if (!draft) {
        toast.error('Draft not found');
        navigate('/dashboard/owner/campaigns/all?status=draft');
        return;
      }

      // Log all available fields
      console.log('Draft object keys:', Object.keys(draft));
      console.log('Draft inputs keys:', Object.keys(draft.inputs || {}));
      console.log('Draft current_output keys:', Object.keys(draft.current_output || {}));
      console.log('Full draft data:', draft);

      setDraftData(draft);

      // Populate inputs from draft - extract all available fields
      const backendInputs = draft.inputs || {};
      setInputs({
        campaign_name: backendInputs.campaign_name || '',
        goal: backendInputs.goal || '',
        budget: backendInputs.budget || '',
        duration_weeks: backendInputs.duration_weeks || '',
        start_date: backendInputs.start_date || '',
        end_date: backendInputs.end_date || '',
        extra_notes: backendInputs.extra_notes || '',
        // Additional fields if available
        target_audience: backendInputs.target_audience || '',
        positioning: backendInputs.positioning || '',
        channels: backendInputs.channels || [],
        brand_voice: backendInputs.brand_voice || '',
        industry: backendInputs.industry || '',
        product_type: backendInputs.product_type || '',
      });

      // Rehydrate draft store
      const storeData = {
        inputs: {
          name: backendInputs.campaign_name || '',
          goal: backendInputs.goal || '',
          budget: backendInputs.budget || 0,
          duration_days: backendInputs.duration_weeks ? backendInputs.duration_weeks * 7 : 0,
          extra_notes: backendInputs.extra_notes || '',
        },
        versions: draft.version_history || [],
        currentVersionIndex: 0,
        draftId: draftId,
      };
      rehydrateDraft(storeData);

      sessionStorage.setItem('campaign_draft_id', draftId);
    } catch (error) {
      console.error('Failed to load draft:', error);
      toast.error('Failed to load draft');
      navigate('/dashboard/owner/campaigns/all?status=draft');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const payload = {
        inputs: {
          campaign_name: inputs.campaign_name,
          goal: inputs.goal,
          budget: Number(inputs.budget) || 0,
          duration_weeks: Number(inputs.duration_weeks) || 4,
          start_date: inputs.start_date || null,
          end_date: inputs.end_date || null,
          extra_notes: inputs.extra_notes || '',
        },
        current_output: draftData?.current_output || null,
        version_history: draftData?.version_history || [],
      };

      await campaignService.updateCampaignDraft(draftId, payload);
      toast.success('Draft saved successfully');

      setDraftData((prev) => ({
        ...prev,
        inputs: payload.inputs,
      }));
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const campaignData = {
        campaignName: inputs.campaign_name,
        campaign_goal: inputs.goal,
        budget: Number(inputs.budget) || 0,
        budget_amount: Number(inputs.budget) || 0,
        durationWeeks: Number(inputs.duration_weeks) || 4,
        duration_weeks: Number(inputs.duration_weeks) || 4,
        startDate: inputs.start_date,
        endDate: inputs.end_date,
        currency: 'USD',
      };

      const payload = buildCampaignBriefPayload({
        ownerDraft: {},
        campaignData,
      });

      const response = await aiCampaignApi.generateCampaign(payload);

      addVersion({
        strategy: response.strategy,
        calendar: response.calendar,
        influencer_matches: response.influencer_matches || [],
        generatedAt: new Date().toISOString(),
      });

      const updatedVersions = [
        ...(draftData?.version_history || []),
        {
          versionNumber: (draftData?.version_history?.length || 0) + 1,
          generatedAt: new Date().toISOString(),
          output: {
            strategy: response.strategy,
            calendar: response.calendar,
            influencer_matches: response.influencer_matches || [],
          },
        },
      ];

      await campaignService.updateCampaignDraft(draftId, {
        inputs: {
          campaign_name: inputs.campaign_name,
          goal: inputs.goal,
          budget: Number(inputs.budget) || 0,
          duration_weeks: Number(inputs.duration_weeks) || 4,
          start_date: inputs.start_date || null,
          end_date: inputs.end_date || null,
          extra_notes: inputs.extra_notes || '',
        },
        current_output: updatedVersions[updatedVersions.length - 1].output,
        version_history: updatedVersions,
      });

      await loadDraft();
      setShowInputsPanel(false); // Close inputs panel after regeneration

      toast.success('New version generated successfully');
    } catch (error) {
      console.error('Failed to regenerate:', error);
      toast.error('Failed to generate new version');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseVersion = () => {
    const versions = draftData?.version_history || [];
    const currentVersion = versions[selectedVersionIndex];

    if (!currentVersion) {
      toast.error('No version available');
      return;
    }

    const output = currentVersion.output || currentVersion;

    navigate('/dashboard/owner/campaigns/generated', {
      state: {
        campaignData: {
          campaignName: inputs.campaign_name,
          campaign_goal: inputs.goal,
          campaignGoal: inputs.goal,
          budget: Number(inputs.budget) || 0,
          budget_amount: Number(inputs.budget) || 0,
          durationWeeks: Number(inputs.duration_weeks) || 4,
          duration_weeks: Number(inputs.duration_weeks) || 4,
          startDate: inputs.start_date,
          endDate: inputs.end_date,
          currency: 'USD',
        },
        strategy: output.strategy,
        calendar: output.calendar,
        influencer_matches: output.influencer_matches || [],
      },
    });
  };

  const handleSelectVersion = (index) => {
    setSelectedVersionIndex(index);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#C1B6FD] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading draft...</p>
        </div>
      </div>
    );
  }

  const versions = draftData?.version_history || [];
  
  // Extract current_output from API response
  const rawOutput = draftData?.current_output;
  
  // The generated data is nested inside strategy and execution
  const strategy = rawOutput?.strategy || {};
  const execution = rawOutput?.execution || {};
  const estimations = rawOutput?.estimations || {};
  
  // Build a flattened currentOutput for easier access in JSX
  const currentOutput = {
    // From strategy
    campaign_summary: strategy.campaign_summary || strategy.summary,
    positioning_statement: strategy.positioning_statement || strategy.positioning,
    core_message: strategy.core_message || strategy.message,
    campaign_hooks: strategy.campaign_hooks || strategy.hooks,
    content_pillars: strategy.content_pillars || strategy.pillars,
    kpis: strategy.kpis || strategy.kpi,
    funnel: strategy.funnel,
    tactical_plan: strategy.tactical_plan || strategy.tactics,
    budget_allocation: strategy.budget_allocation || strategy.budget,
    influencer_strategy_note: strategy.influencer_strategy_note || strategy.influencer_note,
    target_audience: strategy.target_audience || strategy.audience,
    
    // From execution
    platform_content: execution.platform_content,
    posting_frequency: execution.posting_frequency,
    campaign_hashtag_set: execution.campaign_hashtag_set || execution.hashtags,
    content_creation_checklist: execution.content_creation_checklist || execution.checklist,
    
    // From estimations
    ml_score: estimations.ml_score,
    ml_verdict: estimations.ml_verdict,
    predicted_roi: estimations.predicted_roi,
    
    // Metadata
    generatedAt: rawOutput?.generatedAt,
    versionNumber: rawOutput?.versionNumber,
    isActive: rawOutput?.isActive,
  };
  
  // Check if we have any generated content
  const hasGeneratedContent = !!rawOutput && !!strategy;

  // Helper to render campaign section
  const CampaignSection = ({ icon: Icon, title, children, className = '' }) => (
    <div className={`bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 /20 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#C1B6FD]" />
        </div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );

  // KPI Metric Card Component
  const KPICard = ({ label, value, subtext }) => (
    <div className="bg-gradient-to-br from-[#745CB4]/20 to-[#745CB4]/5 border border-[#745CB4]/30 rounded-xl p-4">
      <div className="text-xs font-medium text-[#C1B6FD] uppercase tracking-wider mb-1">{label}</div>
      <div className="text-xl font-bold text-white mb-1">{value}</div>
      {subtext && <div className="text-xs text-gray-400">{subtext}</div>}
    </div>
  );

  // Budget Allocation Card
  const BudgetCard = ({ label, percentage, amount }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-sm font-bold text-[#C1B6FD]">{percentage}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2 mb-2">
        <div 
          className="bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {amount && <div className="text-xs text-gray-400">${Number(amount).toLocaleString()}</div>}
    </div>
  );

  // Content Pillar Card
  const PillarCard = ({ name, description, content }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-colors">
      <h4 className="text-base font-semibold text-white mb-2">{name}</h4>
      {description && <p className="text-xs sm:text-sm text-gray-300 mb-3">{description}</p>}
      {content && Array.isArray(content) && content.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {content.slice(0, 4).map((item, idx) => (
            <span key={idx} className="px-2 py-1 bg-[#745CB4]/20 text-[#C1B6FD] rounded text-xs">
              {item}
            </span>
          ))}
          {content.length > 4 && (
            <span className="px-2 py-1 bg-white/10 text-gray-400 rounded text-xs">
              +{content.length - 4}
            </span>
          )}
        </div>
      )}
    </div>
  );

  // Hook Card
  const HookCard = ({ hook, index }) => (
    <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-amber-400 font-bold text-sm">{index + 1}</span>
        </div>
        <p className="text-sm text-gray-200 leading-relaxed">{hook}</p>
      </div>
    </div>
  );

  // Funnel Stage Card
  const FunnelStage = ({ title, data, color }) => {
    const colorClasses = {
      blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
      purple: 'from-[#745CB4]/20 to-[#C1B6FD]/5 border-[#745CB4]/30',
      green: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
    };
    
    return (
      <div className={`bg-gradient-to-b ${colorClasses[color] || colorClasses.purple} border rounded-xl p-5`}>
        <h4 className="text-base font-bold text-white mb-4 text-center">{title}</h4>
        {data && (
          <div className="space-y-4">
            {data.goal && (
              <div>
                <div className="text-xs font-medium text-[#C1B6FD] uppercase tracking-wide mb-1">Goal</div>
                <p className="text-xs sm:text-sm text-gray-300">{data.goal}</p>
              </div>
            )}
            {data.kpi && (
              <div>
                <div className="text-xs font-medium text-[#C1B6FD] uppercase tracking-wide mb-1">KPI</div>
                <p className="text-xs sm:text-sm text-white font-medium">{data.kpi}</p>
              </div>
            )}
            {data.tactics && Array.isArray(data.tactics) && (
              <div>
                <div className="text-xs font-medium text-[#C1B6FD] uppercase tracking-wide mb-2">Tactics</div>
                <ul className="space-y-1">
                  {data.tactics.map((tactic, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-[#745CB4] mt-1">•</span>
                      {tactic}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Tactical Plan Card
  const TacticalCard = ({ platform, data }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-[#745CB4]/20 to-transparent px-5 py-3 border-b border-white/10">
        <h4 className="text-base font-bold text-white flex items-center gap-2">
          {platform === 'instagram' && <span className="text-pink-400">📷</span>}
          {platform === 'facebook' && <span className="text-blue-400">📘</span>}
          {platform === 'tiktok' && <span className="text-cyan-400">🎵</span>}
          {platform === 'twitter' && <span className="text-sky-400">🐦</span>}
          {platform === 'youtube' && <span className="text-red-400">📺</span>}
          {platform === 'linkedin' && <span className="text-blue-600">💼</span>}
          {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </h4>
      </div>
      <div className="p-4 sm:p-5 space-y-3">
        {data.posting_frequency && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Posting Frequency</span>
            <span className="text-xs sm:text-sm font-medium text-white">{data.posting_frequency}</span>
          </div>
        )}
        {data.optimal_time && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Optimal Time</span>
            <span className="text-xs sm:text-sm font-medium text-white">{data.optimal_time}</span>
          </div>
        )}
        {data.format && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Format</span>
            <span className="text-xs sm:text-sm font-medium text-white">{data.format}</span>
          </div>
        )}
        {data.variants && Array.isArray(data.variants) && (
          <div className="mt-4 space-y-3">
            <div className="text-xs font-medium text-[#C1B6FD] uppercase tracking-wide">Content Variants</div>
            {data.variants.map((variant, idx) => (
              <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-[#745CB4]/30 text-[#C1B6FD] rounded text-xs font-medium">
                    {variant.variant || `Variant ${String.fromCharCode(65 + idx)}`}
                  </span>
                  {variant.virality_score && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">
                      Score: {variant.virality_score}%
                    </span>
                  )}
                </div>
                {variant.caption && (
                  <p className="text-xs sm:text-sm text-gray-300 mb-2 italic">"{variant.caption}"</p>
                )}
                {variant.cta && (
                  <span className="inline-block px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                    CTA: {variant.cta}
                  </span>
                )}
                {variant.visual_direction && (
                  <p className="text-xs text-gray-400 mt-2">🎨 {variant.visual_direction}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen ">
      <NavigationGuardDialog
        isOpen={showDialog}
        onSave={handleSaveAsDraft}
        onLeave={handleLeaveWithoutSaving}
        onStay={handleStay}
        isSaving={isNavSaving}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 /95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard/owner/campaigns/all?status=draft')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-lg font-bold text-white">
                  {inputs.campaign_name || 'Untitled Campaign'}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">
                    Draft
                  </span>
                  {hasGeneratedContent && (
                    <>
                      <span>•</span>
                      <span>
                        {versions.length > 0 
                          ? `Version ${selectedVersionIndex + 1} of ${versions.length}`
                          : 'Current Version'
                        }
                      </span>
                      {currentOutput?.generatedAt && (
                        <>
                          <span>•</span>
                          <span>Generated {new Date(currentOutput.generatedAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Version Selector */}
              {versions.length > 1 && (
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-1">
                  <button
                    onClick={() => handleSelectVersion(Math.max(0, selectedVersionIndex - 1))}
                    disabled={selectedVersionIndex === 0}
                    className="p-1.5 hover:bg-white/10 rounded disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                  </button>
                  <span className="text-sm text-gray-400 px-2">
                    V{selectedVersionIndex + 1}
                  </span>
                  <button
                    onClick={() => handleSelectVersion(Math.min(versions.length - 1, selectedVersionIndex + 1))}
                    disabled={selectedVersionIndex === versions.length - 1}
                    className="p-1.5 hover:bg-white/10 rounded disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              )}

              {/* Edit Inputs Button */}
              <button
                onClick={() => setShowInputsPanel(!showInputsPanel)}
                className={`px-3 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors ${
                  showInputsPanel 
                    ? 'bg-[#745CB4]/20 text-[#C1B6FD] border border-[#745CB4]/40' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/20'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                Edit Inputs
              </button>


              {/* Save/Use Buttons */}
              {hasGeneratedContent ? (
                <button
                  onClick={handleUseVersion}
                  className="px-3 py-2 text-sm bg-[#745CB4] hover:bg-[#9381C4] rounded-lg text-white flex items-center gap-2 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Use This Version
                </button>
              ) : (
                <button
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="px-3 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-gray-300 flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Generated Campaign - Main Content (takes 8 cols when inputs hidden, 12 when shown) */}
          <div className={`${showInputsPanel ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6`}>
            
            {/* Campaign Overview */}
            <div className="bg-gradient-to-r from-[#745CB4]/20 to-[#C1B6FD]/10 border border-[#745CB4]/30 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{inputs.campaign_name || 'Untitled Campaign'}</h2>
                  <p className="text-sm text-gray-400">{inputs.goal || 'No goal set'}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">${Number(inputs.budget || 0).toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Budget</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#C1B6FD]" />
                  <span className="text-sm text-gray-300">{inputs.duration_weeks || 0} weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C1B6FD]" />
                  <span className="text-sm text-gray-300">
                    {inputs.start_date ? new Date(inputs.start_date).toLocaleDateString() : 'No start date'} - {inputs.end_date ? new Date(inputs.end_date).toLocaleDateString() : 'No end date'}
                  </span>
                </div>
              </div>
            </div>

            {currentOutput ? (
              <>
                {/* 1. KPI Overview */}
                {currentOutput.kpis && (
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#C1B6FD]" />
                      KPI Overview
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                      {typeof currentOutput.kpis === 'object' && !Array.isArray(currentOutput.kpis) ? (
                        Object.entries(currentOutput.kpis).map(([key, value]) => (
                          <KPICard 
                            key={key}
                            label={key.replace(/_/g, ' ')}
                            value={value}
                          />
                        ))
                      ) : Array.isArray(currentOutput.kpis) ? (
                        currentOutput.kpis.map((kpi, idx) => (
                          <KPICard 
                            key={idx}
                            label={kpi.label || `Metric ${idx + 1}`}
                            value={kpi.value || kpi}
                            subtext={kpi.subtext}
                          />
                        ))
                      ) : null}
                    </div>
                  </section>
                )}

                {/* 2. Positioning Statement */}
                {currentOutput.positioning_statement && (
                  <section className="mb-8">
                    <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-xl p-6">
                      <h3 className="text-base font-bold text-amber-400 mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Positioning Statement
                      </h3>
                      <p className="text-sm sm:text-base text-white leading-relaxed">{currentOutput.positioning_statement}</p>
                    </div>
                  </section>
                )}

                {/* 3. Core Message */}
                {currentOutput.core_message && (
                  <section className="mb-8">
                    <div className="bg-gradient-to-br from-[#745CB4]/30 to-[#745CB4]/10 border border-[#745CB4]/50 rounded-xl p-5 sm:p-8 text-center">
                      <h3 className="text-sm font-medium text-[#C1B6FD] uppercase tracking-wider mb-4">Core Message</h3>
                      <p className="text-lg md:text-2xl font-bold text-white leading-tight">"{currentOutput.core_message}"</p>
                    </div>
                  </section>
                )}

                {/* 4. Campaign Hooks */}
                {currentOutput.campaign_hooks && Array.isArray(currentOutput.campaign_hooks) && currentOutput.campaign_hooks.length > 0 && (
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Megaphone className="w-5 h-5 text-[#C1B6FD]" />
                      Campaign Hooks
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentOutput.campaign_hooks.map((hook, idx) => (
                        <HookCard key={idx} hook={hook} index={idx} />
                      ))}
                    </div>
                  </section>
                )}

                {/* 5. Funnel Strategy */}
                {currentOutput.funnel && typeof currentOutput.funnel === 'object' && (
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#C1B6FD]" />
                      Funnel Strategy
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FunnelStage title="Awareness" data={currentOutput.funnel.awareness} color="blue" />
                      <FunnelStage title="Consideration" data={currentOutput.funnel.consideration} color="purple" />
                      <FunnelStage title="Conversion" data={currentOutput.funnel.conversion} color="green" />
                    </div>
                  </section>
                )}

                {/* 6. Budget Allocation */}
                {currentOutput.budget_allocation && typeof currentOutput.budget_allocation === 'object' && (
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-[#C1B6FD]" />
                      Budget Allocation
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {Object.entries(currentOutput.budget_allocation).map(([key, value]) => {
                        const numValue = typeof value === 'number' ? value : parseFloat(value);
                        return (
                          <BudgetCard
                            key={key}
                            label={key.replace(/_/g, ' ')}
                            percentage={numValue}
                          />
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* 7. Content Pillars */}
                {currentOutput.content_pillars && Array.isArray(currentOutput.content_pillars) && currentOutput.content_pillars.length > 0 && (
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#C1B6FD]" />
                      Content Pillars
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentOutput.content_pillars.map((pillar, idx) => {
                        if (typeof pillar === 'string') {
                          return <PillarCard key={idx} name={pillar} />;
                        }
                        return (
                          <PillarCard
                            key={idx}
                            name={pillar.name || pillar.title || pillar.pillar || `Pillar ${idx + 1}`}
                            description={pillar.description || pillar.desc}
                            content={pillar.content || pillar.topics || pillar.ideas}
                          />
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* 8. Tactical Content Plan */}
                {currentOutput.tactical_plan && typeof currentOutput.tactical_plan === 'object' && (
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#C1B6FD]" />
                      Tactical Content Plan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(currentOutput.tactical_plan).map(([platform, data]) => (
                        <TacticalCard key={platform} platform={platform} data={data} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Platform Content (from execution) */}
                {currentOutput.platform_content && typeof currentOutput.platform_content === 'object' && (
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#C1B6FD]" />
                      Platform Content
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(currentOutput.platform_content).map(([platform, data]) => (
                        <div key={platform} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <h4 className="text-base font-semibold text-white mb-3 capitalize flex items-center gap-2">
                            {platform === 'instagram' && <span className="text-pink-400">📷</span>}
                            {platform === 'facebook' && <span className="text-blue-400">📘</span>}
                            {platform === 'tiktok' && <span className="text-cyan-400">🎵</span>}
                            {platform === 'twitter' && <span className="text-sky-400">🐦</span>}
                            {platform === 'youtube' && <span className="text-red-400">📺</span>}
                            {platform === 'linkedin' && <span className="text-blue-600">💼</span>}
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </h4>
                          {typeof data === 'object' ? (
                            <div className="space-y-2">
                              {data.content_ideas && Array.isArray(data.content_ideas) && (
                                <div className="space-y-2">
                                  <div className="text-xs font-medium text-[#C1B6FD] uppercase tracking-wide">Content Ideas</div>
                                  <ul className="space-y-1">
                                    {data.content_ideas.slice(0, 5).map((idea, idx) => (
                                      <li key={idx} className="text-xs sm:text-sm text-gray-300 flex items-start gap-2">
                                        <span className="text-[#745CB4] mt-0.5">•</span>
                                        {idea}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {data.posting_frequency && (
                                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                  <span className="text-xs text-gray-400">Frequency</span>
                                  <span className="text-xs sm:text-sm text-white">{data.posting_frequency}</span>
                                </div>
                              )}
                              {data.best_time && (
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400">Best Time</span>
                                  <span className="text-xs sm:text-sm text-white">{data.best_time}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs sm:text-sm text-gray-300">{String(data)}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Posting Frequency */}
                {currentOutput.posting_frequency && typeof currentOutput.posting_frequency === 'object' && (
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#C1B6FD]" />
                      Posting Schedule
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {Object.entries(currentOutput.posting_frequency).map(([day, count]) => (
                        <div key={day} className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                          <div className="text-xs text-gray-400 uppercase mb-1">{day}</div>
                          <div className="text-xl font-bold text-white">{count}</div>
                          <div className="text-xs text-gray-500">posts</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Hashtags */}
                {currentOutput.campaign_hashtag_set && Array.isArray(currentOutput.campaign_hashtag_set) && currentOutput.campaign_hashtag_set.length > 0 && (
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Hash className="w-5 h-5 text-[#C1B6FD]" />
                      Recommended Hashtags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentOutput.campaign_hashtag_set.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-[#745CB4]/20 to-[#745CB4]/10 border border-[#745CB4]/30 rounded-lg text-xs sm:text-sm font-medium text-[#C1B6FD]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Content Creation Checklist */}
                {currentOutput.content_creation_checklist && Array.isArray(currentOutput.content_creation_checklist) && currentOutput.content_creation_checklist.length > 0 && (
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#C1B6FD]" />
                      Content Creation Checklist
                    </h3>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5">
                      <div className="space-y-3">
                        {currentOutput.content_creation_checklist.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded border border-[#745CB4]/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-3 h-3 bg-[#745CB4] rounded-sm" />
                            </div>
                            <span className="text-xs sm:text-sm text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* ML Estimations */}
                {(currentOutput.ml_score || currentOutput.ml_verdict || currentOutput.predicted_roi) && (
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#C1B6FD]" />
                      AI Performance Estimation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {currentOutput.ml_score !== null && (
                        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border border-emerald-500/30 rounded-xl p-5 text-center">
                          <div className="text-sm text-emerald-400 mb-1">ML Score</div>
                          <div className="text-2xl font-bold text-white">{currentOutput.ml_score}%</div>
                        </div>
                      )}
                      {currentOutput.predicted_roi !== null && (
                        <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 rounded-xl p-5 text-center">
                          <div className="text-sm text-amber-400 mb-1">Predicted ROI</div>
                          <div className="text-2xl font-bold text-white">{currentOutput.predicted_roi}x</div>
                        </div>
                      )}
                      {currentOutput.ml_verdict && (
                        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/30 rounded-xl p-5">
                          <div className="text-sm text-blue-400 mb-1">Verdict</div>
                          <div className="text-base font-semibold text-white">{currentOutput.ml_verdict}</div>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Content Calendar */}
                {/* {currentOutput.calendar && currentOutput.calendar.length > 0 && (
                  <CampaignSection icon={Calendar} title="Content Calendar">
                    <div className="space-y-3">
                      {currentOutput.calendar.slice(0, 10).map((item, idx) => (
                        <div key={idx} className="bg-white/5 rounded-lg p-3">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-medium text-[#C1B6FD] bg-[#745CB4]/20 px-2 py-1 rounded">
                              {item.week_day || item.day || `Day ${idx + 1}`}
                            </span>
                            <span className="text-xs text-gray-400">{item.platform}</span>
                          </div>
                          <p className="text-sm text-gray-300">{item.content}</p>
                        </div>
                      ))}
                      {currentOutput.calendar.length > 10 && (
                        <p className="text-sm text-gray-500 text-center py-2">
                          +{currentOutput.calendar.length - 10} more items
                        </p>
                      )}
                    </div>
                  </CampaignSection>
                )} */}

                {/* 9. Influencer Recommendations */}
                {currentOutput.influencer_matches && currentOutput.influencer_matches.length > 0 && (
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#C1B6FD]" />
                      Influencer Recommendations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentOutput.influencer_matches.slice(0, 6).map((match, idx) => (
                        <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-[#745CB4]/50 transition-colors">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#745CB4]/30 to-[#C1B6FD]/20 rounded-full flex items-center justify-center text-[#C1B6FD] font-bold text-lg">
                              {match.influencer_name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{match.influencer_name}</p>
                              <p className="text-xs text-gray-400">{match.platform}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Match Score</span>
                            <span className="font-bold text-[#C1B6FD]">{match.match_score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 10. Influencer Strategy Note */}
                {currentOutput.influencer_strategy_note && (
                  <section className="mb-8">
                    <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        Influencer Strategy
                      </h3>
                      <p className="text-gray-200 leading-relaxed">{currentOutput.influencer_strategy_note}</p>
                    </div>
                  </section>
                )}

                {/* 11. Version Information */}
                <section className="mb-8">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">Version Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Current Version</div>
                        <div className="text-white font-medium">
                          {versions.length > 0 ? `Version ${selectedVersionIndex + 1} of ${versions.length}` : 'Current Version'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Last Updated</div>
                        <div className="text-white font-medium">
                          {draftData?.updated_at 
                            ? new Date(draftData.updated_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'Not available'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            ) : (
              /* No Generated Content State */
              <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                <div className="w-20 h-20 bg-[#745CB4]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-[#C1B6FD]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Campaign Generated Yet</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  This draft doesn't have a generated campaign yet. Edit your inputs and click "Generate" to create your AI-powered campaign strategy.
                </p>
                <button
                  onClick={() => setShowInputsPanel(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg text-white font-medium transition-colors"
                >
                  Edit Inputs & Generate
                </button>
              </div>
            )}
          </div>

          {/* Collapsible Inputs Panel - Right Side */}
          {showInputsPanel && (
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-[#C1B6FD]" />
                    Campaign Inputs
                  </h3>
                  <button
                    onClick={() => setShowInputsPanel(false)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Campaign Name</label>
                    <input
                      type="text"
                      value={inputs.campaign_name}
                      onChange={(e) => handleInputChange('campaign_name', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#C1B6FD] transition-colors"
                      placeholder="Enter campaign name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Goal</label>
                    <select
                      value={inputs.goal}
                      onChange={(e) => handleInputChange('goal', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#C1B6FD] transition-colors"
                    >
                      <option value="" className="bg-[#1e1632]">Select goal</option>
                      <option value="Awareness" className="bg-[#1e1632]">Awareness</option>
                      <option value="Leads" className="bg-[#1e1632]">Leads</option>
                      <option value="Conversions" className="bg-[#1e1632]">Conversions</option>
                      <option value="Retention" className="bg-[#1e1632]">Retention</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Budget ($)</label>
                      <input
                        type="number"
                        value={inputs.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#C1B6FD] transition-colors"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Weeks</label>
                      <input
                        type="number"
                        value={inputs.duration_weeks}
                        onChange={(e) => handleInputChange('duration_weeks', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#C1B6FD] transition-colors"
                        placeholder="4"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Start Date</label>
                      <input
                        type="date"
                        value={inputs.start_date}
                        onChange={(e) => handleInputChange('start_date', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#C1B6FD] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">End Date</label>
                      <input
                        type="date"
                        value={inputs.end_date}
                        onChange={(e) => handleInputChange('end_date', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#C1B6FD] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Extra Notes</label>
                    <textarea
                      value={inputs.extra_notes}
                      onChange={(e) => handleInputChange('extra_notes', e.target.value)}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#C1B6FD] transition-colors resize-none"
                      placeholder="Any additional notes for the AI..."
                    />
                  </div>

                  <div className="pt-4 space-y-3">
                    <button
                      onClick={handleRegenerate}
                      disabled={isGenerating}
                      className="w-full py-2.5 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isGenerating ? 'Generating...' : versions.length > 0 ? 'Regenerate Campaign' : 'Regenerate Campaign'}
                    </button>
                    
                    <button
                      onClick={handleSaveDraft}
                      disabled={isSaving}
                      className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-gray-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save Input Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default EditDraftCampaign;
