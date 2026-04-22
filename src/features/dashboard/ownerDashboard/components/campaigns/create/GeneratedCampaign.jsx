import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Sparkles } from 'lucide-react';
import useCampaignStore from '../../../../../../stores/campaignStore';
import aiCampaignApi from '../../../../../../api/aiCampaignApi';
import GeneratedCampaignHeader from './GeneratedCampaignHeader';
import GeneratedCampaignInputPanel from './GeneratedCampaignInputPanel';
import GeneratedCampaignStrategy from './GeneratedCampaignStrategy';
import GeneratedCampaignSidebar from './GeneratedCampaignSidebar';
import { buildCampaignPayload } from './buildCampaignPayload';

function GeneratedCampaign() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveDraftCampaign, saveCampaign, saveAndPublishCampaign, isLoading } = useCampaignStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [editData, setEditData] = useState(null);

  // Get data from navigation state
  const { campaignData, aiPreview } = location.state || {};
  console.log(aiPreview);

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

  const normalizedInput = useMemo(() => ({
    campaign_name: campaignData.campaignName || campaignData.campaign_name || '',
    brand_name: campaignData.brand_name || '',
    product_or_service: campaignData.product_or_service || '',
    industry: campaignData.industry || '',
    target_market: Array.isArray(campaignData.target_market) ? campaignData.target_market : [],
    company_size: campaignData.company_size || '',
    campaign_goal: campaignData.campaign_goal || campaignData.goalType || '',
    budget_amount: Number(campaignData.budget_amount ?? campaignData.totalBudget ?? 0),
    budget_currency: campaignData.budget_currency || campaignData.currency || 'USD',
    campaign_duration_weeks: Number(campaignData.campaign_duration_weeks || 0),
    unique_selling_point: campaignData.unique_selling_point || '',
    current_channels: Array.isArray(campaignData.current_channels) ? campaignData.current_channels : [],
    competitors: Array.isArray(campaignData.competitors) ? campaignData.competitors : [],
    has_previous_campaigns: Boolean(campaignData.has_previous_campaigns),
    previous_campaign_description: campaignData.previous_campaign_description || '',
    website: campaignData.website || '',
    platforms: Array.isArray(campaignData.platforms) ? campaignData.platforms : [],
  }), [campaignData]);

  const campaignDates = useMemo(() => {
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
  }, [campaignData.endDate, campaignData.startDate, normalizedInput.campaign_duration_weeks]);

  const campaignDuration = (() => {
    const start = new Date(campaignDates.startDate);
    const end = new Date(campaignDates.endDate);
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  })();

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // ── Edit / Regenerate helpers ──
  const handleEditToggle = () => {
    if (!isEditing) setEditData({ ...normalizedInput });
    setIsEditing(v => !v);
  };

  const handleRegenerate = async () => {
    const data = isEditing ? editData : normalizedInput;
    setIsEditing(false);
    setIsRegenerating(true);
    try {
      // Log selected payload fields for inspection
      const keysToShow = [
        'campaign_name', 'brand_name', 'product_or_service', 'industry', 'target_market', 'company_size',
        'campaign_goal', 'budget_amount', 'budget_currency', 'campaign_duration_weeks',
        'unique_selling_point', 'current_channels', 'competitors', 'has_previous_campaigns',
        'previous_campaign_description', 'website', 'platforms',
      ];

      const preview = {};
      keysToShow.forEach((k) => { preview[k] = data?.[k]; });
      console.log('Regenerate payload preview:', preview);
      toast.info('Regenerating with payload preview in console', { position: 'top-right', autoClose: 2500 });

      const { response } = await aiCampaignApi.generateWithPayload(data);
      const success = response?.success || response?.status === 'success';
      if (success) {
        toast.success('Campaign regenerated!', { position: 'top-right', autoClose: 3000 });
        navigate('/dashboard/owner/campaigns/generated', {
          state: { campaignData: data, aiPreview: response?.data?.aiPreview },
          replace: true,
        });
      } else {
        toast.error(response?.message || 'Failed to regenerate campaign', { position: 'top-right', autoClose: 4000 });
      }
    } catch (err) {
      console.error('Regenerate error:', err);
      toast.error(err?.message || 'Failed to regenerate campaign', { position: 'top-right', autoClose: 4000 });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleNewCampaign = () => navigate('/dashboard/owner/campaigns/create');

  // ── Save helpers ──
  const buildPayload = (extra = {}) =>
    buildCampaignPayload(
      { isEditing, editData, normalizedInput, campaignData, campaignDates, strategy, execution, estimations, generatedAt },
      extra
    );

  const handleSaveAsDraft = async () => {
    const payload = buildPayload({ lifecycleStage: 'draft', isPublished: false });
    console.log('[SaveAsDraft] payload →', payload);
    const result = await saveDraftCampaign(payload);
    if (result.success) {
      toast.success('Campaign saved as draft!', { position: 'top-right', autoClose: 3000 });
      navigate('/dashboard/owner/campaigns/draft');
    } else {
      toast.error(result.error || 'Failed to save as draft', { position: 'top-right', autoClose: 4000 });
    }
  };

  const handleSave = async () => {
    const payload = buildPayload({ lifecycleStage: 'saved', isPublished: false });
    console.log('[Save] payload →', payload);
    const result = await saveCampaign(payload);
    if (result.success) {
      toast.success('Campaign saved!', { position: 'top-right', autoClose: 3000 });
      navigate('/dashboard/owner/campaigns/all');
    } else {
      toast.error(result.error || 'Failed to save campaign', { position: 'top-right', autoClose: 4000 });
    }
  };

  const handleSaveAndPublish = async () => {
    const payload = buildPayload({ lifecycleStage: 'saved', isPublished: true });
    console.log('[SaveAndPublish] payload →', payload);
    const result = await saveAndPublishCampaign(payload);
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
      <GeneratedCampaignHeader
        generatedAt={generatedAt}
        formatDate={formatDate}
        isLoading={isLoading}
        handleSaveAsDraft={handleSaveAsDraft}
        handleSave={handleSave}
        handleSaveAndPublish={handleSaveAndPublish}
        navigate={navigate}
      />

      <GeneratedCampaignInputPanel
        isEditing={isEditing}
        handleEditToggle={handleEditToggle}
        handleNewCampaign={handleNewCampaign}
        handleRegenerate={handleRegenerate}
        isRegenerating={isRegenerating}
        normalizedInput={normalizedInput}
        campaignDuration={campaignDuration}
        editData={editData}
        setEditData={setEditData}
      />

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
          handleSaveAsDraft={handleSaveAsDraft}
          handleSave={handleSave}
          handleSaveAndPublish={handleSaveAndPublish}
        />
      </div>
    </motion.div>
  );
}

export default GeneratedCampaign;