/**
 * Constructs the campaign save payload from the current editor context.
 *
 * @param {object} context
 * @param {boolean} context.isEditing       - Whether the user is in edit mode
 * @param {object|null} context.editData    - Edited form data (used when isEditing is true)
 * @param {object} context.normalizedInput  - Normalized original campaign input
 * @param {object} context.campaignData     - Raw campaign data from location state
 * @param {object} context.campaignDates    - { startDate, endDate } ISO strings
 * @param {object} context.strategy         - AI strategy block
 * @param {object} context.execution        - AI execution block
 * @param {object} context.estimations      - AI estimations block
 * @param {string} context.generatedAt      - ISO timestamp of AI generation
 * @param {object} [extra={}]               - Extra fields to merge (e.g. lifecycleStage, isPublished)
 * @returns {object} Campaign payload ready for the store save methods
 */
const VALID_KPI_METRICS = ['impressions', 'reach', 'engagement_rate', 'conversions', 'ROAS', 'CPA', 'CTR'];

const KPI_METRIC_MAP = {
  impressions:      'impressions',
  impression:       'impressions',
  reach:            'reach',
  'engagement rate': 'engagement_rate',
  'engagement_rate': 'engagement_rate',
  engagement:       'engagement_rate',
  conversions:      'conversions',
  conversion:       'conversions',
  roas:             'ROAS',
  'return on ad spend': 'ROAS',
  cpa:              'CPA',
  'cost per acquisition': 'CPA',
  'cost per action': 'CPA',
  ctr:              'CTR',
  'click-through rate': 'CTR',
  'click through rate': 'CTR',
  clicks:           'CTR',
};

export function normalizeKpiMetric(raw) {
  if (!raw) return null;
  const key = String(raw).toLowerCase().trim();
  const mapped = KPI_METRIC_MAP[key];
  if (mapped) return mapped;
  const directMatch = VALID_KPI_METRICS.find(v => v.toLowerCase() === key);
  return directMatch || null;
}

export const KPI_DISPLAY_LABELS = {
  impressions:      'Impressions',
  reach:            'Reach',
  engagement_rate:  'Engagement Rate',
  conversions:      'Conversions',
  ROAS:             'ROAS',
  CPA:              'CPA',
  CTR:              'CTR',
};

export function buildCampaignPayload(
  { isEditing, editData, normalizedInput, campaignData, campaignDates, strategy, execution, estimations, generatedAt },
  extra = {}
) {
  const source = isEditing && editData ? editData : normalizedInput;

  return {
    campaignName: source.campaign_name || campaignData.campaignName || source.brand_name || 'Generated Campaign',
    goalType: source.campaign_goal,
    totalBudget: source.budget_amount,
    currency: source.budget_currency,
    campaign_duration_weeks: source.campaign_duration_weeks,
    startDate: campaignDates.startDate,
    endDate: campaignDates.endDate,

    targetAudience: {
      ageRange: campaignData.targetAudience?.ageRange || '',
      gender: campaignData.targetAudience?.gender || 'all',
      interests: campaignData.targetAudience?.interests || [],
      platformsUsed: strategy?.platformSelection?.map(p => p.platform.toLowerCase()) || [],
    },

    kpis: (estimations?.estimatedResults?.metrics ?? [])
      .map(m => {
        const metric = normalizeKpiMetric(m.metric);
        if (!metric) return null;
        return { metric, targetValue: String(m.estimatedRange?.mostLikely ?? '') };
      })
      .filter(Boolean),

    contentCalendar: execution?.contentCalendar || [],

    aiVersion: {
      versionNumber: 1,
      generatedAt: generatedAt || new Date().toISOString(),
      strategy: strategy || {},
      execution: execution || {},
      estimations: estimations || {},
      isActive: true,
    },

    ...extra,
  };
}
