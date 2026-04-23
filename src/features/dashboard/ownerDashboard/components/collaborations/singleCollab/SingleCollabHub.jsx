import { useEffect, useMemo, useState, useCallback } from 'react';
import { RefreshCw, Search, X, Users, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import useCollaborationStore from '../../../../../../stores/collaborationStore';
import useCollaborationRequestsStore from '../../../../../../stores/CollaborationRequestsStore';
import { TABS, LANES, LANE_LABELS } from './constants';
import { buildLaneData, normalizeCollaboration, normalizeRequest } from './helpers';
import HubTabs from './components/HubTabs';
import StatusFlow from './components/StatusFlow';
import AllLanesPane from './components/AllLanesPane';
import ContractsPane from './components/ContractsPane';
import RequestsPane from './components/RequestsPane';
import AnalyticsPane from './components/AnalyticsPane';
import ChatsPane from './components/ChatsPane';
import TasksPane from './components/TasksPane';

const STAT_CONFIG = [
  { key: 'total',     label: 'Total',           Icon: Users,       color: 'text-[#C1B6FD]', bg: 'bg-[#745CB4]/10 border-[#745CB4]/25' },
  { key: 'live',      label: 'Live',            Icon: TrendingUp,  color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/25' },
  { key: 'waiting',   label: 'Pending Contract',Icon: Clock,       color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/25' },
  { key: 'completed', label: 'Completed',       Icon: CheckCircle, color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/25' },
  { key: 'canceled',  label: 'Cancelled',       Icon: XCircle,     color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/25' },
];

const STATUS_FILTER_LABELS = {
  all: 'All Statuses',
  waiting_contract_sign: 'Pending Contract',
  live: 'Live',
  completed: 'Completed',
  canceled: 'Cancelled',
};

function StatCard({ Icon, label, value, color, bg }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${bg} min-w-[120px]`}>
      <Icon className={`w-4 h-4 shrink-0 ${color}`} />
      <div>
        <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide leading-none mb-0.5">{label}</p>
        <p className={`text-lg font-bold leading-none ${color}`}>{value}</p>
      </div>
    </div>
  );
}

export default function SingleCollabHub() {
  const [activeTab, setActiveTab]         = useState('all');
  const [searchQuery, setSearchQuery]     = useState('');
  const [statusFilter, setStatusFilter]   = useState('all');
  const [isRefreshing, setIsRefreshing]   = useState(false);

  const {
    ownerCollaborations,
    getMyOwnerCollaborations,
    isOwnerCollaborationsLoading,
    ownerCollaborationsError,
  } = useCollaborationStore();

  const {
    sentRequests,
    receivedRequests,
    getMySentRequests,
    getMyReceivedRequests,
    respondToRequest,
    cancelRequest,
    isLoading: requestsLoading,
    error: requestsError,
  } = useCollaborationRequestsStore();

  const loadAll = useCallback(async () => {
    await Promise.all([
      getMyOwnerCollaborations(),
      getMySentRequests({ page: 1, limit: 20 }),
      getMyReceivedRequests({ page: 1, limit: 20 }),
    ]);
  }, [getMyOwnerCollaborations, getMySentRequests, getMyReceivedRequests]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAll();
    setIsRefreshing(false);
  };

  const collaborations = useMemo(
    () => (ownerCollaborations || []).map((c, i) => normalizeCollaboration(c, i)),
    [ownerCollaborations]
  );

  // Stats derived from all collaborations (not filtered)
  const stats = useMemo(() => {
    const all = collaborations;
    return {
      total:     all.length,
      live:      all.filter(c => c.status === 'live').length,
      waiting:   all.filter(c => c.status === 'waiting_contract_sign').length,
      completed: all.filter(c => c.status === 'completed').length,
      canceled:  all.filter(c => c.status === 'canceled').length,
    };
  }, [collaborations]);

  const pendingIncoming = useMemo(
    () => (receivedRequests || []).filter(r => String(r.status).toLowerCase() === 'pending').length,
    [receivedRequests]
  );

  // Tabs with badge counts
  const tabsWithBadges = useMemo(() => TABS.map(t => ({
    ...t,
    badge: t.id === 'requests' && pendingIncoming > 0 ? pendingIncoming : null,
  })), [pendingIncoming]);

  const filteredCollaborations = useMemo(() => {
    let list = collaborations;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(c =>
        c.campaignName.toLowerCase().includes(q) ||
        c.influencerName.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      list = list.filter(c => c.status === statusFilter);
    }
    return list;
  }, [collaborations, searchQuery, statusFilter]);

  const laneData = useMemo(() => buildLaneData(filteredCollaborations), [filteredCollaborations]);

  const outgoingRequests = useMemo(
    () => (sentRequests || []).map((r, i) => normalizeRequest(r, i)),
    [sentRequests]
  );

  const incomingRequests = useMemo(
    () => (receivedRequests || []).map((r, i) => normalizeRequest(r, i)),
    [receivedRequests]
  );

  const handleAccept = async (id) => { await respondToRequest(id, { action: 'accept' }); };
  const handleReject = async (id) => { await respondToRequest(id, { action: 'reject' }); };

  const isLoading = isOwnerCollaborationsLoading;

  return (
    <div className="space-y-5 font-sans text-white">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Collaboration Hub</h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Manage all your active, pending and past collaborations</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#241A3A]/70 border border-[#745CB4]/35 text-[#C1B6FD] hover:border-[#C1B6FD]/50 hover:bg-[#241A3A] transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="flex flex-wrap gap-2.5">
        {STAT_CONFIG.map(s => (
          <StatCard key={s.key} Icon={s.Icon} label={s.label} value={stats[s.key]} color={s.color} bg={s.bg} />
        ))}
        {pendingIncoming > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-amber-500/10 border-amber-500/25 min-w-[120px]">
            <Clock className="w-4 h-4 shrink-0 text-amber-400" />
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide leading-none mb-0.5">Needs Action</p>
              <p className="text-lg font-bold leading-none text-amber-400">{pendingIncoming} request{pendingIncoming > 1 ? 's' : ''}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Errors ── */}
      {ownerCollaborationsError && (
        <div className="rounded-lg px-3 py-2.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-2">
          <XCircle className="w-4 h-4 shrink-0" />
          {ownerCollaborationsError}
        </div>
      )}

      {/* ── Tabs ── */}
      <HubTabs tabs={tabsWithBadges} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── "All" tab controls: search + status filter ── */}
      {activeTab === 'all' && (
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search campaign or influencer..."
              className="w-full pl-9 pr-9 py-2.5 text-sm border border-[#745CB4]/25 rounded-xl bg-[#1A112C]/70 text-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#C1B6FD]/45 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status filter pills */}
          <div className="flex flex-wrap gap-1.5">
            {['all', ...LANES].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  statusFilter === s
                    ? 'bg-[#745CB4] border-[#C1B6FD]/50 text-white'
                    : 'bg-[#1A112C]/50 border-[#745CB4]/25 text-[#9CA3AF] hover:border-[#745CB4]/50 hover:text-white'
                }`}
              >
                {STATUS_FILTER_LABELS[s]}
                {s !== 'all' && laneData[s]?.length > 0 && (
                  <span className="ml-1.5 opacity-70">{laneData[s].length}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Loading indicator ── */}
      {isLoading && (
        <div className="flex items-center gap-2 text-[13px] text-[#C1B6FD]">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          Loading collaborations...
        </div>
      )}

      {/* ── Tab panes ── */}
      <div className={activeTab === 'all' ? 'block' : 'hidden'}>
        <StatusFlow />
        {!isLoading && filteredCollaborations.length === 0 && collaborations.length > 0 && (
          <div className="text-center py-12 text-[#9CA3AF] text-sm">
            No collaborations match your search or filter.{' '}
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
              className="text-[#C1B6FD] underline hover:no-underline"
            >
              Clear filters
            </button>
          </div>
        )}
        {!isLoading && collaborations.length === 0 && (
          <div className="text-center py-16 text-[#9CA3AF] text-sm">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            No collaborations yet. Send a request to an influencer to get started.
          </div>
        )}
        <AllLanesPane laneData={laneData} rawCollabs={ownerCollaborations || []} />
      </div>

      <div className={activeTab === 'contracts' ? 'block' : 'hidden'}>
        <ContractsPane />
      </div>

      <div className={activeTab === 'requests' ? 'block' : 'hidden'}>
        <RequestsPane
          incoming={incomingRequests}
          outgoing={outgoingRequests}
          requestsLoading={requestsLoading}
          requestsError={requestsError}
          onAccept={handleAccept}
          onReject={handleReject}
          onCancel={cancelRequest}
        />
      </div>

      <div className={activeTab === 'analytics' ? 'block' : 'hidden'}>
        <AnalyticsPane items={ownerCollaborations} />
      </div>

      <div className={activeTab === 'chats' ? 'block' : 'hidden'}>
        <ChatsPane items={ownerCollaborations} />
      </div>

      <div className={activeTab === 'tasks' ? 'block' : 'hidden'}>
        <TasksPane items={ownerCollaborations} />
      </div>
    </div>
  );
}

