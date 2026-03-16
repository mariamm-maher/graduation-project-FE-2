import { useEffect, useState } from 'react';
import { FileText, Calendar, DollarSign, Building2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useInfluncerStore from '../../../../../../stores/influncerStore';
import useCollaborationContractsStore from '../../../../../../stores/CollaborationContractsStore';

function ContractsList() {
  const { getMyInfluencerCollaborations } = useInfluncerStore();
  const { getContractByCollaboration } = useCollaborationContractsStore();
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeContract = (raw, fallback = {}) => {
    if (!raw || typeof raw !== 'object') return null;
    const contract = raw.contract && typeof raw.contract === 'object' ? raw.contract : raw;

    return {
      ...contract,
      collaborationId:
        contract.collaborationId ??
        fallback.collaborationId ??
        contract.collaboration?.id ??
        contract.collaboration?.collaborationId,
      campaignName:
        fallback.campaignName ??
        contract.campaignName ??
        contract.collaboration?.campaign?.campaignName ??
        'Untitled Campaign',
      ownerName:
        fallback.ownerName ??
        contract.ownerName ??
        contract.collaboration?.owner?.ownerProfile?.businessName ??
        contract.collaboration?.owner?.companyName ??
        contract.collaboration?.owner?.user?.firstName ??
        'Brand Owner',
    };
  };

  useEffect(() => {
    let isMounted = true;

    const loadContracts = async () => {
      setIsLoading(true);
      const response = await getMyInfluencerCollaborations();

      if (!response?.success) {
        if (isMounted) {
          setContracts([]);
          setIsLoading(false);
        }
        return;
      }

      const payload = response.data;
      let rawContracts = [];

      if (Array.isArray(payload)) {
        rawContracts = payload;
      } else if (payload?.contracts && Array.isArray(payload.contracts)) {
        rawContracts = payload.contracts;
      } else if (payload?.data?.contracts && Array.isArray(payload.data.contracts)) {
        rawContracts = payload.data.contracts;
      } else if (payload?.contract && typeof payload.contract === 'object') {
        rawContracts = [payload.contract];
      } else if (payload?.data?.contract && typeof payload.data.contract === 'object') {
        rawContracts = [payload.data.contract];
      }

      if (rawContracts.length > 0) {
        const normalized = rawContracts
          .map((item) => normalizeContract(item))
          .filter(Boolean);

        if (isMounted) {
          setContracts(normalized);
          setIsLoading(false);
        }
        return;
      }

      const collaborations = Array.isArray(payload?.collaborations)
        ? payload.collaborations
        : Array.isArray(payload?.data?.collaborations)
        ? payload.data.collaborations
        : Array.isArray(payload)
        ? payload
        : [];

      const resolved = await Promise.all(
        collaborations.map(async (collab) => {
          const collaborationId = collab?._id || collab?.id;
          if (!collaborationId) return null;

          const contractRes = await getContractByCollaboration(collaborationId);
          if (!contractRes?.success) return null;

          return normalizeContract(contractRes.data, {
            collaborationId,
            campaignName: collab?.campaign?.campaignName,
            ownerName:
              collab?.owner?.ownerProfile?.businessName ||
              collab?.owner?.companyName ||
              collab?.owner?.user?.firstName,
          });
        })
      );

      if (isMounted) {
        setContracts(resolved.filter(Boolean));
        setIsLoading(false);
      }
    };

    loadContracts().catch(() => {
      if (isMounted) {
        toast.error('Failed to load contracts');
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [getMyInfluencerCollaborations, getContractByCollaboration]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-[#C1B6FD] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Contracts</h1>
        <p className="text-sm sm:text-base text-gray-400">All contracts sent to you by brand owners</p>
      </div>

      {contracts.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Contracts Yet</h3>
          <p className="text-sm text-gray-400">No contracts were found for your account.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract, idx) => {
            const id = contract.id || contract._id || `${contract.collaborationId}-${idx}`;
            const amount = Number(contract.agreedPrice || contract.agreedBudget || contract.amount || 0);
            const status = contract.status || 'draft';
            const date = contract.createdAt || contract.updatedAt;

            return (
              <div key={id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">{contract.campaignName}</h3>
                    <p className="text-sm text-gray-400 inline-flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {contract.ownerName}
                    </p>
                    <p className="text-sm text-gray-400 inline-flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {date ? new Date(date).toLocaleDateString() : 'No date'}
                    </p>
                  </div>

                  <div className="sm:text-right space-y-2">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        status === 'signed'
                          ? 'bg-green-500/20 text-green-400'
                          : status === 'sent' || status === 'partially_signed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : status === 'cancelled'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {String(status).toUpperCase()}
                    </span>
                    <p className="text-[#C1B6FD] font-bold inline-flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <Link to={`/dashboard/influencer/collaborations/contracts/${contract.collaborationId || id}`}>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white text-sm font-medium transition-all">
                      View Full Contract
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ContractsList;
