import { Calendar, Eye, FileText, Plus, Search, PenTool, CheckCircle, XCircle, FileCheck, Package, DollarSign, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

function StatusBadge({ status, ownerSigned, influencerSigned }) {
  // New API statuses: draft, partially_signed, signed, active, completed, terminated
  const baseStyle = 'px-2.5 py-1 rounded-full text-xs font-semibold border';
  
  const styleMap = {
    draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    partially_signed: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    signed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    active: 'bg-green-500/20 text-green-300 border-green-500/30',
    completed: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    terminated: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  const safeStatus = String(status || 'draft').toLowerCase();
  const style = styleMap[safeStatus] || styleMap.draft;
  
  // Show signing status indicator
  const getSigningIndicator = () => {
    if (ownerSigned && influencerSigned) return <CheckCircle className="w-3 h-3 text-green-400" />;
    if (ownerSigned || influencerSigned) return <FileCheck className="w-3 h-3 text-amber-400" />;
    return <XCircle className="w-3 h-3 text-gray-400" />;
  };

  return (
    <span className={`${baseStyle} ${style} inline-flex items-center gap-1.5`}>
      {getSigningIndicator()}
      {safeStatus.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
    </span>
  );
}

function formatDate(dateValue) {
  if (!dateValue) return '—';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return '—';

  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatCurrency(value) {
  const num = Number(value);
  if (Number.isNaN(num) || value == null) return '—';
  return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function countDeliverables(deliverables) {
  if (!Array.isArray(deliverables)) return 0;
  return deliverables.reduce((sum, d) => sum + (Number(d?.count) || 0), 0);
}

function getDeliverablesSummary(deliverables) {
  if (!Array.isArray(deliverables) || deliverables.length === 0) return '—';
  const summary = deliverables
    .filter(d => d?.type && d?.count)
    .map(d => `${d.count} ${d.type}${d.count > 1 ? 's' : ''}${d.platform ? ` (${d.platform})` : ''}`)
    .join(', ');
  return summary || `${deliverables.length} item${deliverables.length > 1 ? 's' : ''}`;
}

function getDurationDays(startDate, endDate) {
  if (!startDate || !endDate) return '—';
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '—';

  const diff = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
  return `${diff} days`;
}

// Helper to get campaign and influencer names from new API structure
function getContractDisplayData(contract) {
  const collab = contract?.collaboration || {};
  // Try to get names from various possible locations in the data
  return {
    campaignName: contract?.campaignName || collab?.campaign?.name || `Campaign #${collab?.campaignId || contract?.collaborationId || ''}`,
    influencerName: contract?.influencerName || collab?.influencer?.name || `Influencer #${collab?.influencerId || ''}`,
    ownerName: contract?.ownerName || collab?.owner?.name || `Owner #${collab?.ownerId || ''}`,
  };
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

  // Dropdown states for Filter Status
  const [statusQuery, setStatusQuery] = useState('');
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'partially_signed', label: 'Partially Signed' },
    { value: 'signed', label: 'Signed' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'terminated', label: 'Terminated' },
  ];

  const filteredStatuses = statusOptions.filter((s) =>
    s.label.toLowerCase().includes(statusQuery.trim().toLowerCase())
  );

  const filteredContracts = (contracts || []).filter((contract) => {
    const displayData = getContractDisplayData(contract);
    const campaign = String(displayData.campaignName || '').toLowerCase();
    const influencer = String(displayData.influencerName || '').toLowerCase();
    const contractStatus = String(contract?.status || '').toLowerCase();
    const agreedPrice = String(contract?.agreedPrice || '');

    const matchesSearch = !q || campaign.includes(q) || influencer.includes(q) || agreedPrice.includes(q);
    const matchesStatus = filterStatus === 'all' || contractStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalValue = (contracts || []).reduce((sum, contract) => sum + (Number(contract?.agreedPrice) || 0), 0);
  const totalDeliverables = (contracts || []).reduce((sum, contract) => sum + countDeliverables(contract?.deliverables), 0);

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

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <div className="rounded-xl border border-[#745CB4]/25 bg-[#1A112C]/65 backdrop-blur-sm p-4">
          <p className="text-xs text-[#9CA3AF] mb-1">Total Contracts</p>
          <p className="text-2xl font-bold text-white">{contracts.length}</p>
        </div>
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 backdrop-blur-sm p-4">
          <p className="text-xs text-[#9CA3AF] mb-1">Active / Signed</p>
          <p className="text-2xl font-bold text-green-300">
            {contracts.filter((c) => c?.status === 'active' || c?.status === 'signed').length}
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm p-4">
          <p className="text-xs text-[#9CA3AF] mb-1">Partially Signed</p>
          <p className="text-2xl font-bold text-amber-300">
            {contracts.filter((c) => c?.status === 'partially_signed').length}
          </p>
        </div>
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm p-4">
          <p className="text-xs text-[#9CA3AF] mb-1">Total Deliverables</p>
          <p className="text-2xl font-bold text-blue-300">{totalDeliverables}</p>
        </div>
        <div className="rounded-xl border border-[#745CB4]/30 bg-[#241A3A]/70 backdrop-blur-sm p-4">
          <p className="text-xs text-[#9CA3AF] mb-1">Total Value</p>
          <p className="text-2xl font-bold text-[#C1B6FD]">{formatCurrency(totalValue)}</p>
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

        <div className="relative">
          <input
            type="text"
            value={statusOptions.find(s => s.value === filterStatus)?.label || statusQuery}
            onChange={(e) => {
              setStatusQuery(e.target.value);
              setIsStatusOpen(true);
            }}
            onFocus={() => setIsStatusOpen(true)}
            onBlur={() => setTimeout(() => setIsStatusOpen(false), 120)}
            placeholder="Filter by status"
            className="w-full rounded-xl border border-[#745CB4]/25 bg-[#1A112C]/65 backdrop-blur-sm px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/45"
          />
          {isStatusOpen && (
            <div className="absolute top-full mt-2 right-0 w-full min-w-[160px] z-20 bg-[#10121f] border border-white/10 rounded-lg max-h-56 overflow-y-auto shadow-xl">
              {filteredStatuses.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onFilterChange(option.value);
                    setStatusQuery('');
                    setIsStatusOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150"
                >
                  <span className="flex items-center justify-between">
                    {option.label}
                    {filterStatus === option.value && (
                      <CheckCircle2 className="w-4 h-4 text-[#C1B6FD]" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
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
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-[#9CA3AF]">Contract</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-[#9CA3AF]">Campaign / Influencer</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-[#9CA3AF]">Agreed Price</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-[#9CA3AF]">Deliverables</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-[#9CA3AF]">Duration</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-[#9CA3AF]">Status</th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-[#9CA3AF]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map((contract, index) => {
                  const displayData = getContractDisplayData(contract);
                  return (
                    <tr
                      key={contract?.id || contract?._id || index}
                      className={`border-b border-[#745CB4]/15 hover:bg-[#241A3A]/30 transition-colors cursor-pointer ${
                        index === filteredContracts.length - 1 ? 'border-b-0' : ''
                      }`}
                      onClick={() => onOpenDetails(contract)}
                    >
                      <td className="py-3.5 px-4 text-sm text-white font-mono">
                        #{String(contract?.id || '').toString().padStart(3, '0')}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-sm text-white font-medium truncate max-w-[180px]">{displayData.campaignName}</div>
                        <div className="text-xs text-[#C1B6FD] truncate max-w-[180px]">{displayData.influencerName}</div>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-white font-semibold">
                        {formatCurrency(contract?.agreedPrice)}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-[#9CA3AF]">
                        <div className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5" />
                          {countDeliverables(contract?.deliverables)}
                        </div>
                        <p className="text-[10px] mt-0.5 truncate max-w-[150px]">{getDeliverablesSummary(contract?.deliverables)}</p>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-[#9CA3AF]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {getDurationDays(contract?.startDate, contract?.endDate)}
                        </div>
                        <p className="text-[11px] mt-0.5">{formatDate(contract?.startDate)} - {formatDate(contract?.endDate)}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge 
                          status={contract?.status} 
                          ownerSigned={contract?.ownerSigned}
                          influencerSigned={contract?.influencerSigned}
                        />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onOpenDetails(contract); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#745CB4]/30 text-[#C1B6FD] hover:border-[#C1B6FD]/40 hover:text-white transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden divide-y divide-[#745CB4]/20">
            {filteredContracts.map((contract, index) => {
              const displayData = getContractDisplayData(contract);
              return (
                <div 
                  key={contract?.id || contract?._id || index} 
                  className="p-4 space-y-3 cursor-pointer hover:bg-[#241A3A]/30 transition-colors"
                  onClick={() => onOpenDetails(contract)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-[#9CA3AF] font-mono mb-1">#{String(contract?.id || '').toString().padStart(3, '0')}</p>
                      <h4 className="text-sm font-semibold text-white">{displayData.campaignName}</h4>
                      <p className="text-xs text-[#C1B6FD]">{displayData.influencerName}</p>
                    </div>
                    <StatusBadge 
                      status={contract?.status}
                      ownerSigned={contract?.ownerSigned}
                      influencerSigned={contract?.influencerSigned}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[#9CA3AF]">Agreed Price</p>
                      <p className="text-white font-semibold">{formatCurrency(contract?.agreedPrice)}</p>
                    </div>
                    <div>
                      <p className="text-[#9CA3AF]">Deliverables</p>
                      <p className="text-white font-semibold">{countDeliverables(contract?.deliverables)}</p>
                    </div>
                    <div>
                      <p className="text-[#9CA3AF]">Duration</p>
                      <p className="text-white font-semibold">{getDurationDays(contract?.startDate, contract?.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-[#9CA3AF]">Dates</p>
                      <p className="text-white font-semibold">{formatDate(contract?.startDate)}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onOpenDetails(contract); }}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#745CB4]/30 text-[#C1B6FD] hover:border-[#C1B6FD]/40 hover:text-white transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Contract
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
