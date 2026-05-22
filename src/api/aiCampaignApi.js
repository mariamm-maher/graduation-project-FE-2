import axios from 'axios';
import { normalizePlatformValue } from '../utils/platformUtils';

/** Maps UI goal labels to backend CampaignBrief Literal (case-sensitive). */
export const GOAL_MAP = {
  'Brand Awareness': 'Awareness',
  Awareness: 'Awareness',
  'Lead Generation': 'Leads',
  Leads: 'Leads',
  Sales: 'Sales',
  Engagement: 'Engagement',
  Traffic: 'Traffic',
  Retention: 'Retention',
};

const normalisePlatform = (p) => {
  if (p === 'X (Twitter)' || p === 'X' || p === 'Twitter (X)') return 'Twitter';
  const fromStore = normalizePlatformValue(p);
  if (fromStore) {
    const aiLabels = {
      instagram: 'Instagram',
      facebook: 'Facebook',
      twitter: 'Twitter',
      linkedin: 'LinkedIn',
      tiktok: 'TikTok',
      youtube: 'YouTube',
    };
    return aiLabels[fromStore] || p;
  }
  return p;
};

const normaliseCompetitors = (rawList) => {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .filter((c) => c && typeof c.name === 'string' && c.name.trim().length > 0)
    .map((c) => ({
      name: c.name.trim(),
      platforms: Array.isArray(c.platforms) ? c.platforms.map(normalisePlatform) : [],
      notes: typeof c.notes === 'string' ? c.notes.trim() : '',
    }));
};

/**
 * @param {{ ownerDraft: Record<string, unknown>, campaignData: Record<string, unknown>, campaignGoalDetails?: string }} args
 */
export const buildCampaignBriefPayload = ({
  ownerDraft,
  campaignData,
  campaignGoalDetails = '',
}) => {
  const draft = ownerDraft || {};
  const cd = campaignData || {};

  const rawTone = draft.brand_tone;
  const brand_tone = rawTone
    ? {
        tone_formality: rawTone.tone_formality ?? 3,
        tone_playfulness: rawTone.tone_playfulness ?? 3,
        tone_boldness: rawTone.tone_boldness ?? 3,
        preferred_vocabulary: Array.isArray(rawTone.preferred_vocabulary)
          ? rawTone.preferred_vocabulary
          : [],
        avoided_vocabulary: Array.isArray(rawTone.avoided_vocabulary)
          ? rawTone.avoided_vocabulary
          : [],
      }
    : null;

  const budgetRaw = cd.budget ?? cd.budget_amount;
  const currency = cd.currency ?? cd.budget_currency ?? 'USD';
  const weeksRaw = cd.durationWeeks ?? cd.campaign_duration_weeks;
  const campaignGoalKey = cd.campaignGoal ?? cd.campaign_goal;

  const platformList = draft.platforms || draft.current_channels || [];

  return {
    job_id: undefined,
    brand_name: draft.brand_name?.trim() || '',
    product_or_service: draft.product_or_service?.trim() || '',
    industry: draft.industry || '',
    sub_industry: draft.sub_industry?.trim() || null,
    target_market: Array.isArray(draft.target_market)
      ? draft.target_market.join(', ')
      : draft.target_market?.trim() || '',
    company_size: draft.company_size || 'Small',
    campaign_goal: GOAL_MAP[campaignGoalKey] || 'Awareness',
    campaign_goal_details: campaignGoalDetails?.trim() || null,
    budget_amount: parseFloat(String(budgetRaw).replace(/,/g, '')) || 0,
    budget_currency: currency || 'USD',
    campaign_duration_weeks: parseInt(weeksRaw, 10) || 4,
    start_date: cd.startDate || cd.start_date || null,
    unique_selling_point: draft.unique_selling_point?.trim() || '',
    current_channels: (Array.isArray(platformList) ? platformList : [])
      .map(normalisePlatform)
      .filter(Boolean),
    competitors: normaliseCompetitors(draft.competitors),
    has_previous_campaigns: Boolean(draft.has_previous_campaigns),
    previous_campaign_description: draft.previous_campaign_description?.trim() || null,
    brand_tone,
  };
};

export const buildAiGeneratePayload = ({ campaignData, ownerProfile, campaignGoalDetails = '' }) =>
  buildCampaignBriefPayload({
    ownerDraft: ownerProfile || {},
    campaignData: campaignData || {},
    campaignGoalDetails,
  });

function handleAiGenerateError(error) {
  if (error.response) {
    const status = error.response.status;
    const detail = error.response.data?.detail;

    if (status === 422) {
      const fieldErrors = Array.isArray(detail)
        ? detail.map((e) => `${e.loc?.join('.')} — ${e.msg}`).join('\n')
        : JSON.stringify(detail);
      console.error('❌ 422 Validation error:\n' + fieldErrors);
      throw new Error(`Validation failed:\n${fieldErrors}`);
    }

    console.error(`❌ ${status} error:`, detail);
    throw new Error(`Server error ${status}: ${JSON.stringify(detail)}`);
  }

  if (error.request) {
    console.error('❌ Network error — is the FastAPI server running on port 8000?');
    throw new Error('Cannot reach AI engine. Make sure the FastAPI server is running.');
  }

  console.error('❌ Unexpected error:', error.message);
  throw error;
}

const API_BASE = 'http://localhost:8000';
const aiCampaignApi = {
  generateCampaignWithProfileContext: async ({ campaignData, ownerProfile, campaignGoalDetails }) => {
    const payload = buildAiGeneratePayload({ campaignData, ownerProfile, campaignGoalDetails });
    console.log('📦 Full payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post(`${API_BASE}/generate`, payload);
      console.log('✅ Response:', response.data);
      return { payload, response: response.data };
    } catch (error) {
      handleAiGenerateError(error);
    }
  },

  generateWithPayload: async (payload) => {
    console.log('📦 Direct payload:', JSON.stringify(payload, null, 2));
    try {
      const response = await axios.post(`${API_BASE}/generate`, payload);
      console.log('✅ Response:', response.data);
      return { payload, response: response.data };
    } catch (error) {
      handleAiGenerateError(error);
    }
  },
};

export default aiCampaignApi;
