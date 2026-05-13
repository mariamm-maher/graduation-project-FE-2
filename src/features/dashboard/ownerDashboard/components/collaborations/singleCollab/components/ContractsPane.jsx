import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import useCollaborationContractsStore from '../../../../../../../stores/CollaborationContractsStore';
import useCollaborationStore from '../../../../../../../stores/collaborationStore';
import ContractDetails from './ContractDetails';
import ContractPane from './ContractPane';
import CreateContract from './CreateContract';

export default function ContractsPane() {
  const [view, setView] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [collabKey, setCollabKey] = useState(0);

  const {
    contracts = [],
    getMyOwnerContracts,
    createContract,
    signContractAsOwner,
    isLoading,
    error,
    clearError,
  } = useCollaborationContractsStore();

  const { ownerCollaborations } = useCollaborationStore();

  useEffect(() => {
    getMyOwnerContracts();
  }, [getMyOwnerContracts]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [clearError, error]);

  const safeContracts = useMemo(() => (Array.isArray(contracts) ? contracts : []), [contracts]);

  const openDetails = (contract) => {
    setSelectedContract(contract);
    setView('details');
  };

  const handleCreate = async ({ collaborationId, payload }) => {
    const id = collaborationId || selectedCollab?.id;
    const result = await createContract(id, payload);

    if (result?.success) {
      toast.success('Contract created successfully');
      setView('list');
      await getMyOwnerContracts();
      return;
    }

    toast.error(result?.error || 'Failed to create contract');
  };

  const handleSignOwner = async (contractId) => {
    if (!contractId) return;

    const result = await signContractAsOwner(contractId);
    if (result?.success) {
      toast.success('Contract signed successfully');
      await getMyOwnerContracts();

      setSelectedContract((prev) => {
        if (!prev) return prev;
        if (String(prev._id || prev.id) !== String(contractId)) return prev;
        return { ...prev, ...(result.data || {}), status: result?.data?.status || 'active' };
      });
      return;
    }

    toast.error(result?.error || 'Failed to sign contract');
  };

  return (
    <div className="space-y-4">
      {view === 'list' ? (
        <ContractPane
          contracts={safeContracts}
          isLoading={isLoading}
          searchQuery={searchQuery}
          filterStatus={filterStatus}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilterStatus}
          onOpenCreate={() => setView('create')}
          onOpenDetails={openDetails}
        />
      ) : null}

      {view === 'create' ? (
        <CreateContract
          onCreate={handleCreate}
          onCancel={() => { setView('list'); setSelectedCollab(null); }}
          isSubmitting={isLoading}
          key={collabKey}
          collaboration={selectedCollab}
          allCollaborations={ownerCollaborations || []}
          onCollaborationSelect={(c) => { setSelectedCollab(c); setCollabKey(k => k + 1); }}
        />
      ) : null}

      {view === 'details' ? (
        <ContractDetails
          contract={selectedContract}
          onBack={() => setView('list')}
          onSignOwner={handleSignOwner}
          isSigning={isLoading}
        />
      ) : null}
    </div>
  );
}
