/**
 * Maps AI pipeline response + campaign form + brand tone into POST /campaigns/save payload.
 */

const VALID_KPI_METRICS = new Set([
  'impressions', 'reach', 'engagement_rate', 'conversions', 'ROAS', 'CPA', 'CTR',
]);

const KPI_METRIC_ALIASES = {
  Impressions: 'impressions',
  Reach: 'reach',
  'Engagement Rate': 'engagement_rate',
  Engagement: 'engagement_rate',
  Conversions: 'conversions',
  ROAS: 'ROAS',
  CPA: 'CPA',
  CTR: 'CTR',
  'Click-Through Rate': 'CTR',
};

const extractKpis = (kpisFromAI = []) => {
  if (!Array.isArray(kpisFromAI)) return [];
  return kpisFromAI
    .map((kpi) => {
      const rawMetric = kpi.metric || kpi.name || '';
      const metric = KPI_METRIC_ALIASES[rawMetric] || rawMetric.toLowerCase().replace(/\s+/g, '_');
      if (!VALID_KPI_METRICS.has(metric)) return null;

      let targetValue = 0;
      if (typeof kpi.targetValue === 'number') {
        targetValue = kpi.targetValue;
      } else if (typeof kpi.target === 'string') {
        const parsed = parseFloat(kpi.target.replace(/[^0-9.]/g, ''));
        targetValue = Number.isFinite(parsed) ? parsed : 0;
      }

      return { metric, targetValue };
    })
    .filter(Boolean);
};

const VALID_CONTENT_TYPES = new Set(['video', 'carousel', 'story', 'reel', 'post', 'article']);
const PLATFORM_CONTENT_TYPE_MAP = {
  TikTok: 'reel',
  Instagram: 'reel',
  Facebook: 'post',
  LinkedIn: 'article',
  YouTube: 'video',
  Twitter: 'post',
};

const extractContentCalendar = (calendarFromAI = {}) => {
  const days = calendarFromAI?.days || [];
  if (!Array.isArray(days) || days.length === 0) return [];

  return days
    .filter((item) => item && item.day && item.date)
    .map((item) => {
      const platform = item.channel || item.platform || 'Instagram';
      const rawType = item.contentType || PLATFORM_CONTENT_TYPE_MAP[platform] || 'post';
      const contentType = VALID_CONTENT_TYPES.has(rawType) ? rawType : 'post';
      const task = Array.isArray(item.tasks) ? item.tasks[0] : (item.task || '');

      return {
        day: Number(item.day),
        date: item.date,
        platform,
        contentType,
        caption: item.caption || '',
        mediaUrl: item.mediaUrl || null,
        task,
        status: 'scheduled',
      };
    })
    .filter((item) => !Number.isNaN(item.day) && item.date);
};

const VALID_GENDERS = new Set(['all', 'male', 'female', 'custom']);

const extractTargetAudience = ({ strategy, ownerDraft }) => {
  const ageRange = strategy?.age_range
    || ownerDraft?.targetAudience?.ageRange
    || '18-34';
  const rawGender = (strategy?.gender_skew || ownerDraft?.targetAudience?.gender || 'all').toLowerCase();
  const gender = VALID_GENDERS.has(rawGender)
    ? rawGender
    : rawGender.includes('male')
      ? 'male'
      : rawGender.includes('female')
        ? 'female'
        : 'all';

  const interests = strategy?.pain_points || strategy?.desires || [];
  const platformsUsed = ownerDraft?.platforms || [];

  return {
    ageRange,
    gender,
    interests: Array.isArray(interests) ? interests : [],
    platformsUsed: Array.isArray(platformsUsed) ? platformsUsed : [],
  };
};

const normaliseBrandTone = (brandTone) => {
  if (!brandTone) return null;
  return {
    tone_formality: Number(brandTone.tone_formality) || 3,
    tone_playfulness: Number(brandTone.tone_playfulness) || 3,
    tone_boldness: Number(brandTone.tone_boldness) || 3,
    preferred_vocabulary: Array.isArray(brandTone.preferred_vocabulary)
      ? brandTone.preferred_vocabulary
      : [],
    avoided_vocabulary: Array.isArray(brandTone.avoided_vocabulary)
      ? brandTone.avoided_vocabulary
      : [],
  };
};

/**
 * @param {object} options
 * @param {object} options.campaignData
 * @param {object} options.ownerDraft
 * @param {object} options.aiResponse
 * @param {boolean} [options.isPublished=false]
 */
export const buildSaveCampaignPayload = ({
  campaignData,
  ownerDraft,
  aiResponse,
  isPublished = false,
}) => {
  const strategy = aiResponse?.strategy || {};
  const calendar = aiResponse?.calendar || {};
  const brandToneRaw = ownerDraft?.brand_tone || ownerDraft?.brandTone || null;
  const normalisedBrandTone = normaliseBrandTone(brandToneRaw);

  const GOAL_MAP = {
    'Brand Awareness': 'Awareness',
    Awareness: 'Awareness',
    'Lead Generation': 'Leads',
    Leads: 'Leads',
    Sales: 'Sales',
    Engagement: 'Engagement',
    Traffic: 'Awareness',
    Retention: 'Retention',
    'Re-engagement': 'Re-engagement',
  };

  const campaign_goal = GOAL_MAP[campaignData?.campaignGoal] || GOAL_MAP[campaignData?.campaign_goal] || 'Awareness';
  const budget_amount = parseFloat(campaignData?.budget ?? campaignData?.budget_amount) || 0;
  const budget_currency = campaignData?.currency || campaignData?.budget_currency || 'USD';
  const campaign_duration_weeks = parseInt(campaignData?.durationWeeks ?? campaignData?.campaign_duration_weeks, 10) || 4;
  const startDate = campaignData?.startDate || null;
  const endDate = campaignData?.endDate || null;

  const targetMarket = ownerDraft?.target_market;
  const briefTargetMarket = Array.isArray(targetMarket)
    ? targetMarket
    : typeof targetMarket === 'string' && targetMarket.trim()
      ? targetMarket.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

  const kpis = extractKpis(strategy?.kpis || []);
  const contentCalendar = extractContentCalendar(calendar);
  const targetAudience = extractTargetAudience({ strategy, ownerDraft });

  const aiVersion = {
    versionNumber: 1,
    generatedAt: new Date().toISOString(),
    strategy,
    execution: strategy?.tactical_plan || null,
    estimations: {
      ml_score: strategy?.ml_score || null,
      ml_verdict: strategy?.ml_verdict || null,
      predicted_roi: strategy?.predicted_roi || null,
    },
    isActive: true,
  };

  return {
    campaignName: campaignData?.campaignName || campaignData?.campaign_name || 'Untitled Campaign',
    campaign_goal,
    budget_amount,
    budget_currency,
    campaign_duration_weeks,
    startDate,
    endDate,
    isPublished,
    brandTone: normalisedBrandTone,
    targetAudience,
    kpis,
    contentCalendar,
    aiVersion,
  };
};
