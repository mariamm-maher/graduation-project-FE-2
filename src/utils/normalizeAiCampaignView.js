/**
 * Maps FastAPI /generate response into a stable view model for Generated Campaign UI.
 */

const formatCategoryLabel = (key) =>
  String(key)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

const mapCalendarDay = (day, index) => ({
  day: day.day ?? index + 1,
  date: day.date || day.scheduled_date || '',
  platform: (day.channel || day.platform || 'instagram').toLowerCase(),
  contentType: day.contentType || day.content_type || 'post',
  task: Array.isArray(day.tasks) ? day.tasks[0] : (day.task || ''),
  caption: day.caption || day.hook || '',
  hashtags: day.hashtags || day.hashtag_set || [],
  status: day.status || 'scheduled',
});

/**
 * Prefer raw API calendar; fall back to normalized execution.contentCalendar.
 */
export function resolveAiCalendarFromState({ calendar, aiPreview } = {}) {
  if (Array.isArray(calendar?.days) && calendar.days.length > 0) {
    return calendar;
  }

  const items = aiPreview?.execution?.contentCalendar;
  const meta = aiPreview?.execution?.calendar_meta || {};

  if (Array.isArray(items) && items.length > 0) {
    return {
      days: items.map((item, index) => ({
        day: item.day ?? index + 1,
        date: item.date || '',
        platform: (item.platform || 'instagram').toLowerCase(),
        content_type: item.contentType || item.content_type || 'post',
        task: item.task || '',
        caption: item.caption || '',
        status: item.status || 'scheduled',
      })),
      start_date: meta.start_date || items[0]?.date || '',
      total_days: meta.total_days ?? items.length,
    };
  }

  return calendar || { days: [] };
}

/**
 * When calendar.days is empty, build overview rows from tactical_plan.
 */
const buildCalendarFromTacticalPlan = (tactical = {}, calendarMeta = {}) => {
  const items = [];
  const platformContent = tactical.platform_content || {};
  const postingFrequency = tactical.posting_frequency || {};

  Object.entries(platformContent).forEach(([platform, content], platformIndex) => {
    const freq = postingFrequency[platform] || 3;
    const visualDirections = content?.visual_directions || content?.visual_direction || [];
    const captionIdeas = content?.caption_ideas || content?.captions || [];

    items.push({
      day: platformIndex + 1,
      date: calendarMeta.start_date || '',
      platform,
      contentType: content?.content_type || content?.format || 'post',
      task: `Post ${freq}x/week on ${platform}`,
      caption: captionIdeas[0] || content?.theme || content?.description || '',
      status: 'planned',
      isOverview: true,
    });

    if (Array.isArray(visualDirections) && visualDirections.length > 0) {
      visualDirections.slice(0, 2).forEach((direction, i) => {
        items.push({
          day: `${platformIndex + 1}.${i + 1}`,
          date: calendarMeta.start_date || '',
          platform,
          contentType: 'creative',
          task: typeof direction === 'string' ? direction : direction?.title || 'Visual direction',
          caption: typeof direction === 'string' ? '' : direction?.description || '',
          status: 'planned',
          isOverview: true,
        });
      });
    }
  });

  if (items.length === 0 && Array.isArray(tactical.content_creation_checklist)) {
    tactical.content_creation_checklist.forEach((task, i) => {
      items.push({
        day: i + 1,
        date: calendarMeta.start_date || '',
        platform: 'All',
        contentType: 'task',
        task,
        caption: '',
        status: 'planned',
        isOverview: true,
      });
    });
  }

  return items;
};

/**
 * Flat { paid_ads: 45, ... } → breakdown array with amounts.
 * Handles both percentage values (45) and absolute amounts (3000).
 */
const normalizeBudgetAllocation = (raw, budgetAmount = 0) => {
  if (!raw) return null;

  if (raw.breakdown && Array.isArray(raw.breakdown)) {
    return {
      totalAllocated: raw.totalAllocated ?? budgetAmount,
      breakdown: raw.breakdown,
    };
  }

  if (typeof raw === 'object' && !Array.isArray(raw)) {
    const entries = Object.entries(raw).filter(([, value]) => typeof value === 'number');

    // Check if values are absolute amounts (sum close to budgetAmount) or percentages
    const sumOfValues = entries.reduce((sum, [, value]) => sum + value, 0);
    const isAbsoluteAmounts = budgetAmount > 0 && Math.abs(sumOfValues - budgetAmount) < budgetAmount * 0.1;

    const breakdown = entries.map(([category, value]) => {
      if (isAbsoluteAmounts) {
        // Values are absolute amounts, calculate percentage
        const percentage = budgetAmount > 0 ? Math.round((value / budgetAmount) * 100) : 0;
        return {
          category,
          amount: value,
          percentage,
        };
      } else {
        // Values are percentages, calculate amount
        const amount = budgetAmount ? Math.round((budgetAmount * value) / 100) : 0;
        return {
          category,
          percentage: value,
          amount,
        };
      }
    });

    return {
      totalAllocated: budgetAmount || breakdown.reduce((sum, row) => sum + row.amount, 0),
      breakdown,
    };
  }

  return null;
};

