export const TABS = [
  { id: 'all', label: 'All' },
  { id: 'contracts', label: 'Contracts' },
  { id: 'requests', label: 'Requests' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'chats', label: 'Chats' },
  { id: 'tasks', label: 'Tasks' },
];

export const LANES = ['waiting_contract_sign', 'live', 'completed', 'canceled'];

export const LANE_LABELS = {
  waiting_contract_sign: 'Waiting contract sign',
  live: 'Live',
  completed: 'Completed',
  canceled: 'Canceled',
};

export const ACTIVE_STATUSES = new Set(['waiting_contract_sign', 'live']);
export const PAST_STATUSES = new Set(['completed', 'canceled']);
