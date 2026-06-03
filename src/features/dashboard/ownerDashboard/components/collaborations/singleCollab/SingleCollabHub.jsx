import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RefreshCw, Search, X, Users, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import useCollaborationStore from '../../../../../../stores/collaborationStore';
import useCollaborationRequestsStore from '../../../../../../stores/CollaborationRequestsStore';
import useOwnerStore from '../../../../../../stores/ownerStore';
import { TABS, LANES, LANE_LABELS } from './constants';
import { buildLaneData, normalizeCollaboration, normalizeRequest } from './helpers';
import HubTabs from './components/HubTabs';
import StatusFlow from './components/StatusFlow';
import AllLanesPane from './components/AllLanesPane';
import ContractsPane from './components/ContractsPane';
import RequestsPane from './components/RequestsPane';
import AnalyticsPane from './components/AnalyticsPane';
import OwnerCollaborationChat from './components/OwnerCollaborationChat';
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
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${bg} flex-1 min-w-[120px]`}>
      <Icon className={`w-4 h-4 shrink-0 ${color}`} />
      <div>
        <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide leading-none mb-0.5">{label}</p>
        <p className={`text-lg font-bold leading-none ${color}`}>{value}</p>
      </div>
    </div>
  );
}

export default function SingleCollabHub() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab]         = useState(searchParams.get('tab') || 'all');
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

  const { interestMessagesUnread } = useOwnerStore();

  const pendingIncoming = useMemo(
    () => (receivedRequests || []).filter(r => String(r.status).toLowerCase() === 'pending').length,
    [receivedRequests]
  );

  // Tabs with badge counts (pending collab requests + unread interest messages)
  const tabsWithBadges = useMemo(() => {
    const requestsBadge = pendingIncoming + interestMessagesUnread;
    return TABS.map(t => ({
      ...t,
      badge: t.id === 'requests' && requestsBadge > 0 ? requestsBadge : null,
    }));
  }, [pendingIncoming, interestMessagesUnread]);

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
    <div className="space-y-6 font-sans text-white">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Collaboration Hub</h1>
          <p className="text-sm text-[#9CA3AF] mt-1">Manage all your active, pending and past collaborations</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#241A3A]/50 border border-[#745CB4]/20 text-[#C1B6FD] hover:border-[#C1B6FD]/40 hover:bg-[#241A3A]/70 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Errors ── */}
      {ownerCollaborationsError && (
        <div className="rounded-lg px-3 py-2.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-2">
          <XCircle className="w-4 h-4 shrink-0" />
          {ownerCollaborationsError}
        </div>
      )}

      {/* ── Navigation Tabs (SaaS-style) ── */}
      <HubTabs 
        tabs={tabsWithBadges} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* ── Loading indicator ── */}
      {isLoading && (
        <div className="flex items-center gap-2 text-[13px] text-[#C1B6FD]">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          Loading collaborations...
        </div>
      )}

      {/* ── Tab panes ── */}
      <div className={activeTab === 'all' ? 'block' : 'hidden'}>
        {/* ── Stats Row (only in All tab, only when collaborations exist) ── */}
        {!isLoading && collaborations.length > 0 && (
          <div className="flex gap-3 mb-4">
            {STAT_CONFIG.map(s => (
              <StatCard key={s.key} Icon={s.Icon} label={s.label} value={stats[s.key]} color={s.color} bg={s.bg} />
            ))}
            {pendingIncoming > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg border bg-amber-500/10 border-amber-500/20 flex-1 min-w-[120px]">
                <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                <div>
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide leading-none mb-0.5">Needs Action</p>
                  <p className="text-lg font-bold leading-none text-amber-400">{pendingIncoming} request{pendingIncoming > 1 ? 's' : ''}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Status Filters (only on Overview tab) ── */}
        <div className="flex flex-wrap gap-2 mb-4">
          {['all', ...LANES].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-md text-xs font-medium border transition-all ${
                statusFilter === s
                  ? 'bg-[#745CB4]/80 border-[#745CB4]/40 text-white'
                  : 'bg-[#1A112C]/30 border-[#745CB4]/15 text-[#9CA3AF] hover:border-[#745CB4]/30 hover:text-white'
              }`}
            >
              {STATUS_FILTER_LABELS[s]}
              {s !== 'all' && laneData[s]?.length > 0 && (
                <span className="ml-1.5 opacity-70">{laneData[s].length}</span>
              )}
            </button>
          ))}
        </div>

        {/* StatusFlow moved to footer */}
        {!isLoading && filteredCollaborations.length === 0 && collaborations.length > 0 && (
          <div className="text-center py-8 text-[#9CA3AF] text-sm">
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
          <div className="flex flex-col items-center justify-center py-12 text-[#9CA3AF] text-sm">
            <div className="w-16 h-16 bg-[#745CB4]/10 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 opacity-40" />
            </div>
            <p className="font-medium text-white mb-1">No collaborations yet</p>
            <p className="text-xs">Send a request to an influencer to get started</p>
          </div>
        )}
        <AllLanesPane laneData={laneData} rawCollabs={ownerCollaborations || []} />

        {/* Collaboration Lifecycle - Only on Overview tab */}
        <StatusFlow />
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
          respondToRequest={respondToRequest}
        />
      </div>

      <div className={activeTab === 'analytics' ? 'block' : 'hidden'}>
        <AnalyticsPane items={ownerCollaborations} />
      </div>

      <div className={activeTab === 'chats' ? 'block' : 'hidden'}>
        <OwnerCollaborationChat />
      </div>

      <div className={activeTab === 'tasks' ? 'block' : 'hidden'}>
        <TasksPane />
      </div>
    </div>
  );
}

