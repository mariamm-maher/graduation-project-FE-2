// Map backend collaboration to UI shape (owner/influencer may be objects or ids)
export function mapCollaboration(c) {
  if (!c || typeof c !== 'object') return null;
  const owner = c.owner && typeof c.owner === 'object' ? c.owner : {};
  const influencer = c.influencer && typeof c.influencer === 'object' ? c.influencer : {};
  const ownerName = [owner.firstName, owner.lastName].filter(Boolean).join(' ').trim() || owner.name || '—';
  const influencerName = [influencer.firstName, influencer.lastName].filter(Boolean).join(' ').trim() || influencer.name || '—';
  const campaignName = c.campaign?.name ?? c.campaignName ?? (typeof c.campaign === 'string' ? c.campaign : '—');
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
