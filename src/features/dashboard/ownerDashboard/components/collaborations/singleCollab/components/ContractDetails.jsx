import { 
  ArrowLeft, Calendar, CheckCircle, Clock, DollarSign, 
  FileText, Signature, XCircle, FileCheck, Package, 
  User, Users, ExternalLink, StickyNote, History, Download
} from 'lucide-react';

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDateOnly(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatCurrency(value) {
  const num = Number(value);
  if (Number.isNaN(num) || value == null) return '—';
  return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function StatusBadge({ status, ownerSigned, influencerSigned }) {
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
  
  const getSigningIndicator = () => {
    if (ownerSigned && influencerSigned) return <CheckCircle className="w-3.5 h-3.5 text-green-400" />;
    if (ownerSigned || influencerSigned) return <FileCheck className="w-3.5 h-3.5 text-amber-400" />;
    return <XCircle className="w-3.5 h-3.5 text-gray-400" />;
  };

  return (
    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border inline-flex items-center gap-1.5 ${style}`}>
      {getSigningIndicator()}
      {safeStatus.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
    </span>
  );
}

function InfoCard({ icon: Icon, title, value, subtext, accent = false }) {
  return (
    <div className={`rounded-lg border p-3.5 ${accent ? 'border-[#C1B6FD]/30 bg-[#241A3A]/70' : 'border-[#745CB4]/25 bg-[#1A112C]/65'} backdrop-blur-sm`}>
      <p className="text-xs text-[#9CA3AF] inline-flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3.5 h-3.5" />
        {title}
      </p>
      <p className="text-sm font-semibold text-white wrap-break-word">{value || '—'}</p>
      {subtext && <p className="text-xs text-[#9CA3AF] mt-1">{subtext}</p>}
    </div>
  );
}

function DeliverableItem({ item }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-[#745CB4]/20 bg-[#1A112C]/40">
      <div className="w-8 h-8 rounded-lg bg-[#745CB4]/20 flex items-center justify-center shrink-0">
        <Package className="w-4 h-4 text-[#C1B6FD]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white capitalize">{item?.type || 'Item'}</p>
        {item?.platform && (
          <p className="text-xs text-[#9CA3AF]">Platform: {item.platform}</p>
        )}
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-[#C1B6FD]">{item?.count || 0}</p>
        <p className="text-xs text-[#9CA3AF]">qty</p>
      </div>
    </div>
  );
}

function SigningStatus({ label, signed, signedAt }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${signed ? 'border-green-500/30 bg-green-500/10' : 'border-gray-500/30 bg-gray-500/10'}`}>
      <div className="flex items-center gap-2">
        {signed ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-gray-400" />}
        <span className={`text-sm font-medium ${signed ? 'text-green-300' : 'text-gray-400'}`}>{label}</span>
      </div>
      <div className="text-right">
        {signed ? (
          <>
            <p className="text-xs text-green-400 font-medium">Signed</p>
            <p className="text-[10px] text-[#9CA3AF]">{formatDate(signedAt)}</p>
          </>
        ) : (
          <p className="text-xs text-gray-500">Pending</p>
        )}
      </div>
    </div>
  );
}

export default function ContractDetails({ contract, onBack, onSignOwner, isSigning }) {
  if (!contract) {
    return (
      <div className="rounded-xl border border-[#745CB4]/25 bg-[#1A112C]/65 backdrop-blur-sm p-5">
        <p className="text-sm text-[#9CA3AF]">No contract selected.</p>
      </div>
    );
  }

  const contractId = contract?.id || contract?._id;
  const collab = contract?.collaboration || {};
  const deliverables = contract?.deliverables || [];
  
  // Get names from nested collaboration data if available
  const campaignName = contract?.campaignName || collab?.campaign?.name || `Campaign #${collab?.campaignId || contract?.collaborationId || ''}`;
  
  // For influencer/owner names, we'd need to fetch them from the collaboration
  const influencerName = collab?.influencer?.name || `Influencer #${collab?.influencerId || ''}`;
  const ownerName = collab?.owner?.name || `Owner #${collab?.ownerId || ''}`;

  // Determine if owner can sign
  const canOwnerSign = !contract?.ownerSigned && (contract?.status === 'draft' || contract?.status === 'partially_signed');

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#745CB4]/35 text-[#C1B6FD] hover:text-white hover:border-[#C1B6FD]/45 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to contracts
        </button>

        <div className="inline-flex items-center gap-2">
          <StatusBadge 
            status={contract?.status} 
            ownerSigned={contract?.ownerSigned}
            influencerSigned={contract?.influencerSigned}
          />
          {canOwnerSign && (
            <button
              type="button"
              disabled={isSigning}
              onClick={() => onSignOwner(contractId)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-green-500/40 bg-green-500/15 text-green-200 hover:bg-green-500/20 transition-all disabled:opacity-60"
            >
              <Signature className="w-4 h-4" />
              {isSigning ? 'Signing...' : 'Sign as Owner'}
            </button>
          )}
        </div>
      </div>

      {/* ── Main Details Card ── */}
      <div className="rounded-xl border border-[#745CB4]/25 bg-linear-to-b from-[#241A3A]/70 to-[#1A112C]/70 backdrop-blur-md p-5 space-y-5">
        
        {/* Title Section */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#745CB4]/20 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-[#C1B6FD]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Contract #{String(contractId || '').padStart(3, '0')}</h3>
            <p className="text-sm text-[#9CA3AF]">{campaignName}</p>
          </div>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <InfoCard icon={DollarSign} title="Agreed Price" value={formatCurrency(contract?.agreedPrice)} accent />
          <InfoCard icon={Calendar} title="Start Date" value={formatDateOnly(contract?.startDate)} />
          <InfoCard icon={Calendar} title="End Date" value={formatDateOnly(contract?.endDate)} />
          <InfoCard 
            icon={Package} 
            title="Deliverables" 
            value={deliverables.reduce((sum, d) => sum + (Number(d?.count) || 0), 0)} 
            subtext={`${deliverables.length} type${deliverables.length !== 1 ? 's' : ''}`}
          />
        </div>

        {/* Participants */}
        <div className="rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/50 p-4">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-[#C1B6FD]" /> Participants
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-[#745CB4]/20 bg-[#241A3A]/40">
              <div className="w-8 h-8 rounded-full bg-[#745CB4]/30 flex items-center justify-center">
                <User className="w-4 h-4 text-[#C1B6FD]" />
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF]">Owner</p>
                <p className="text-sm font-semibold text-white">{ownerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-[#745CB4]/20 bg-[#241A3A]/40">
              <div className="w-8 h-8 rounded-full bg-[#C1B6FD]/30 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF]">Influencer</p>
                <p className="text-sm font-semibold text-white">{influencerName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deliverables Section */}
        {deliverables.length > 0 && (
          <div className="rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/50 p-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-[#C1B6FD]" /> Deliverables
            </h4>
            <div className="space-y-2">
              {deliverables.map((item, idx) => (
                <DeliverableItem key={idx} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Signing Status */}
        <div className="rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/50 p-4">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
            <FileCheck className="w-4 h-4 text-[#C1B6FD]" /> Signing Status
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SigningStatus 
              label="Owner Signature" 
              signed={contract?.ownerSigned} 
              signedAt={contract?.ownerSignedAt} 
            />
            <SigningStatus 
              label="Influencer Signature" 
              signed={contract?.influencerSigned} 
              signedAt={contract?.influencerSignedAt} 
            />
          </div>
        </div>

        {/* Notes */}
        {contract?.notes && (
          <div className="rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/50 p-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
              <StickyNote className="w-4 h-4 text-[#C1B6FD]" /> Notes
            </h4>
            <p className="text-sm text-white whitespace-pre-wrap">{contract.notes}</p>
          </div>
        )}

        {/* Contract File */}
        {contract?.contractFileUrl && (
          <div className="rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/50 p-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Download className="w-4 h-4 text-[#C1B6FD]" /> Contract Document
            </h4>
            <a
              href={contract.contractFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#745CB4]/40 bg-[#241A3A]/70 text-[#C1B6FD] hover:bg-[#745CB4]/20 hover:text-white transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              View / Download PDF
            </a>
          </div>
        )}

        {/* Timeline Info */}
        <div className="rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/50 p-4">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-[#C1B6FD]" /> Contract Timeline
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Created</span>
              <span className="text-white">{formatDate(contract?.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Last Updated</span>
              <span className="text-white">{formatDate(contract?.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Collaboration Info */}
        {collab?.id && (
          <div className="rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/50 p-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-[#C1B6FD]" /> Linked Collaboration
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-xs text-[#9CA3AF]">ID</p>
                <p className="text-white font-mono">#{collab.id}</p>
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF]">Status</p>
                <p className="text-white capitalize">{collab.status?.replace(/_/g, ' ') || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF]">Campaign ID</p>
                <p className="text-white font-mono">#{collab.campaignId || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF]">Influencer ID</p>
                <p className="text-white font-mono">#{collab.influencerId || '—'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
