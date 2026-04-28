import { Calendar, CheckCircle2, Clock, DollarSign, FileText, User } from 'lucide-react';

export default function ContractDetails({ contract, onBack, onSignOwner, isSigning }) {
  if (!contract) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 text-center">
        <h3 className="text-lg font-bold text-white mb-2">No contract selected</h3>
        <p className="text-sm text-gray-400">Select a contract from the list to view details.</p>
      </div>
    );
  }

  const amount = Number(contract.agreedPrice || contract.agreedBudget || contract.amount || 0);
  const status = contract.status || 'draft';
  const ownerCanSign = contract.ownerSigned === false;
  const deliverables = Array.isArray(contract.deliverables) ? contract.deliverables : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Contract Details</h1>
          <p className="text-sm text-gray-400">Collaboration #{contract.collaborationId || '—'}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-[#C1B6FD] hover:underline self-start sm:self-auto"
        >
          ← Back to Contracts
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-5">
        {/* Key info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Status</p>
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
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">Agreed Price</p>
            <p className="text-white font-semibold inline-flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {amount.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">Start Date</p>
            <p className="text-white text-sm inline-flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              {contract.startDate || 'Not set'}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">End Date</p>
            <p className="text-white text-sm inline-flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              {contract.endDate || 'Not set'}
            </p>
          </div>
        </div>

        {/* Notes */}
        {contract.notes && (
          <div className="border-t border-white/10 pt-4">
            <p className="text-xs text-gray-400 mb-1">Notes</p>
            <p className="text-sm text-gray-300">{contract.notes}</p>
          </div>
        )}

        {/* Deliverables */}
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-sm font-semibold text-white mb-3">Deliverables</h3>
          {deliverables.length === 0 ? (
            <p className="text-sm text-gray-400">No deliverables listed.</p>
          ) : (
            <div className="space-y-2">
              {deliverables.map((item, idx) => {
                const isString = typeof item === 'string';
                const title = isString ? `Deliverable ${idx + 1}` : item.title || item.name || `Deliverable ${idx + 1}`;
                const description = isString ? item : item.description || item.details;
                return (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p className="text-sm font-medium text-white">{title}</p>
                      {!isString && item.status && (
                        <span className="text-xs text-gray-300 bg-white/10 px-2 py-0.5 rounded-full">{String(item.status)}</span>
                      )}
                    </div>
                    {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Signatures */}
        <div className="border-t border-white/10 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1 inline-flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Owner Signature
            </p>
            <p className="text-sm text-white inline-flex items-center gap-1">
              {contract.ownerSigned
                ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                : <Clock className="w-4 h-4 text-amber-400" />}
              {contract.ownerSigned ? 'Signed' : 'Pending'}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1 inline-flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Influencer Signature
            </p>
            <p className="text-sm text-white inline-flex items-center gap-1">
              {contract.influencerSigned
                ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                : <Clock className="w-4 h-4 text-amber-400" />}
              {contract.influencerSigned ? 'Signed' : 'Pending'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-white/10 pt-4 flex flex-wrap gap-2">
          {contract.contractFileUrl && (
            <a
              href={contract.contractFileUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white text-sm font-medium transition-all inline-flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Open Contract File
            </a>
          )}

          {ownerCanSign && (
            <button
              type="button"
              onClick={() => onSignOwner(contract.id || contract._id)}
              disabled={isSigning}
              className="px-4 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-60"
            >
              {isSigning ? 'Signing...' : 'Sign as Owner'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
