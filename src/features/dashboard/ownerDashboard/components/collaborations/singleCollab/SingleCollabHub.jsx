import { useEffect, useMemo, useState } from 'react';
import useCollaborationStore from '../../../../../../stores/collaborationStore';
import useCollaborationRequestsStore from '../../../../../../stores/CollaborationRequestsStore';
import { TABS } from './constants';
import { buildLaneData, normalizeCollaboration, normalizeRequest } from './helpers';
import HubTabs from './components/HubTabs';
import HubSearch from './components/HubSearch';
import StatusFlow from './components/StatusFlow';
import AllLanesPane from './components/AllLanesPane';
import ContractsPane from './components/ContractsPane';
import RequestsPane from './components/RequestsPane';
import AnalyticsPane from './components/AnalyticsPane';
import ChatsPane from './components/ChatsPane';
import TasksPane from './components/TasksPane';

export default function SingleCollabHub() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    getMyOwnerCollaborations();
    getMySentRequests({ page: 1, limit: 20 });
    getMyReceivedRequests({ page: 1, limit: 20 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const collaborations = useMemo(
    () => (ownerCollaborations || []).map((c, i) => normalizeCollaboration(c, i)),
    [ownerCollaborations]
  );

  const filteredCollaborations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return collaborations;

    return collaborations.filter(
      (c) => c.campaignName.toLowerCase().includes(q) || c.influencerName.toLowerCase().includes(q)
    );
  }, [collaborations, searchQuery]);

  const laneData = useMemo(() => buildLaneData(filteredCollaborations), [filteredCollaborations]);

  const outgoingRequests = useMemo(
    () => (sentRequests || []).map((r, i) => normalizeRequest(r, i)),
    [sentRequests]
  );

  const incomingRequests = useMemo(
    () => (receivedRequests || []).map((r, i) => normalizeRequest(r, i)),
    [receivedRequests]
  );

  const handleAccept = async (id) => {
    await respondToRequest(id, { action: 'accept' });
  };

  const handleReject = async (id) => {
    await respondToRequest(id, { action: 'reject' });
  };

  return (
    <>
      <h2 className="absolute w-px h-px p-0 -m-px overflow-hidden [clip:rect(0,0,0,0)] border-0">
        Unified collaboration hub with stages: waiting contract sign, live, completed, canceled
      </h2>

      <div className="py-6 font-sans text-white">
        <HubTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        {/* <HubSearch value={searchQuery} onChange={setSearchQuery} /> */}

        {isOwnerCollaborationsLoading ? (
          <div className="mb-2.5 text-[13px] text-[#C1B6FD]">Loading collaborations...</div>
        ) : null}
        {ownerCollaborationsError ? (
          <div className="mb-2.5 rounded-lg px-2.5 py-2.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20/80">
            {ownerCollaborationsError}
          </div>
        ) : null}

        <div className={activeTab === 'all' ? 'block' : 'hidden'}>
          <StatusFlow />
          <AllLanesPane laneData={laneData} />
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
    </>
  );
}

