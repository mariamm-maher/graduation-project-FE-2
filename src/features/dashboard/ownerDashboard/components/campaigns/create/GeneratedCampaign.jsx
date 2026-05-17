import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Sparkles } from 'lucide-react';
import campaignService from '../../../../../../api/campaign';
import useProfileStore from '../../../../../../stores/profileStore';
import { buildSaveCampaignPayload } from '../../../../../../utils/buildSaveCampaignPayload';
import aiCampaignApi from '../../../../../../api/aiCampaignApi';
import GeneratedCampaignHeader from './GeneratedCampaignHeader';
import GeneratedCampaignStrategy from './GeneratedCampaignStrategy';
import GeneratedCampaignSidebar from './GeneratedCampaignSidebar';

function GeneratedCampaign() {
  const navigate = useNavigate();
  const location = useLocation();
  const ownerProfile = useProfileStore((s) => s.ownerProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState(null);

  const {
    campaignData,
    ownerDraft: ownerDraftFromState,
    aiPreview: aiPreviewFromState,
    strategy: strategyFromState,
    calendar: calendarFromState,
    influencer_matches: influencerMatchesFromState,
    influencer_strategy_note: influencerStrategyNoteFromState,
  } = location.state || {};

  const aiPreview = useMemo(() => {
    if (aiPreviewFromState) return aiPreviewFromState;
    if (!strategyFromState) return null;
    return {
      strategy: strategyFromState,
      execution: {
        contentCalendar: (calendarFromState?.days || []).map((day) => ({
          day: day.day,
          date: day.date,
          platform: day.channel || day.platform,
          contentType: day.contentType || 'post',
          task: Array.isArray(day.tasks) ? day.tasks[0] : day.task,
          caption: day.caption || '',
        })),
        tactical_plan: strategyFromState?.tactical_plan || null,
      },
      estimations: {
        estimatedResults: { metrics: strategyFromState?.kpis || [] },
        ml_score: strategyFromState?.ml_score,
        ml_verdict: strategyFromState?.ml_verdict,
      },
      generatedAt: new Date().toISOString(),
    };
  }, [aiPreviewFromState, strategyFromState, calendarFromState]);

  const ownerDraft = useMemo(() => {
    const tone = ownerDraftFromState?.brand_tone
      || ownerDraftFromState?.brandTone
      || ownerProfile?.brand_tone
      || ownerProfile?.brandTone;
    return {
      ...(ownerProfile || {}),
      ...(ownerDraftFromState || {}),
      brand_tone: tone || {
        tone_formality: 3,
        tone_playfulness: 3,
        tone_boldness: 3,
        preferred_vocabulary: [],
        avoided_vocabulary: [],
      },
      platforms: ownerDraftFromState?.platforms || ownerProfile?.platforms || [],
      targetAudience: ownerDraftFromState?.targetAudience || ownerProfile?.targetAudience || {},
    };
  }, [ownerDraftFromState, ownerProfile]);

  const normalizedInput = useMemo(() => {
    if (!campaignData) return {};
    return {
      campaign_name: campaignData.campaignName || campaignData.campaign_name || '',
      brand_name: campaignData.brand_name || ownerDraft.brand_name || '',
      product_or_service: campaignData.product_or_service || ownerDraft.product_or_service || '',
      industry: campaignData.industry || ownerDraft.industry || '',
      target_market: Array.isArray(campaignData.target_market)
        ? campaignData.target_market
        : ownerDraft.target_market || [],
      company_size: campaignData.company_size || ownerDraft.company_size || '',
      campaign_goal: campaignData.campaign_goal || campaignData.campaignGoal || campaignData.goalType || '',
      budget_amount: Number(campaignData.budget_amount ?? campaignData.budget ?? 0),
      budget_currency: campaignData.budget_currency || campaignData.currency || 'USD',
      campaign_duration_weeks: Number(campaignData.campaign_duration_weeks ?? campaignData.durationWeeks ?? 0),
      unique_selling_point: campaignData.unique_selling_point || ownerDraft.unique_selling_point || '',
      current_channels: Array.isArray(campaignData.current_channels) ? campaignData.current_channels : [],
      competitors: Array.isArray(campaignData.competitors) ? campaignData.competitors : ownerDraft.competitors || [],
      has_previous_campaigns: Boolean(campaignData.has_previous_campaigns ?? ownerDraft.has_previous_campaigns),
      previous_campaign_description: campaignData.previous_campaign_description || ownerDraft.previous_campaign_description || '',
      website: campaignData.website || ownerDraft.website || '',
      platforms: Array.isArray(campaignData.platforms) ? campaignData.platforms : ownerDraft.platforms || [],
    };
  }, [campaignData, ownerDraft]);

  const campaignDates = useMemo(() => {
    if (!campaignData) return { startDate: null, endDate: null };
    if (campaignData.startDate && campaignData.endDate) {
      return { startDate: campaignData.startDate, endDate: campaignData.endDate };
    }

    const weeks = Number.isFinite(normalizedInput.campaign_duration_weeks) && normalizedInput.campaign_duration_weeks > 0
      ? normalizedInput.campaign_duration_weeks
      : 1;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + (weeks * 7) - 1);
    end.setHours(23, 59, 59, 999);
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, [campaignData, normalizedInput.campaign_duration_weeks]);

  const strategy = aiPreview?.strategy;
  const execution = aiPreview?.execution;
  const estimations = aiPreview?.estimations;
  const generatedAt = aiPreview?.generatedAt;

  const aiResponse = useMemo(() => ({
    strategy: strategyFromState || strategy,
    calendar: calendarFromState || { days: execution?.contentCalendar || [] },
    influencer_matches: influencerMatchesFromState || [],
    influencer_strategy_note: influencerStrategyNoteFromState || '',
  }), [strategyFromState, strategy, calendarFromState, execution, influencerMatchesFromState, influencerStrategyNoteFromState]);

  const campaignDuration = useMemo(() => {
    if (!campaignDates.startDate || !campaignDates.endDate) return 1;
    const start = new Date(campaignDates.startDate);
    const end = new Date(campaignDates.endDate);
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  }, [campaignDates]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleSaveCampaign = async (publishImmediately = false) => {
    setIsSaving(true);
    try {
      const formCampaignData = {
        ...campaignData,
        startDate: campaignDates.startDate,
        endDate: campaignDates.endDate,
      };

      const payload = buildSaveCampaignPayload({
        campaignData: formCampaignData,
        ownerDraft,
        aiResponse,
        isPublished: publishImmediately,
      });

      console.log('📦 Save payload:', JSON.stringify(payload, null, 2));

      const result = publishImmediately
        ? await campaignService.saveAndPublishCampaign(payload)
        : await campaignService.saveCampaign(payload);

      toast.success(
        publishImmediately
          ? 'Campaign saved and published! Posts are being scheduled.'
          : 'Campaign saved successfully.',
        { position: 'top-right', autoClose: 3000 }
      );

      navigate('/dashboard/owner/campaigns', {
        state: { savedCampaignId: result?.data?.campaign?.id || result?.campaign?.id },
      });
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error?.message || 'Failed to save campaign', {
        position: 'top-right',
        autoClose: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = async () => {
    const data = isEditing ? editData : normalizedInput;
    setIsEditing(false);
    setIsRegenerating(true);
    try {
      const { response } = await aiCampaignApi.generateWithPayload(data);
      if (!response?.strategy) {
        throw new Error('Invalid response from AI pipeline');
      }
      toast.success('Campaign regenerated!', { position: 'top-right', autoClose: 3000 });
      navigate('/dashboard/owner/campaigns/generated', {
        state: {
          campaignData,
          ownerDraft,
          strategy: response.strategy,
          calendar: response.calendar,
          influencer_matches: response.influencer_matches || [],
          influencer_strategy_note: response.influencer_strategy_note || '',
          aiPreview: {
            strategy: response.strategy,
            execution: {
              contentCalendar: (response.calendar?.days || []).map((day) => ({
                day: day.day,
                date: day.date,
                platform: day.channel || day.platform,
                contentType: day.contentType || 'post',
                task: Array.isArray(day.tasks) ? day.tasks[0] : day.task,
                caption: day.caption || '',
              })),
            },
            estimations: { estimatedResults: { metrics: response.strategy?.kpis || [] } },
            generatedAt: new Date().toISOString(),
          },
        },
        replace: true,
      });
    } catch (err) {
      console.error('Regenerate error:', err);
      toast.error(err?.message || 'Failed to regenerate campaign', { position: 'top-right', autoClose: 4000 });
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!campaignData || !aiPreview) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center max-w-md">
          <Sparkles className="w-12 h-12 text-[#C1B6FD] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Generated Campaign</h2>
          <p className="text-gray-400 mb-6">Please fill in the campaign form and generate with AI first.</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard/owner/campaigns/create')}
            className="px-6 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Back to Create Campaign
          </button>
        </div>
      </div>
    );
  }

  const isLoading = isSaving || isRegenerating;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-6"
    >
      <GeneratedCampaignHeader
        generatedAt={generatedAt}
        formatDate={formatDate}
        isLoading={isLoading}
        handleSaveAsDraft={() => handleSaveCampaign(false)}
        handleSave={() => handleSaveCampaign(false)}
        handleSaveAndPublish={() => handleSaveCampaign(true)}
        navigate={navigate}
      />

      <div className="flex flex-wrap gap-3 justify-end">
        <button
          type="button"
          onClick={() => handleSaveCampaign(false)}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-60"
        >
          {isSaving ? 'Saving...' : 'Save as Draft'}
        </button>
        <button
          type="button"
          onClick={() => handleSaveCampaign(true)}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white disabled:opacity-60"
        >
          {isSaving ? 'Publishing...' : 'Save & Publish'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GeneratedCampaignStrategy
          normalizedInput={normalizedInput}
          strategy={strategy}
          execution={execution}
          campaignDuration={campaignDuration}
          formatDate={formatDate}
        />

        <GeneratedCampaignSidebar
          estimations={estimations}
          normalizedInput={normalizedInput}
          campaignDates={campaignDates}
          campaignDuration={campaignDuration}
          formatDate={formatDate}
          isLoading={isLoading}
          handleSaveAsDraft={() => handleSaveCampaign(false)}
          handleSave={() => handleSaveCampaign(false)}
          handleSaveAndPublish={() => handleSaveCampaign(true)}
        />
      </div>
    </motion.div>
  );
}

export default GeneratedCampaign;
