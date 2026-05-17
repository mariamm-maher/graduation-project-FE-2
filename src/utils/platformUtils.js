/** Sequelize / Postgres enum_Channels_platform values */
export const VALID_PLATFORMS = [
  'instagram',
  'facebook',
  'twitter',
  'linkedin',
  'tiktok',
  'youtube',
];

const PLATFORM_LABEL_BY_VALUE = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

/** UI labels and legacy capitalized values → lowercase enum */
const PLATFORM_VALUE_ALIASES = {
  instagram: 'instagram',
  Instagram: 'instagram',
  facebook: 'facebook',
  Facebook: 'facebook',
  twitter: 'twitter',
  Twitter: 'twitter',
  'X (Twitter)': 'twitter',
  'x (twitter)': 'twitter',
  X: 'twitter',
  linkedin: 'linkedin',
  LinkedIn: 'linkedin',
  tiktok: 'tiktok',
  TikTok: 'tiktok',
  youtube: 'youtube',
  YouTube: 'youtube',
};

export const PLATFORM_OPTIONS = [
  { label: 'Instagram', value: 'instagram' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Twitter', value: 'twitter' },
];

/** FastAPI CampaignBrief channel literals (title case) */
const AI_PLATFORM_LABEL_BY_VALUE = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

/**
 * Maps stored platform values to AI engine literals (e.g. twitter → Twitter).
 * @param {unknown} raw
 * @returns {string | null}
 */
export function normalizePlatformForAi(raw) {
  const lower = normalizePlatformValue(raw);
  if (!lower) return null;
  return AI_PLATFORM_LABEL_BY_VALUE[lower] || null;
}

/**
 * @param {unknown} list
 * @returns {string[]}
 */
export function normalizePlatformListForAi(list) {
  if (!Array.isArray(list)) return [];
  return [...new Set(list.map(normalizePlatformForAi).filter(Boolean))];
}

/**
 * @param {unknown} raw
 * @returns {string | null}
 */
export function normalizePlatformValue(raw) {
  if (raw == null || raw === '') return null;
  const key = String(raw).trim();
  if (PLATFORM_VALUE_ALIASES[key]) return PLATFORM_VALUE_ALIASES[key];
  const lower = key.toLowerCase();
  if (VALID_PLATFORMS.includes(lower)) return lower;
  return null;
}

/**
 * @param {unknown} list
 * @returns {string[]}
 */
export function normalizePlatformList(list) {
  if (!Array.isArray(list)) return [];
  return [...new Set(list.map(normalizePlatformValue).filter(Boolean))];
}

/**
 * @param {string} value - lowercase enum value
 * @returns {string}
 */
export function platformDisplayLabel(value) {
  const v = normalizePlatformValue(value);
  if (!v) return '';
  return PLATFORM_LABEL_BY_VALUE[v] || v;
}

/**
 * @param {unknown} list
 * @returns {string}
 */
export function formatPlatformsForDisplay(list) {
  return normalizePlatformList(list).map(platformDisplayLabel).join(', ');
}
