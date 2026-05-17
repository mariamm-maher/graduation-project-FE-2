export function getCampaignName(source) {
  if (!source) return 'Untitled Campaign';
  const campaign = source.campaign ?? source;
  if (typeof campaign === 'string') return campaign;
  return (
    campaign?.name ||
    campaign?.campaignName ||
    source?.campaignName ||
    'Untitled Campaign'
  );
}

export function getBrandName(owner) {
  if (!owner) return 'Unknown Brand';
  const profileName = owner?.ownerProfile?.brand_name || owner?.brand_name;
  const personName = `${owner?.firstName || ''} ${owner?.lastName || ''}`.trim();
  return profileName || personName || owner?.name || 'Unknown Brand';
}

export function getOwnerFromCollab(collab) {
  if (!collab) return null;
  return collab.owner ?? collab.participants?.owner ?? collab.brand ?? null;
}

export function computeDaysLeft(collab) {
  if (collab?.daysLeft != null && Number(collab.daysLeft) >= 0) {
    return Number(collab.daysLeft);
  }
  const remaining = collab?.tracking?.timeline?.remainingDays;
  if (remaining != null && Number(remaining) >= 0) return Number(remaining);

  const endDate = collab?.endDate ?? collab?.campaign?.endDate;
  if (!endDate) return 0;

  const diff = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export function parseCollaborationTasks(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  const raw =
    payload?.tasks ??
    payload?.data?.tasks ??
    payload?.data ??
  [];
  return Array.isArray(raw) ? raw : [];
}

export function resolveAgreedPrice(collab) {
  if (!collab) return 0;

  const contract = collab.contract ?? collab.activeContract ?? collab.latestContract;
  const request = collab.request ?? collab.collaborationRequest ?? {};
  const financial = collab.financial ?? collab.pricing ?? {};
  const campaign = collab.campaign ?? {};

  const candidates = [
    contract?.agreedPrice,
    contract?.agreedBudget,
    contract?.amount,
    financial?.agreedPrice,
    financial?.agreedBudget,
    request?.counterPrice,
    request?.proposedBudget,
    collab?.counterPrice,
    collab?.proposedBudget,
    collab?.agreedBudget,
    collab?.agreedPrice,
    typeof collab?.budget === 'number' ? collab.budget : collab?.budget?.total,
    campaign?.totalBudget,
    campaign?.budget_amount,
  ];

  for (const raw of candidates) {
    if (raw == null || raw === '') continue;
    const value = typeof raw === 'number' ? raw : parseFloat(String(raw).replace(/,/g, ''));
    if (Number.isFinite(value) && value >= 0) return Math.round(value * 100) / 100;
  }

  return 0;
}

export function normalizeExploreCampaign(raw) {
  if (!raw || typeof raw !== 'object') return raw;

  const id = raw._id ?? raw.id ?? raw.campaignId;
  const owner = raw.owner ?? raw.createdBy ?? {};
  const brandFromApi = typeof raw.brand === 'object' ? raw.brand : null;
  const ownerName = `${owner?.firstName || ''} ${owner?.lastName || ''}`.trim();
  const brandName =
    brandFromApi?.name ??
    owner?.ownerProfile?.brand_name ??
    (ownerName || owner?.brand_name || 'Unknown brand');

  const totalBudget =
    raw.budget?.total ??
    raw.totalBudget ??
    (typeof raw.budget === 'number' ? raw.budget : null) ??
    raw.campaignBudget;

  return {
    ...raw,
    id: String(id || ''),
    _id: raw._id ?? id,
    name: raw.name ?? raw.campaignName ?? raw.campaign_name ?? 'Untitled Campaign',
    campaignGoal: raw.campaignGoal ?? raw.campaign_goal ?? raw.goal,
    applied: Boolean(raw.applied ?? raw.hasApplied),
    hasApplied: Boolean(raw.hasApplied ?? raw.applied),
    brand: {
      ...(brandFromApi || {}),
      name: brandName,
      industry: brandFromApi?.industry ?? owner?.ownerProfile?.industry,
      website: brandFromApi?.website ?? owner?.ownerProfile?.website,
    },
    budget: {
      total: totalBudget,
      currency: raw.budget?.currency ?? raw.currency ?? 'USD',
    },
    platforms: raw.platforms ?? raw.selectedPlatforms ?? [],
    startDate: raw.startDate ?? raw.start_date,
    endDate: raw.endDate ?? raw.end_date,
    durationWeeks: raw.durationWeeks ?? raw.duration_weeks,
    kpis: raw.kpis ?? raw.campaignKpis ?? [],
    targetAudience: raw.targetAudience ?? raw.target_audience ?? {},
  };
}

export function normalizeActiveCollaboration(collab) {
  if (!collab) return collab;
  return {
    ...collab,
    id: collab.id ?? collab._id,
    campaignName: getCampaignName(collab),
    brand: collab.brand ?? getBrandName(collab.owner),
    daysLeft: computeDaysLeft(collab),
    earnings: collab.earnings ?? resolveAgreedPrice(collab),
  };
}

export function countPendingRequests(requests = []) {
  return requests.filter((r) => ['pending', 'negotiating'].includes(r.status)).length;
}
