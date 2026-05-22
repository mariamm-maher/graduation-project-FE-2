import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Sparkles } from 'lucide-react';
import campaignService from '../../../../../../api/campaign';
import useProfileStore from '../../../../../../stores/profileStore';
import { buildSaveCampaignPayload } from '../../../../../../utils/buildSaveCampaignPayload';
import aiCampaignApi from '../../../../../../api/aiCampaignApi';
import { buildEstimationsFromStrategy } from '../../../../../../utils/normalizeAiEstimations';
import {
  normalizeAiCampaignView,
  resolveAiCalendarFromState,
  buildAiPreviewFromResponse,
} from '../../../../../../utils/normalizeAiCampaignView';
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

  const resolvedCalendar = useMemo(
    () => resolveAiCalendarFromState({ calendar: calendarFromState, aiPreview: aiPreviewFromState }),
    [calendarFromState, aiPreviewFromState],
  );

  const aiPreview = useMemo(() => {
    const rawStrategy = aiPreviewFromState?.strategy || strategyFromState;
    if (!rawStrategy) return null;

    const budgetAmount = Number(
      campaignData?.budget_amount ?? campaignData?.budget ?? 0,
    );

    const view = normalizeAiCampaignView({
      strategy: rawStrategy,
      calendar: resolvedCalendar,
      influencer_matches: influencerMatchesFromState || aiPreviewFromState?.influencer_matches || [],
      influencer_strategy_note:
        influencerStrategyNoteFromState || aiPreviewFromState?.influencer_strategy_note || '',
      budgetAmount,
    });

    return {
      ...(aiPreviewFromState || {}),
      strategy: view.strategy,
      execution: view.execution,
      estimations: buildEstimationsFromStrategy(view.strategy),
      influencer_matches: view.influencer_matches,
      influencer_strategy_note: view.influencer_strategy_note,
      generatedAt: aiPreviewFromState?.generatedAt || new Date().toISOString(),
    };
  }, [
    aiPreviewFromState,
    strategyFromState,
    resolvedCalendar,
    influencerMatchesFromState,
    influencerStrategyNoteFromState,
    campaignData,
  ]);

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
    calendar: resolvedCalendar,
    influencer_matches: influencerMatchesFromState || aiPreview?.influencer_matches || [],
    influencer_strategy_note:
      influencerStrategyNoteFromState || aiPreview?.influencer_strategy_note || '',
  }), [
    strategyFromState,
    strategy,
    resolvedCalendar,
    influencerMatchesFromState,
    influencerStrategyNoteFromState,
    aiPreview,
  ]);

  const campaignDuration = useMemo(() => {
    const scheduledDays = execution?.calendar_meta?.total_days
      || resolvedCalendar?.total_days
      || execution?.contentCalendar?.length;
    if (scheduledDays && Number(scheduledDays) > 0) {
      return Number(scheduledDays);
    }
    if (!campaignDates.startDate || !campaignDates.endDate) return 1;
    const start = new Date(campaignDates.startDate);
    const end = new Date(campaignDates.endDate);
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
  }, [campaignDates, execution, resolvedCalendar]);

  const formatDate = (d) => {
    if (!d) return '';
    const parsed = new Date(d);
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

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
        const campaignId =result?.data?.campaign?.id ||result?.campaign?.id;
        // TODO: Backend endpoint /campaigns/${campaignId}/ai not implemented yet
        // if (campaignId && aiPreview) {
        //   await campaignService.saveAIVersion(
        //     campaignId,
        //     aiPreview,
        //     {
        //       syncCalendar: true,
        //     }
        //   );
        // }

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
      const budgetAmount = Number(normalizedInput.budget_amount || 0);
      const aiPreviewNext = buildAiPreviewFromResponse(response, { budgetAmount });
      aiPreviewNext.estimations = buildEstimationsFromStrategy(aiPreviewNext.strategy);

      navigate('/dashboard/owner/campaigns/generated', {
        state: {
          campaignData,
          ownerDraft,
          strategy: response.strategy,
          calendar: response.calendar,
          influencer_matches: response.influencer_matches || [],
          influencer_strategy_note: response.influencer_strategy_note || '',
          aiPreview: aiPreviewNext,
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GeneratedCampaignStrategy
          normalizedInput={normalizedInput}
          strategy={strategy}
          execution={execution}
          campaignDuration={campaignDuration}
          formatDate={formatDate}
          influencerMatches={aiPreview?.influencer_matches || influencerMatchesFromState || []}
          influencerStrategyNote={aiPreview?.influencer_strategy_note || influencerStrategyNoteFromState || ''}
        />

        <GeneratedCampaignSidebar
          estimations={estimations}
          normalizedInput={normalizedInput}
          campaignDates={campaignDates}
          campaignDuration={campaignDuration}
          formatDate={formatDate}
          isLoading={isLoading}
        />
      </div>
    </motion.div>
  );
}

export default GeneratedCampaign;
