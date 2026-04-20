import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import useCollaborationContractsStore from '../../../../../../../stores/CollaborationContractsStore';
import ContractDetails from './ContractDetails';
import ContractPane from './ContractPane';
import CreateContract from './CreateContract';

export default function ContractsPane() {
  const [view, setView] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedContract, setSelectedContract] = useState(null);

  const {
    contracts = [],
    getMyOwnerContracts,
    createContract,
    signContractAsOwner,
    isLoading,
    error,
    clearError,
  } = useCollaborationContractsStore();

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
    const result = await createContract(collaborationId, payload);

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
          onCancel={() => setView('list')}
          isSubmitting={isLoading}
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
