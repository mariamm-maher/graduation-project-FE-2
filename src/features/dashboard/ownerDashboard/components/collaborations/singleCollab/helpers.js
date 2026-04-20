import { LANES } from './constants';

export const capitalize = (value = '') => value.charAt(0).toUpperCase() + value.slice(1);

export const normalizeStatus = (rawStatus) => {
  const status = String(rawStatus || '').toLowerCase();

  if (status === 'waiting_contract_sign' || status === 'waiting-contract-sign') return 'waiting_contract_sign';
  if (status === 'pending_contract_sign' || status === 'pending-contract-sign') return 'waiting_contract_sign';
  if (status === 'live') return 'live';
  if (status === 'in_progress' || status === 'in-progress' || status === 'active') return 'live';
  if (status === 'completed') return 'completed';
  if (status === 'canceled' || status === 'cancelled' || status === 'rejected') return 'canceled';
  if (status === 'pending') return 'waiting_contract_sign';
  return 'waiting_contract_sign';
};

export function normalizeCollaboration(collab, index) {
  const influencer = collab?.influencer || collab?.influencerId || {};
  const influencerName =
    `${influencer?.firstName || influencer?.user?.firstName || ''} ${
      influencer?.lastName || influencer?.user?.lastName || ''
    }`.trim() || collab?.influencerName || 'Unknown Influencer';

  const tasks = collab?.tasks || [];
  const totalTasks = Number(collab?.totalTasks ?? tasks.length ?? 0);
  const completedTasks = Number(
    collab?.completedTasks ?? tasks.filter((task) => task?.completed || task?.status === 'completed').length
  );

  return {
    id: collab?._id || collab?.id || `collab-${index}`,
    campaignName:
      collab?.campaign?.campaignName || collab?.campaign?.name || collab?.campaignName || 'Untitled Campaign',
    influencerName,
    status: normalizeStatus(collab?.status),
    budget: Number(
      collab?.agreedBudget ?? collab?.budget ?? collab?.proposedBudget ?? collab?.campaign?.totalBudget ?? 0
    ),
    totalTasks,
    completedTasks,
    progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
  };
}

export function normalizeRequest(request, index) {
  const influencer = request?.influencer || {};
  const influencerName =
    `${influencer?.firstName || ''} ${influencer?.lastName || ''}`.trim() || request?.influencerName || 'Unknown';

  return {
    id: request?.id || request?._id || `request-${index}`,
    influencerName,
    campaignName: request?.campaign?.campaignName || request?.campaignName || 'Campaign',
    status: String(request?.status || 'pending').toLowerCase(),
    proposedBudget: Number(request?.proposedBudget || 0),
    responseMessage: request?.responseMessage || '',
    message: request?.message || '',
    lastCounteredBy: request?.lastCounteredBy || request?.lastCounteredByRole || '',
  };
}

export function buildLaneData(collaborations) {
  const base = Object.fromEntries(LANES.map((status) => [status, []]));

  collaborations.forEach((collab) => {
    const lane = LANES.includes(collab.status) ? collab.status : 'waiting_contract_sign';
    base[lane].push(collab);
  });

  return base;
}
