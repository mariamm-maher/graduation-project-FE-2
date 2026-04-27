import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import useProfileStore from '../../../../../../stores/profileStore';
import aiCampaignApi from '../../../../../../api/aiCampaignApi';

function PrepareCampaign() {
  const navigate = useNavigate();
  const location = useLocation();
  const { campaignData } = location.state || {};


  const fetchOwnerProfile = useProfileStore((s) => s.fetchOwnerProfile);
  const ownerProfile = useProfileStore((s) => s.ownerProfile);

  const [currentStep, setCurrentStep] = useState(0);
  const [ownerEdits, setOwnerEdits] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Audience location search-select state
  const [locationQuery, setLocationQuery] = useState('');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const locationOptions = ['Egypt', 'Saudi Arabia', 'UAE', 'GCC', 'MENA', 'Europe', 'USA', 'Worldwide'];
  const filteredLocations = locationOptions.filter((loc) =>
    loc.toLowerCase().includes(locationQuery.toLowerCase())
  );

  useEffect(() => {
    fetchOwnerProfile();
  }, [fetchOwnerProfile]);

  const ownerBase = useMemo(
    () => ({
      brand_name: ownerProfile?.brand_name || '',
      campaign_name: campaignData.campaignName || campaignData.campaign_name || '',
      unique_selling_point: ownerProfile?.unique_selling_point || '',
      product_or_service: ownerProfile?.product_or_service || '',
      company_size: ownerProfile?.company_size || '',
      target_market: Array.isArray(ownerProfile?.target_market)
        ? ownerProfile.target_market
        : typeof ownerProfile?.target_market === 'string' && ownerProfile.target_market.trim()
          ? ownerProfile.target_market.split(',').map((item) => item.trim()).filter(Boolean)
          : [],
      competitors: Array.isArray(ownerProfile?.competitors) ? ownerProfile.competitors : [],
      has_previous_campaigns: Boolean(ownerProfile?.has_previous_campaigns),
      previous_campaign_description: ownerProfile?.previous_campaign_description || '',
      industry: ownerProfile?.industry || '',
      website: ownerProfile?.website || '',
      current_channels: Array.isArray(ownerProfile?.current_channels) ? ownerProfile.current_channels : [],
      platforms: Array.isArray(ownerProfile?.platforms) ? ownerProfile.platforms : [],
      targetAudience: {
        gender: ownerProfile?.targetAudience?.gender || '',
        ageRange: ownerProfile?.targetAudience?.ageRange || '',
        location: ownerProfile?.targetAudience?.location || '',
      },
    }),
    [ownerProfile]
  );

  const ownerDraft = useMemo(
    () => ({
      ...ownerBase,
      ...ownerEdits,
      targetAudience: {
        ...(ownerBase.targetAudience || {}),
        ...(ownerEdits.targetAudience || {}),
      },
    }),
    [ownerBase, ownerEdits]
  );

  const parsedWeeks = Number.parseInt(campaignData?.durationWeeks, 10);

  const companySizeOptions = ['Solo', 'Small', 'Mid', 'Enterprise'];

  const industryOptions = [
    'E-commerce & Retail',
    'Fashion & Beauty',
    'Food & Beverage',
    'Media & Content Creation',
    'Fitness & Wellness',
    'Home & Local Services',
    'Education & Coaching',
    'Travel & Hospitality',
    'Real Estate',
    'Healthcare & Wellness',
    'Finance & Business',
    'Technology & Apps',
    'Other',
  ];

  const targetMarketOptions = ['Egypt', 'Saudi Arabia', 'UAE', 'GCC', 'MENA', 'Europe', 'USA', 'Worldwide'];

  const platformOptions = ['Instagram', 'TikTok', 'Facebook', 'YouTube', 'LinkedIn', 'X (Twitter)'];



  const steps = useMemo(
    () => [
      {
        title: 'Campaign Inputs',
        description: 'Review campaign goal, budget, currency, and duration.',
      },
      {
        title: 'Offer & Positioning',
        description: 'Set product, industry, size, and unique selling point.',
      },
      {
        title: 'Market & Competitors',
        description: 'Define target market, competitors, and campaign history.',
      },
      {
        title: 'Channels & Audience',
        description: 'Set website, platforms, and target audience details.',
      },
      {
        title: 'Review & Generate',
        description: 'Confirm all details and generate your AI campaign.',
      },
    ],
    []
  );

  const updateOwnerField = (field, value) => {
    setOwnerEdits((prev) => ({ ...prev, [field]: value }));
  };

  const updateAudience = (field, value) => {
    setOwnerEdits((prev) => ({
      ...prev,
      targetAudience: {
        ...(prev.targetAudience || {}),
        [field]: value,
      },
    }));
  };

  const toggleOwnerArrayValue = (field, value) => {
    const current = Array.isArray(ownerDraft[field]) ? ownerDraft[field] : [];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    setOwnerEdits((prev) => ({ ...prev, [field]: next }));
  };

  const addCompetitor = () => {
    const current = Array.isArray(ownerDraft.competitors) ? ownerDraft.competitors : [];
    setOwnerEdits((prev) => ({
      ...prev,
      competitors: [...current, { name: '', website: '', notes: '' }],
    }));
  };

  const removeCompetitor = (index) => {
    const current = Array.isArray(ownerDraft.competitors) ? ownerDraft.competitors : [];
    setOwnerEdits((prev) => ({
      ...prev,
      competitors: current.filter((_, i) => i !== index),
    }));
  };

  const updateCompetitor = (index, field, value) => {
    const current = Array.isArray(ownerDraft.competitors) ? ownerDraft.competitors : [];
    setOwnerEdits((prev) => ({
      ...prev,
      competitors: current.map((competitor, i) =>
        i === index ? { ...(competitor || {}), [field]: value } : competitor
      ),
    }));
  };

  const goNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const buildAiDescription = () => {
    const market = Array.isArray(ownerDraft.target_market) ? ownerDraft.target_market.join(', ') : '';
    const platforms = Array.isArray(ownerDraft.platforms) ? ownerDraft.platforms.join(', ') : '';
    const competitors = Array.isArray(ownerDraft.competitors)
      ? ownerDraft.competitors
        .map((item) => (typeof item === 'string' ? item : item?.name || item?.website || ''))
        .filter(Boolean)
        .join(', ')
      : '';

    return [
      campaignData?.campaignName ? `Campaign name: ${campaignData.campaignName}` : null,
      `Campaign goal: ${campaignData.campaignGoal}`,
      campaignData?.startDate ? `Start date: ${campaignData.startDate}` : null,
      campaignData?.endDate ? `End date: ${campaignData.endDate}` : null,
      ownerDraft.brand_name ? `Brand name: ${ownerDraft.brand_name}` : null,
      ownerDraft.unique_selling_point ? `USP: ${ownerDraft.unique_selling_point}` : null,
      ownerDraft.product_or_service ? `Product/Service: ${ownerDraft.product_or_service}` : null,
      ownerDraft.industry ? `Industry: ${ownerDraft.industry}` : null,
      ownerDraft.company_size ? `Company size: ${ownerDraft.company_size}` : null,
      market ? `Target market: ${market}` : null,
      competitors ? `Competitors: ${competitors}` : null,
      ownerDraft.has_previous_campaigns ? 'Has previous campaigns: Yes' : 'Has previous campaigns: No',
      ownerDraft.has_previous_campaigns && ownerDraft.previous_campaign_description
        ? `Previous campaigns: ${ownerDraft.previous_campaign_description}`
        : null,
      ownerDraft.website ? `Website: ${ownerDraft.website}` : null,
      platforms ? `Platforms: ${platforms}` : null,
      ownerDraft.targetAudience?.gender ? `Audience gender: ${ownerDraft.targetAudience.gender}` : null,
      ownerDraft.targetAudience?.ageRange ? `Audience age: ${ownerDraft.targetAudience.ageRange}` : null,
      ownerDraft.targetAudience?.location ? `Audience location: ${ownerDraft.targetAudience.location}` : null,
    ]
      .filter(Boolean)
      .join(' | ');
  };

  const handleGenerate = async () => {
    const campaignDataForAi = {
      ...campaignData,
      startDate: campaignData?.startDate || campaignData?.start_date || null,
      endDate: campaignData?.endDate || campaignData?.end_date || null,
    };

    const requiredCampaignFields = [
      { key: 'campaignName', label: 'Campaign name', value: campaignDataForAi?.campaignName },
      { key: 'campaignGoal', label: 'Campaign goal', value: campaignDataForAi?.campaignGoal },
      { key: 'budget', label: 'Budget', value: campaignDataForAi?.budget },
      { key: 'currency', label: 'Currency', value: campaignDataForAi?.currency },
      { key: 'durationWeeks', label: 'Campaign weeks', value: campaignDataForAi?.durationWeeks },
    ];

    const requiredOwnerFields = [
      { key: 'brand_name', label: 'Brand name', value: ownerDraft.brand_name },
      { key: 'product_or_service', label: 'Product or service', value: ownerDraft.product_or_service },
      { key: 'industry', label: 'Industry', value: ownerDraft.industry },
      {
        key: 'target_market',
        label: 'Target market',
        value: Array.isArray(ownerDraft.target_market) ? ownerDraft.target_market : [],
      },
      { key: 'company_size', label: 'Campaign size', value: ownerDraft.company_size },
      { key: 'unique_selling_point', label: 'USP', value: ownerDraft.unique_selling_point },
    ];

    const isMissingValue = (value) => {
      if (Array.isArray(value)) {
        return value.length === 0;
      }

      if (typeof value === 'string') {
        return value.trim().length === 0;
      }

      return value === null || value === undefined;
    };

    const missingCampaignField = requiredCampaignFields.find((field) => isMissingValue(field.value));
    if (missingCampaignField) {
      toast.warn(`You must add (${missingCampaignField.label}) for more personalized campaign plan.`, {
        position: 'top-right',
        autoClose: 3500,
      });
      return;
    }

    const missingOwnerField = requiredOwnerFields.find((field) => isMissingValue(field.value));
    if (missingOwnerField) {
      toast.warn(`You must add (${missingOwnerField.label}) for more personalized campaign plan.`, {
        position: 'top-right',
        autoClose: 3500,
      });
      return;
    }

    if (!Number.isFinite(parsedWeeks) || parsedWeeks < 1) {
      toast.error('Campaign duration must be at least 1 week.');
      return;
    }

    setIsSubmitting(true);
    try {
      const ownerProfileForAi = {
        ...ownerDraft,
        targetAudience: {
          ageRange: ownerDraft.targetAudience?.ageRange || '',
          gender: ownerDraft.targetAudience?.gender || 'all',
          location: ownerDraft.targetAudience?.location || '',
        },
      };

      const { payload, response } = await aiCampaignApi.generateCampaignWithProfileContext({
        campaignData: campaignDataForAi,
        ownerProfile: ownerProfileForAi,
      });
      console.log("AI Campaign Response:", response);
      const success = response?.success || response?.status === 'success';
      if (!success) {
        throw new Error(response?.message || 'Failed to generate campaign');
      }

      toast.success('AI campaign generated successfully!', { position: 'top-right', autoClose: 3000 });
      navigate('/dashboard/owner/campaigns/generated', {
        state: {
          campaignData: payload,
          aiPreview: response?.data?.aiPreview,
        },
      });
      return;
    } catch (error) {
      toast.error(error?.message || 'Failed to generate campaign', { position: 'top-right', autoClose: 4000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!campaignData) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-gray-300">
        <p className="mb-4">No campaign data found. Start from campaign create page first.</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard/owner/campaigns/create')}
          className="px-5 py-2.5 rounded-xl bg-[#745CB4] hover:bg-[#9381C4] text-white"
        >
          Back to Create Campaign
        </button>
      </div>
    );
  }
console.log("campaignData", campaignData);
console.log("ownerDraft", ownerDraft);
console.log("compatators", campaignData?.competitors);
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#1e1632]/55 backdrop-blur-md px-6 py-6 shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Prepare Campaign with Profile Context</h1>
        <p className="text-gray-300 text-sm">
          AI will use this data to make more personalized campaigns. If you want to change something, do it before generating.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="space-y-3">
            {steps.map((step, index) => {
              const active = index === currentStep;
              const done = index < currentStep;
              return (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setCurrentStep(index)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${active
                      ? 'border-[#C1B6FD] bg-[#C1B6FD]/10'
                      : done
                        ? 'border-green-500/40 bg-green-500/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className="w-5 h-5 rounded-full bg-white/10 inline-flex items-center justify-center">
                      {done ? <CheckCircle2 className="w-3 h-3 text-green-300" /> : index + 1}
                    </span>
                    <span className="text-gray-300">Step {index + 1}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{step.title}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="xl:col-span-8 rounded-2xl border border-white/10 bg-[#1e1632]/80 p-6 space-y-5">
          {currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Campaign Inputs</h2>
              <p className="text-sm text-gray-400">{steps[0].description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-xs text-gray-400">Campaign Name</div>
                  <div className="text-white font-medium mt-1">{campaignData.campaignName}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-xs text-gray-400">Campaign Goal</div>
                  <div className="text-white font-medium mt-1">{campaignData.campaignGoal}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-xs text-gray-400">Budget</div>
                  <div className="text-white font-medium mt-1">{campaignData.currency} {campaignData.budget}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-xs text-gray-400">Currency</div>
                  <div className="text-white font-medium mt-1">{campaignData.currency}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-xs text-gray-400">Duration</div>
                  <div className="text-white font-medium mt-1">{campaignData.durationWeeks} week(s)</div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-white">Offer & Positioning</h2>
              <p className="text-sm text-gray-400">{steps[1].description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Product or Service</label>
                  <input
                    type="text"
                    value={ownerDraft.product_or_service}
                    onChange={(e) => updateOwnerField('product_or_service', e.target.value)}
                    placeholder="e.g. Skincare brand, SaaS app..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Brand Name</label>
                  <input
                    type="text"
                    value={ownerDraft.brand_name}
                    onChange={(e) => updateOwnerField('brand_name', e.target.value)}
                    placeholder="e.g. Glow Co."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-3">Industry</label>
                  <div className="flex flex-wrap gap-2">
                    {industryOptions.map((option) => {
                      const selected = ownerDraft.industry === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateOwnerField('industry', selected ? '' : option)}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                            selected
                              ? 'bg-[#C1B6FD]/20 border-[#C1B6FD]/60 text-[#E9E3FF]'
                              : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-3">Company Size</label>
                  <div className="flex flex-wrap gap-2">
                    {companySizeOptions.map((option) => {
                      const selected = ownerDraft.company_size === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateOwnerField('company_size', selected ? '' : option)}
                          className={`px-4 py-2 rounded-full text-xs border transition-all ${
                            selected
                              ? 'bg-[#C1B6FD]/20 border-[#C1B6FD]/60 text-[#E9E3FF]'
                              : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Unique Selling Point</label>
                  <textarea
                    value={ownerDraft.unique_selling_point}
                    onChange={(e) => updateOwnerField('unique_selling_point', e.target.value)}
                    placeholder="What makes your brand stand out?"
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Market & Competitors</h2>
              <p className="text-sm text-gray-400">{steps[2].description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Target Market</label>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex flex-wrap gap-2">
                      {targetMarketOptions.map((market) => {
                        const selected = (ownerDraft.target_market || []).includes(market);
                        return (
                          <button
                            key={market}
                            type="button"
                            onClick={() => toggleOwnerArrayValue('target_market', market)}
                            className={`px-3 py-1.5 rounded-full text-xs border transition ${selected
                                ? 'bg-[#C1B6FD]/20 border-[#C1B6FD]/60 text-[#E9E3FF]'
                                : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'
                              }`}
                          >
                            {market}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-3">Previous Campaigns</label>
                  <div className="flex gap-2">
                    {[{ label: 'No previous campaigns', value: false }, { label: 'Has previous campaigns', value: true }].map((opt) => {
                      const selected = ownerDraft.has_previous_campaigns === opt.value;
                      return (
                        <button
                          key={String(opt.value)}
                          type="button"
                          onClick={() => updateOwnerField('has_previous_campaigns', opt.value)}
                          className={`px-4 py-2 rounded-full text-xs border transition-all ${
                            selected
                              ? 'bg-[#C1B6FD]/20 border-[#C1B6FD]/60 text-[#E9E3FF]'
                              : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {ownerDraft.has_previous_campaigns && (
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-300 mb-2">Previous Campaign Description</label>
                    <textarea
                      value={ownerDraft.previous_campaign_description}
                      onChange={(e) => updateOwnerField('previous_campaign_description', e.target.value)}
                      rows={3}
                      placeholder="Describe your previous campaigns"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 resize-none"
                    />
                  </div>
                )}

                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-300">Competitors</p>
                    <button
                      type="button"
                      onClick={addCompetitor}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white"
                    >
                      Add Competitor
                    </button>
                  </div>

                  {(Array.isArray(ownerDraft.competitors) ? ownerDraft.competitors : []).map((competitor, index) => (
                    <div key={`competitor-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-white/5 border border-white/10 rounded-xl p-3">
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Competitor Name</label>
                        <input
                          type="text"
                          value={competitor?.name || ''}
                          onChange={(e) => updateCompetitor(index, 'name', e.target.value)}
                          placeholder="Name"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Competitor Website</label>
                        <input
                          type="text"
                          value={competitor?.website || ''}
                          onChange={(e) => updateCompetitor(index, 'website', e.target.value)}
                          placeholder="Website"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-300 mb-1">Notes</label>
                          <input
                            type="text"
                            value={competitor?.notes || ''}
                            onChange={(e) => updateCompetitor(index, 'notes', e.target.value)}
                            placeholder="Notes"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCompetitor(index)}
                          className="mt-6 px-3 py-2 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Channels & Audience</h2>
              <p className="text-sm text-gray-400">{steps[3].description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Website</label>
                  <input
                    type="text"
                    value={ownerDraft.website || ''}
                    onChange={(e) => updateOwnerField('website', e.target.value)}
                    placeholder="https://yourbrand.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Platforms</label>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex flex-wrap gap-2">
                      {platformOptions.map((platform) => {
                        const selected = (ownerDraft.platforms || []).includes(platform);
                        return (
                          <button
                            key={platform}
                            type="button"
                            onClick={() => toggleOwnerArrayValue('platforms', platform)}
                            className={`px-3 py-1.5 rounded-full text-xs border transition ${selected
                                ? 'bg-[#C1B6FD]/20 border-[#C1B6FD]/60 text-[#E9E3FF]'
                                : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'
                              }`}
                          >
                            {platform}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Audience Gender</label>
                  <input
                    type="text"
                    value={ownerDraft.targetAudience?.gender || ''}
                    onChange={(e) => updateAudience('gender', e.target.value)}
                    placeholder="e.g. Female, Male, All"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Audience Age Range</label>
                  <input
                    type="text"
                    value={ownerDraft.targetAudience?.ageRange || ''}
                    onChange={(e) => updateAudience('ageRange', e.target.value)}
                    placeholder="e.g. 18-34"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Audience Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(e) => {
                        setLocationQuery(e.target.value);
                        setIsLocationOpen(true);
                      }}
                      onFocus={() => setIsLocationOpen(true)}
                      onBlur={() => setTimeout(() => setIsLocationOpen(false), 120)}
                      placeholder="Search locations"
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300"
                    />
                    {isLocationOpen && (
                      <div className="absolute top-full mt-2 w-full z-20 bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
                        {filteredLocations.length > 0 ? (
                          filteredLocations.map((loc) => {
                            const selected = ownerDraft.targetAudience?.location === loc;
                            return (
                              <button
                                key={loc}
                                type="button"
                                onClick={() => {
                                  updateAudience('location', selected ? '' : loc);
                                  setLocationQuery('');
                                  setIsLocationOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                              >
                                <span className="flex items-center justify-between">
                                  {loc}
                                  {selected && <CheckCircle2 className="w-4 h-4 text-[#C1B6FD]" />}
                                </span>
                              </button>
                            );
                          })
                        ) : (
                          <p className="px-4 py-3 text-sm text-gray-400">No options found</p>
                        )}
                      </div>
                    )}
                  </div>
                  {ownerDraft.targetAudience?.location && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => updateAudience('location', '')}
                        className="px-3 py-1.5 rounded-full text-xs border border-[#C1B6FD]/40 bg-[#C1B6FD]/10 text-[#E0DAFF]"
                      >
                        {ownerDraft.targetAudience.location} x
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Review & Generate</h2>
              <p className="text-sm text-gray-400">{steps[4].description}</p>
              <div>
                <label className="block text-sm text-gray-300 mb-2">AI Input Summary</label>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-200 leading-7">
                  {buildAiDescription()}
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={currentStep === 0 ? () => navigate('/dashboard/owner/campaigns/create') : goBack}
              className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {currentStep === 0 ? 'Back to Form' : 'Back'}
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="px-5 py-2.5 rounded-xl bg-[#745CB4] hover:bg-[#9381C4] text-white inline-flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white inline-flex items-center gap-2 disabled:opacity-60"
              >
                <Sparkles className="w-4 h-4" />
                {isSubmitting ? 'Generating...' : 'Generate Personalized Campaign'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrepareCampaign;
