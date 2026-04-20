import { FilePlus2, Save, X } from 'lucide-react';
import { useState } from 'react';

const INITIAL_FORM = {
  collaborationId: '',
  budget: '',
  startDate: '',
  endDate: '',
  terms: '',
  deliverables: '',
  paymentTerms: '',
};

export default function CreateContract({ onCreate, onCancel, isSubmitting }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.collaborationId.trim()) {
      setError('Collaboration ID is required.');
      return;
    }

    if (!form.budget || Number(form.budget) <= 0) {
      setError('Budget must be greater than 0.');
      return;
    }

    if (!form.startDate || !form.endDate) {
      setError('Start and end date are required.');
      return;
    }

    setError('');

    await onCreate({
      collaborationId: form.collaborationId.trim(),
      payload: {
        budget: Number(form.budget),
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
      <div className="flex items-center justify-between gap-3 mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-semibold text-[#9CA3AF]">Collaboration ID</span>
            <input
              type="text"
              value={form.collaborationId}
              onChange={(e) => handleChange('collaborationId', e.target.value)}
              placeholder="e.g. 67f2ab1..."
              className="mt-1.5 w-full rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/65 px-3 py-2.5 text-sm text-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#C1B6FD]/45"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-[#9CA3AF]">Budget</span>
            <input
              type="number"
              value={form.budget}
              min="1"
              onChange={(e) => handleChange('budget', e.target.value)}
              placeholder="0"
              className="mt-1.5 w-full rounded-lg border border-[#745CB4]/25 bg-[#1A112C]/65 px-3 py-2.5 text-sm text-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#C1B6FD]/45"
            />
          </label>

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
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#C1B6FD]/45 bg-linear-to-r from-[#241A3A]/90 to-[#1A112C]/90 text-white font-semibold disabled:opacity-60"
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
