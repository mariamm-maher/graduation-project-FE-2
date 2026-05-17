export const BACKEND_USER_STATUSES = ['ACTIVE', 'BLOCKED', 'SUSPENDED', 'INCOMPLETE'];

/** Normalize account status from API (any casing) to backend enum. */
export function normalizeUserStatus(status) {
  if (status == null || status === '' || status === '—') return null;
  const s = String(status).trim().toUpperCase();
  return BACKEND_USER_STATUSES.includes(s) ? s : null;
}

export function userStatusLabel(status) {
  const labels = {
    ACTIVE: 'Active',
    BLOCKED: 'Blocked',
    SUSPENDED: 'Suspended',
    INCOMPLETE: 'Incomplete',
  };
  return labels[normalizeUserStatus(status)] || 'Incomplete';
}

/** Extract user object from GET /admin/users/:id response shapes. */
export function parseAdminUserFromResponse(res) {
  const raw = res?.data?.user ?? res?.data?.data ?? res?.user ?? res?.data;
  if (!raw || typeof raw !== 'object' || (raw.id == null && !raw.email)) return null;
  return raw;
}

/** Apply normalized status; fall back to list cache when single-user endpoint omits status. */
/** Parse GET /admin/sessions response (supports multiple backend shapes). */
export function extractSessionsList(response) {
  if (!response) return { sessions: [], pagination: null };
  const payload = response.data ?? response;
  const sessions =
    payload?.sessions ??
    response?.sessions ??
    (Array.isArray(payload) ? payload : []);
  const pagination = payload?.pagination ?? response?.pagination ?? null;
  return {
    sessions: Array.isArray(sessions) ? sessions : [],
    pagination,
  };
}

export function getSessionLifecycleStatus(session) {
  if (!session) return 'unknown';
  if (session.revokedAt) return 'revoked';
  if (session.expiresAt && new Date(session.expiresAt) <= new Date()) return 'expired';
  return 'active';
}

export function normalizeAdminUser(user, usersList, id) {
  if (!user) return null;
  const fromUser =
    normalizeUserStatus(user.status) ??
    normalizeUserStatus(user.accountStatus) ??
    normalizeUserStatus(user.userStatus);
  const cached = (usersList || []).find((u) => String(u.id) === String(id ?? user.id));
  const fromList = normalizeUserStatus(cached?.status);
  const status = fromUser ?? fromList ?? 'INCOMPLETE';
  return { ...user, status };
}

// Map backend collaboration to UI shape (owner/influencer may be objects or ids)
export function mapCollaboration(c) {
  if (!c || typeof c !== 'object') return null;
  const owner = c.owner && typeof c.owner === 'object' ? c.owner : {};
  const influencer = c.influencer && typeof c.influencer === 'object' ? c.influencer : {};
  const ownerName = [owner.firstName, owner.lastName].filter(Boolean).join(' ').trim() || owner.name || '—';
  const influencerName = [influencer.firstName, influencer.lastName].filter(Boolean).join(' ').trim() || influencer.name || '—';
  const campaignName = c.campaign?.campaignName ?? c.campaign?.name ?? c.campaignName ?? (typeof c.campaign === 'string' ? c.campaign : '—');
  const deliverables = c.deliverables && typeof c.deliverables === 'object'
    ? { completed: c.deliverables.completed ?? 0, total: c.deliverables.total ?? 0 }
    : { completed: 0, total: 0 };
  const platforms = Array.isArray(c.platforms) ? c.platforms : (c.platforms ? [c.platforms] : []);
  const formatDate = (d) => !d ? '—' : (typeof d === 'string' && d.length >= 10 ? d.split('T')[0] : new Date(d).toISOString().split('T')[0]);
  return {
    id: c.id,
    ownerId: owner.id ?? c.ownerId,
    owner: ownerName,
    ownerEmail: owner.email ?? c.ownerEmail ?? '—',
    influencerId: influencer.id ?? c.influencerId,
    influencer: influencerName,
    influencerEmail: influencer.email ?? c.influencerEmail ?? '—',
    campaign: campaignName,
    status: (c.status || 'active').toLowerCase().replace(/\s/g, '_'),
    progress: Number(c.progress) || 0,
    unreadMessages: Number(c.unreadMessages) || 0,
    deliverables,
    payment: (c.paymentStatus ?? c.payment ?? 'pending').toLowerCase(),
    rating: c.rating != null ? Number(c.rating) : null,
    deadline: formatDate(c.deadline ?? c.endDate),
    platforms,
    startedAt: formatDate(c.startedAt ?? c.createdAt),
    notes: c.notes ?? '',
    raw: c
  };
}