const normalizePlatformSelection = (strategy) => {
  if (Array.isArray(strategy?.platformSelection) && strategy.platformSelection.length > 0) {
    return strategy.platformSelection;
  }

  const summary = strategy?.campaign_summary || {};
  const channelMix = summary.channel_mix || strategy?.channel_mix || [];

  if (!Array.isArray(channelMix) || channelMix.length === 0) return [];

  const rationale = summary.tone_of_voice || strategy?.positioning_statement || '';

  return channelMix.map((entry, index) => {
    const platform = typeof entry === 'string' ? entry : entry.platform;
    return {
      platform,
      priority: index === 0 ? 'primary' : 'secondary',
      rationale,
      audienceMatchScore: Math.max(60, 92 - index * 8),
    };
  });
};

/**
 * @param {object} params
 * @param {object} params.strategy
 * @param {object} [params.calendar]
 * @param {Array} [params.influencer_matches]
 * @param {string} [params.influencer_strategy_note]
 * @param {number} [params.budgetAmount]
 */
export function normalizeAiCampaignView({
  strategy = {},
  calendar = {},
  influencer_matches = [],
  influencer_strategy_note = '',
  budgetAmount = 0,
}) {
  const summary = strategy.campaign_summary || {};
  const tactical = strategy.tactical_plan || {};

  const campaignSummary =
    strategy.core_message
    || strategy.positioning_statement
    || (typeof strategy.campaignSummary === 'string' ? strategy.campaignSummary : '')
    || summary.campaign_theme
    || '';

  const calendarDays = Array.isArray(calendar?.days) ? calendar.days : [];
  const contentCalendar = calendarDays.length > 0
    ? calendarDays.map(mapCalendarDay)
    : buildCalendarFromTacticalPlan(tactical, calendar);

  const durationWeeks = summary.duration_weeks
    || strategy.duration_weeks
    || (calendar?.total_days ? Math.ceil(calendar.total_days / 7) : null);

  return {
    strategy: {
      ...strategy,
      campaignSummary,
      campaign_summary: summary,
      campaign_theme: summary.campaign_theme,
      tone_of_voice: summary.tone_of_voice || summary.toneOfVoice,
      target_audience_text: summary.target_audience || summary.targetAudience,
      channel_mix: summary.channel_mix || [],
      platformSelection: normalizePlatformSelection(strategy),
      budgetAllocation: normalizeBudgetAllocation(
        strategy.budget_allocation || strategy.budgetAllocation,
        budgetAmount,
      ),
      content_pillars: strategy.content_pillars || [],
      campaign_hooks: strategy.campaign_hooks || [],
      funnel: strategy.funnel || null,
      core_message: strategy.core_message,
      positioning_statement: strategy.positioning_statement,
    },
    execution: {
      contentCalendar,
      tactical_plan: tactical,
      platform_content: tactical.platform_content || {},
      posting_frequency: tactical.posting_frequency || {},
      content_creation_checklist: tactical.content_creation_checklist || [],
      campaign_hashtags: tactical.campaign_hashtag_set || [],
      calendar_meta: {
        start_date: calendar.start_date,
        total_days: calendar.total_days,
        duration_weeks: durationWeeks,
        isOverviewCalendar: calendarDays.length === 0 && contentCalendar.length > 0,
      },
    },
    influencer_matches: influencer_matches || [],
    influencer_strategy_note:
      influencer_strategy_note
      || strategy.influencer_strategy_note
      || '',
    durationWeeks,
  };
}

/**
 * Build aiPreview object for navigation state.
 */
export function buildAiPreviewFromResponse(response, { budgetAmount = 0 } = {}) {
  const view = normalizeAiCampaignView({
    strategy: response?.strategy || {},
    calendar: response?.calendar || {},
    influencer_matches: response?.influencer_matches || [],
    influencer_strategy_note: response?.influencer_strategy_note || '',
    budgetAmount,
  });

  return {
    strategy: view.strategy,
    execution: view.execution,
    estimations: null, // filled by buildEstimationsFromStrategy separately
    influencer_matches: view.influencer_matches,
    influencer_strategy_note: view.influencer_strategy_note,
    generatedAt: new Date().toISOString(),
  };
}
