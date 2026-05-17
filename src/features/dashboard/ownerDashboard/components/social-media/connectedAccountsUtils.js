/**
 * Display label for account header.
 * Page / brand names (contain spaces) stay as-is — no @ prefix (e.g. Facebook "SE marketing agency").
 * Handle-like strings get a leading @ when missing.
 * @param {string | undefined | null} raw
 */
export function formatDisplayHandle(raw) {
  if (raw == null || typeof raw !== 'string') return '';
  const t = raw.trim();
  if (!t) return '';
  if (t.includes(' ')) return t;
  if (t.startsWith('@')) return t;
  return `@${t.replace(/^@+/, '')}`;
}

/**
 * Primary handle for display: username, handle, screen_name, channelTitle (per API).
 * @param {Record<string, unknown>} ch
 */
export function pickAccountHandle(ch) {
  const pd = ch?.platformData && typeof ch.platformData === 'object' ? ch.platformData : {};
  const fromRoot =
    ch?.accountUsername ??
    ch?.username ??
    ch?.handle ??
    ch?.screen_name ??
    ch?.name ??
    ch?.channelTitle ??
    ch?.accountName;
  const fromPd =
    pd?.username ??
    pd?.handle ??
    pd?.screen_name ??
    pd?.name ??
    pd?.pageName ??
    pd?.page_name ??
    pd?.channelTitle ??
    pd?.accountUsername;
  const raw = fromRoot ?? fromPd ?? '';
  const formatted = formatDisplayHandle(raw);
  return formatted || 'Connected account';
}

/** @param {string | undefined} status */
export function deriveConnectionStatus(status, isSimulated) {
  const s = (status || '').toLowerCase();
  if (isSimulated) return 'simulated';
  if (s.includes('sync')) return 'syncing';
  if (s.includes('error') || s === 'failed' || s === 'disconnected') return 'error';
  if (s.includes('connect') || s === 'active' || s === 'connected' || !s) return 'connected';
  return 'connected';
}

/**
 * @param {Record<string, unknown>} payload - API stats body
 */
export function normalizeAnalyticsPayload(payload) {
  const d = payload?.data ?? payload ?? {};
  const followers =
    d.followers ??
    d.followerCount ??
    d.fan_count ??
    d.subscriberCount ??
    d.followers_count ??
    null;
  const engagementRate =
    d.engagement ??
    d.engagement_rate ??
    d.engagementRate ??
    d.engagement_score ??
    null;
  const hasData =
    followers != null ||
    engagementRate != null ||
    d.reach != null ||
    d.impressions != null ||
    d.likes != null;

  return {
    raw: d,
    followers,
    engagementRate,
    reach: d.reach ?? null,
    impressions: d.impressions ?? null,
    likes: d.likes ?? null,
    hasData,
  };
}
