import { Calendar, Eye, FileText, Plus, Search } from 'lucide-react';

function StatusBadge({ status }) {
  const styleMap = {
    draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    active: 'bg-green-500/20 text-green-300 border-green-500/30',
    completed: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    terminated: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  const safeStatus = String(status || 'draft').toLowerCase();

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styleMap[safeStatus] || styleMap.draft}`}>
      {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
    </span>
  );
}

function formatDate(dateValue) {
  if (!dateValue) return 'N/A';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return 'N/A';

  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getDurationDays(startDate, endDate) {
  if (!startDate || !endDate) return 'N/A';
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'N/A';

  const diff = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
  return `${diff} days`;
}

export default function ContractPane({
  contracts,
  isLoading,
  searchQuery,
  filterStatus,
  onSearchChange,
  onFilterChange,
  onOpenCreate,
  onOpenDetails,
}) {
  const q = searchQuery.trim().toLowerCase();

  const filteredContracts = (contracts || []).filter((contract) => {
    const campaign = String(contract?.campaignName || '').toLowerCase();
    const influencer = String(contract?.influencerName || '').toLowerCase();
    const contractStatus = String(contract?.status || '').toLowerCase();

    const matchesSearch = !q || campaign.includes(q) || influencer.includes(q);
    const matchesStatus = filterStatus === 'all' || contractStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalValue = (contracts || []).reduce((sum, contract) => sum + (Number(contract?.budget) || 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#C1B6FD]" />
            Contracts Center
          </h3>
          <p className="text-sm text-[#9CA3AF] mt-1">Track, review, and create contracts in one place.</p>
        </div>

        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#C1B6FD]/35 bg-linear-to-r from-[#241A3A]/90 to-[#1A112C]/90 text-white font-semibold hover:border-[#C1B6FD]/60 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Contract
        </button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#745CB4]/25 bg-[#1A112C]/65 backdrop-blur-sm p-4">
          <p className="text-xs text-[#9CA3AF] mb-1">Total Contracts</p>
          <p className="text-2xl font-bold text-white">{contracts.length}</p>
        </div>
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 backdrop-blur-sm p-4">
          <p className="text-xs text-[#9CA3AF] mb-1">Active</p>
          <p className="text-2xl font-bold text-green-300">{contracts.filter((c) => c?.status === 'active').length}</p>
        </div>
        <div className="rounded-xl border border-gray-500/30 bg-gray-500/10 backdrop-blur-sm p-4">
          <p className="text-xs text-[#9CA3AF] mb-1">Draft</p>
          <p className="text-2xl font-bold text-gray-300">{contracts.filter((c) => c?.status === 'draft').length}</p>
        </div>
        <div className="rounded-xl border border-[#745CB4]/30 bg-[#241A3A]/70 backdrop-blur-sm p-4">
          <p className="text-xs text-[#9CA3AF] mb-1">Total Value</p>
          <p className="text-2xl font-bold text-[#C1B6FD]">${totalValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by campaign or influencer"
            className="w-full rounded-xl border border-[#745CB4]/25 bg-[#1A112C]/65 backdrop-blur-sm pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#C1B6FD]/45"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value)}
          className="rounded-xl border border-[#745CB4]/25 bg-[#1A112C]/65 backdrop-blur-sm px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C1B6FD]/45"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>

      {isLoading ? <p className="text-sm text-[#9CA3AF]">Loading contracts...</p> : null}

      {filteredContracts.length === 0 ? (
        <div className="rounded-xl border border-[#745CB4]/25 bg-[#1A112C]/60 backdrop-blur-sm p-8 text-center">
          <FileText className="mx-auto mb-3 w-9 h-9 text-[#9CA3AF]" />
          <h4 className="text-lg font-semibold text-white">No contracts found</h4>
          <p className="text-sm text-[#9CA3AF] mt-1">Adjust filters or create a new contract.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-[#745CB4]/25 bg-[#1A112C]/55 backdrop-blur-sm overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#745CB4]/20 bg-[#241A3A]/55">
                  <th className="text-left py-3.5 px-5 text-xs font-semibold text-[#9CA3AF]">Contract</th>
                  <th className="text-left py-3.5 px-5 text-xs font-semibold text-[#9CA3AF]">Campaign</th>
                  <th className="text-left py-3.5 px-5 text-xs font-semibold text-[#9CA3AF]">Influencer</th>
                  <th className="text-left py-3.5 px-5 text-xs font-semibold text-[#9CA3AF]">Budget</th>
                  <th className="text-left py-3.5 px-5 text-xs font-semibold text-[#9CA3AF]">Duration</th>
                  <th className="text-left py-3.5 px-5 text-xs font-semibold text-[#9CA3AF]">Status</th>
                  <th className="text-right py-3.5 px-5 text-xs font-semibold text-[#9CA3AF]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map((contract, index) => (
                  <tr
                    key={contract?._id || contract?.id || index}
                    className={`border-b border-[#745CB4]/15 hover:bg-[#241A3A]/30 transition-colors ${
                      index === filteredContracts.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="py-3.5 px-5 text-sm text-white font-mono">
                      #{String(contract?._id || contract?.id || '').slice(-6)}
                    </td>
                    <td className="py-3.5 px-5 text-sm text-white font-medium">{contract?.campaignName || 'N/A'}</td>
                    <td className="py-3.5 px-5 text-sm text-[#C1B6FD]">{contract?.influencerName || 'N/A'}</td>
                    <td className="py-3.5 px-5 text-sm text-white">${(Number(contract?.budget) || 0).toLocaleString()}</td>
                    <td className="py-3.5 px-5 text-sm text-[#9CA3AF]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {getDurationDays(contract?.startDate, contract?.endDate)}
                      </div>
                      <p className="text-[11px] mt-0.5">{formatDate(contract?.startDate)} - {formatDate(contract?.endDate)}</p>
                    </td>
                    <td className="py-3.5 px-5">
                      <StatusBadge status={contract?.status} />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenDetails(contract)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#745CB4]/30 text-[#C1B6FD] hover:border-[#C1B6FD]/40 hover:text-white transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden divide-y divide-[#745CB4]/20">
            {filteredContracts.map((contract, index) => (
              <div key={contract?._id || contract?.id || index} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-[#9CA3AF] font-mono mb-1">#{String(contract?._id || contract?.id || '').slice(-6)}</p>
                    <h4 className="text-sm font-semibold text-white">{contract?.campaignName || 'N/A'}</h4>
                    <p className="text-xs text-[#C1B6FD]">{contract?.influencerName || 'N/A'}</p>
                  </div>
                  <StatusBadge status={contract?.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[#9CA3AF]">Budget</p>
                    <p className="text-white font-semibold">${(Number(contract?.budget) || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[#9CA3AF]">Duration</p>
                    <p className="text-white font-semibold">{getDurationDays(contract?.startDate, contract?.endDate)}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenDetails(contract)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#745CB4]/30 text-[#C1B6FD] hover:border-[#C1B6FD]/40 hover:text-white transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Open Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
