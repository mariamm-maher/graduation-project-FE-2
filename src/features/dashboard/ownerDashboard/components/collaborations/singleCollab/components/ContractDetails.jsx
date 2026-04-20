import { ArrowLeft, CalendarClock, CheckCheck, DollarSign, FileText, Signature } from 'lucide-react';

function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

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

function InfoCard({ icon, title, value }) {
  const IconComponent = icon;

  return (
    <div className="rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/65 backdrop-blur-sm p-3.5">
      <p className="text-xs text-[#9CA3AF] inline-flex items-center gap-1.5 mb-1.5">
        <IconComponent className="w-3.5 h-3.5" />
        {title}
      </p>
      <p className="text-sm font-semibold text-white wrap-break-word">{value || 'N/A'}</p>
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

  const contractId = contract?._id || contract?.id;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#745CB4]/35 text-[#C1B6FD] hover:text-white hover:border-[#C1B6FD]/45 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to contracts
        </button>

        <div className="inline-flex items-center gap-2">
          <StatusBadge status={contract?.status} />
          {String(contract?.status || '').toLowerCase() === 'draft' ? (
            <button
              type="button"
              disabled={isSigning}
              onClick={() => onSignOwner(contractId)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-green-500/40 bg-green-500/15 text-green-200 hover:bg-green-500/20 transition-all disabled:opacity-60"
            >
              <Signature className="w-4 h-4" />
              {isSigning ? 'Signing...' : 'Sign as Owner'}
            </button>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-[#745CB4]/25 bg-linear-to-b from-[#241A3A]/70 to-[#1A112C]/70 backdrop-blur-md p-5">
        <h3 className="text-xl font-bold text-white inline-flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-[#C1B6FD]" />
          Contract Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <InfoCard icon={FileText} title="Contract ID" value={String(contractId || 'N/A')} />
          <InfoCard icon={DollarSign} title="Budget" value={`$${(Number(contract?.budget) || 0).toLocaleString()}`} />
          <InfoCard icon={CalendarClock} title="Start Date" value={formatDate(contract?.startDate)} />
          <InfoCard icon={CalendarClock} title="End Date" value={formatDate(contract?.endDate)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          <InfoCard title="Campaign" icon={CheckCheck} value={contract?.campaignName} />
          <InfoCard title="Influencer" icon={CheckCheck} value={contract?.influencerName} />
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/65 backdrop-blur-sm p-3.5">
            <p className="text-xs font-semibold text-[#9CA3AF] mb-1.5">Deliverables</p>
            <p className="text-sm text-white whitespace-pre-wrap">{contract?.deliverables || 'N/A'}</p>
          </div>

          <div className="rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/65 backdrop-blur-sm p-3.5">
            <p className="text-xs font-semibold text-[#9CA3AF] mb-1.5">Terms</p>
            <p className="text-sm text-white whitespace-pre-wrap">{contract?.terms || 'N/A'}</p>
          </div>

          <div className="rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/65 backdrop-blur-sm p-3.5">
            <p className="text-xs font-semibold text-[#9CA3AF] mb-1.5">Payment Terms</p>
            <p className="text-sm text-white whitespace-pre-wrap">{contract?.paymentTerms || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
