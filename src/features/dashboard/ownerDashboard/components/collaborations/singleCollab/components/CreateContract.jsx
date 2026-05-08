import { FilePlus2, Save, X, ChevronDown, Lock } from 'lucide-react';
import { useState } from 'react';

function ReadOnlyField({ label, value }) {
  return (
    <div className="block">
      <span className="text-xs font-semibold text-[#9CA3AF] flex items-center gap-1">
        <Lock className="w-3 h-3 opacity-60" />
        {label}
      </span>
      <div className="mt-1.5 w-full rounded-lg border border-[#745CB4]/15 bg-[#1A112C]/40 px-3 py-2.5 text-sm text-[#C1B6FD] select-all cursor-default">
        {value || <span className="text-[#9CA3AF] italic">—</span>}
      </div>
    </div>
  );
}

function CollabPicker({ allCollaborations, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const options = (allCollaborations || []).filter(c => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const campaign = String(c?.campaign?.campaignName || c?.campaignName || '').toLowerCase();
    const influencer = String(
      `${c?.influencer?.firstName || ''} ${c?.influencer?.lastName || ''}`.trim() ||
      c?.influencerName || ''
    ).toLowerCase();
    return campaign.includes(q) || influencer.includes(q);
  });

  const label = selected
    ? `${selected?.campaign?.campaignName || selected?.campaignName || 'Campaign'} — ${
        `${selected?.influencer?.firstName || ''} ${selected?.influencer?.lastName || ''}`.trim() ||
        selected?.influencerName || 'Influencer'
      }`
    : 'Select a collaboration...';

  return (
    <div className="relative">
      <span className="text-xs font-semibold text-[#9CA3AF] mb-1.5 block">Collaboration</span>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between rounded-lg border border-[#745CB4]/30 bg-[#1A112C]/65 px-3 py-2.5 text-sm text-left focus:outline-none focus:border-[#C1B6FD]/45 hover:border-[#745CB4]/50 transition-all"
      >
        <span className={selected ? 'text-white' : 'text-[#9CA3AF]'}>{label}</span>
        <ChevronDown className={`w-4 h-4 text-[#9CA3AF] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full bg-[#10121f] border border-[#745CB4]/30 rounded-lg shadow-2xl max-h-56 flex flex-col">
          <div className="p-2 border-b border-[#745CB4]/20">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search campaigns..."
              className="w-full bg-[#1A112C]/70 border border-[#745CB4]/20 rounded-md px-3 py-1.5 text-xs text-white placeholder:text-[#9CA3AF] focus:outline-none"
            />
          </div>
          <div className="overflow-y-auto">
            {options.length === 0 ? (
              <p className="text-xs text-[#9CA3AF] text-center py-4">No collaborations found</p>
            ) : (
              options.map((c, i) => {
                const campName = c?.campaign?.campaignName || c?.campaignName || `Collaboration #${c?.id || i}`;
                const inflName = `${c?.influencer?.firstName || ''} ${c?.influencer?.lastName || ''}`.trim() || c?.influencerName || 'Unknown Influencer';
                const budget = c?.request?.counterPrice ?? c?.request?.proposedBudget ?? c?.agreedBudget ?? c?.budget ?? null;
                return (
                  <button
                    key={c?.id || i}
                    type="button"
                    onClick={() => { onSelect(c); setOpen(false); setQuery(''); }}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#241A3A]/60 transition-colors border-b border-[#745CB4]/10 last:border-0"
                  >
                    <p className="text-sm text-white font-medium truncate">{campName}</p>
                    <p className="text-xs text-[#C1B6FD] truncate">
                      {inflName}
                      {budget != null ? <span className="text-[#9CA3AF] ml-2">${Number(budget).toLocaleString()}</span> : null}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateContract({
  onCreate,
  onCancel,
  isSubmitting,
  collaboration,
  allCollaborations,
  onCollaborationSelect,
}) {
  const agreedPrice =
    collaboration?.request?.counterPrice ??
    collaboration?.request?.proposedBudget ??
    collaboration?.agreedBudget ??
    collaboration?.budget ??
    '';

  const campName = collaboration?.campaign?.campaignName || collaboration?.campaignName || '';
  const inflName =
    `${collaboration?.influencer?.firstName || ''} ${collaboration?.influencer?.lastName || ''}`.trim() ||
    collaboration?.influencerName || '';
  const ownerId  = collaboration?.ownerId  ? String(collaboration.ownerId)  : '';
  const inflId   = collaboration?.influencerId ? String(collaboration.influencerId) : '';
  const campaignId = collaboration?.campaignId ? String(collaboration.campaignId) : '';

  const [form, setForm] = useState({ startDate: '', endDate: '', terms: '', deliverables: '', paymentTerms: '' });
  const [error, setError] = useState('');

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!collaboration) {
      setError('Please select a collaboration first.');
      return;
    }
    if (!form.startDate || !form.endDate) {
      setError('Start and end date are required.');
      return;
    }

    setError('');
    await onCreate({
      collaborationId: String(collaboration.id),
      payload: {
        agreedPrice: Number(agreedPrice) || 0,
        startDate: form.startDate,
        endDate: form.endDate,
        terms: form.terms,
        deliverables: form.deliverables,
        paymentTerms: form.paymentTerms,
      },
    });
  };

  return (
    <div className="rounded-xl border border-[#745CB4]/25 bg-linear-to-b from-[#241A3A]/70 to-[#1A112C]/70 backdrop-blur-md p-5">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h3 className="text-xl font-bold text-white inline-flex items-center gap-2">
          <FilePlus2 className="w-5 h-5 text-[#C1B6FD]" />
          Create Contract
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-[#745CB4]/35 text-[#C1B6FD] hover:text-white hover:border-[#C1B6FD]/40 transition-all"
        >
          <X className="w-4 h-4" />
          Close
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Collaboration picker */}
        <CollabPicker
          allCollaborations={allCollaborations}
          selected={collaboration}
          onSelect={onCollaborationSelect}
        />

        {/* Read-only fields from the selected collaboration */}
        {collaboration && (
          <>
            <p className="text-[11px] font-semibold text-[#745CB4] uppercase tracking-widest pt-1">
              From collaboration request
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ReadOnlyField label="Collaboration ID" value={String(collaboration.id)} />
              <ReadOnlyField label="Agreed Price" value={agreedPrice !== '' ? `$${Number(agreedPrice).toLocaleString()}` : undefined} />
              <ReadOnlyField label="Campaign" value={campName} />
              <ReadOnlyField label="Influencer" value={inflName} />
              {ownerId  && <ReadOnlyField label="Owner ID"      value={ownerId} />}
              {inflId   && <ReadOnlyField label="Influencer ID" value={inflId} />}
              {campaignId && <ReadOnlyField label="Campaign ID"  value={campaignId} />}
            </div>
            <div className="border-t border-[#745CB4]/15 pt-4">
              <p className="text-[11px] font-semibold text-[#745CB4] uppercase tracking-widest mb-3">
                Contract details
              </p>
            </div>
          </>
        )}

        {/* Editable fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-semibold text-[#9CA3AF]">Start Date</span>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/65 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C1B6FD]/45"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[#9CA3AF]">End Date</span>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/65 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C1B6FD]/45"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-xs font-semibold text-[#9CA3AF]">Deliverables</span>
          <textarea
            rows={3}
            value={form.deliverables}
            onChange={(e) => handleChange('deliverables', e.target.value)}
            placeholder="Define expected deliverables"
            className="mt-1.5 w-full rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/65 px-3 py-2.5 text-sm text-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#C1B6FD]/45"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-[#9CA3AF]">Terms</span>
          <textarea
            rows={3}
            value={form.terms}
            onChange={(e) => handleChange('terms', e.target.value)}
            placeholder="Contract terms"
            className="mt-1.5 w-full rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/65 px-3 py-2.5 text-sm text-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#C1B6FD]/45"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-[#9CA3AF]">Payment Terms</span>
          <textarea
            rows={2}
            value={form.paymentTerms}
            onChange={(e) => handleChange('paymentTerms', e.target.value)}
            placeholder="Milestones, schedule, and conditions"
            className="mt-1.5 w-full rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/65 px-3 py-2.5 text-sm text-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#C1B6FD]/45"
          />
        </label>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={isSubmitting || !collaboration}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#C1B6FD]/45 bg-linear-to-r from-[#241A3A]/90 to-[#1A112C]/90 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Creating...' : 'Create Contract'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#745CB4]/35 text-[#C1B6FD] hover:text-white hover:border-[#C1B6FD]/40"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
