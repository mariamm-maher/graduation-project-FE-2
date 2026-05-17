/**
 * Demo / offline analytics step for simulated channels.
 * @param {object} channel - Channel with platform, platformData.isSimulated, etc.
 * @param {object} [previousAnalytics]
 * @returns {object|null} analytics payload or null when not simulated
 */
function buildSimulatedAnalytics(previousAnalytics = {}) {
  const prevReach =
    typeof previousAnalytics?.reach === 'number' && previousAnalytics.reach > 0
      ? previousAnalytics.reach
      : Math.floor(500 + Math.random() * 4500);
  const base = Math.round(prevReach * 1.03);

  return {
    likes: Math.max(1, Math.round(base * 0.025)),
    comments: Math.max(1, Math.round(base * 0.005)),
    shares: Math.max(1, Math.round(base * 0.003)),
    reach: base,
    impressions: Math.round(base * (1.05 + Math.random() * 0.15)),
    note: 'simulated',
  };
}

export function syncAnalytics(channel, previousAnalytics = {}) {
  const platform = (channel?.platform || '').toLowerCase();
  const isSimulated =
    channel?.platformData?.isSimulated === true || channel?.isSimulated === true;

  if (!isSimulated) {
    return null;
  }

  if (platform === 'tiktok' && isSimulated) {
    return buildSimulatedAnalytics(previousAnalytics);
  }

  return buildSimulatedAnalytics(previousAnalytics);
}
