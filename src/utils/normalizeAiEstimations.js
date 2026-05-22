/**
 * Normalizes FastAPI strategy KPIs for Generated Campaign UI.
 * Supports legacy objects with estimatedRange and new string[] KPIs.
 */

const inferMetricFromText = (text) => {
  const lower = String(text).toLowerCase();
  if (lower.includes('reach')) return 'reach';
  if (lower.includes('impression')) return 'impressions';
  if (lower.includes('engagement')) return 'engagement_rate';
  if (lower.includes('conversion') || lower.includes('purchase') || lower.includes('order')) return 'conversions';
  if (lower.includes('ctr') || lower.includes('click-through') || lower.includes('click through')) return 'CTR';
  if (lower.includes('roas')) return 'ROAS';
  if (lower.includes('cpa')) return 'CPA';
  if (lower.includes('follower')) return 'reach';
  if (lower.includes('subscriber') || lower.includes('email')) return 'conversions';
  return 'Goal';
};

const parseFirstNumber = (text) => {
  const match = String(text).replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
};

/**
 * @param {unknown} kpis
 * @returns {Array<{ metric: string, label: string, displayValue: string | number, min?: number, max?: number, isTextKpi: boolean }>}
 */
export function normalizeEstimatedMetrics(kpis) {
  if (!Array.isArray(kpis)) return [];

  return kpis.map((item, index) => {
    if (typeof item === 'string') {
      const metric = inferMetricFromText(item);
      return {
        metric,
        label: metric === 'Goal' ? `Goal ${index + 1}` : metric,
        displayValue: item,
        isTextKpi: true,
      };
    }

    if (item && typeof item === 'object') {
      const range = item.estimatedRange || item.range;
      const metricKey = item.metric || item.name || inferMetricFromText(item.target || item.label || '');

      if (range && (range.mostLikely != null || range.min != null || range.max != null)) {
        return {
          metric: metricKey,
          label: metricKey,
          displayValue: range.mostLikely ?? range.min ?? 0,
          min: range.min,
          max: range.max,
          isTextKpi: false,
        };
      }

      const text = item.target || item.label || item.description || JSON.stringify(item);
      return {
        metric: metricKey,
        label: metricKey,
        displayValue: text,
        isTextKpi: true,
      };
    }

    return {
      metric: 'Goal',
      label: 'Goal',
      displayValue: String(item ?? ''),
      isTextKpi: true,
    };
  });
}

/**
 * Build estimations block for Generated Campaign sidebar / preview.
 * @param {object} strategy
 */
export function buildEstimationsFromStrategy(strategy = {}) {
  const metrics = normalizeEstimatedMetrics(strategy?.kpis || []);
  const mlScore = strategy?.ml_score;
  const confidenceLevel = mlScore != null && Number.isFinite(Number(mlScore))
    ? Math.min(100, Math.round(Number(mlScore) <= 1 ? Number(mlScore) * 100 : Number(mlScore)))
    : null;

  return {
    estimatedResults: {
      metrics,
      scenario: strategy?.ml_verdict || strategy?.campaign_summary?.scenario || null,
      confidenceLevel,
    },
    ml_score: strategy?.ml_score ?? null,
    ml_verdict: strategy?.ml_verdict ?? null,
  };
}

/**
 * Parse string KPIs for save payload (metric + targetValue).
 * @param {unknown[]} kpisFromAI
 */
export function extractKpisFromStrategy(kpisFromAI = []) {
  if (!Array.isArray(kpisFromAI)) return [];

  const VALID = new Set(['impressions', 'reach', 'engagement_rate', 'conversions', 'ROAS', 'CPA', 'CTR']);

  return kpisFromAI
    .map((kpi) => {
      if (typeof kpi === 'string') {
        const metric = inferMetricFromText(kpi);
        if (!VALID.has(metric)) return null;
        const targetValue = parseFirstNumber(kpi) ?? 0;
        return { metric, targetValue };
      }

      if (kpi && typeof kpi === 'object') {
        const rawMetric = kpi.metric || kpi.name || inferMetricFromText(kpi.target || '');
        const metric = VALID.has(rawMetric) ? rawMetric : inferMetricFromText(rawMetric);
        if (!VALID.has(metric)) return null;

        let targetValue = 0;
        if (typeof kpi.targetValue === 'number') {
          targetValue = kpi.targetValue;
        } else if (kpi.estimatedRange?.mostLikely != null) {
          targetValue = Number(kpi.estimatedRange.mostLikely) || 0;
        } else if (typeof kpi.target === 'string') {
          targetValue = parseFirstNumber(kpi.target) ?? 0;
        }

        return { metric, targetValue };
      }

      return null;
    })
    .filter(Boolean);
}
