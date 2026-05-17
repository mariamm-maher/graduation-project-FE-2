/**
 * Shared brand voice sliders + vocabulary inputs (PrepareCampaign, onboarding).
 */
export default function BrandVoiceFields({ brandTone, onChange }) {
  const tone = brandTone || {
    tone_formality: 3,
    tone_playfulness: 3,
    tone_boldness: 3,
    preferred_vocabulary: [],
    avoided_vocabulary: [],
  };

  const updateTone = (patch) => onChange({ ...tone, ...patch });

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300">Brand Voice</label>
      <p className="text-xs text-gray-500">
        These sliders guide how the AI writes all content for your brand.
      </p>

      {[
        { label: 'Tone', left: 'Casual', right: 'Formal', field: 'tone_formality' },
        { label: 'Style', left: 'Serious', right: 'Playful', field: 'tone_playfulness' },
        { label: 'Energy', left: 'Subtle', right: 'Bold', field: 'tone_boldness' },
      ].map(({ label, left, right, field }) => {
        const value = tone[field] ?? 3;
        return (
          <div key={field} className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>
                {label}: <span className="text-white">{left} → {right}</span>
              </span>
              <span className="text-[#C1B6FD]">{value} / 5</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-14 text-right">{left}</span>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={value}
                onChange={(e) => updateTone({ [field]: Number(e.target.value) })}
                className="flex-1 accent-[#C1B6FD]"
              />
              <span className="text-xs text-gray-500 w-14">{right}</span>
            </div>
          </div>
        );
      })}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Words you always use <span className="text-gray-500">(comma separated)</span>
          </label>
          <input
            type="text"
            value={(tone.preferred_vocabulary || []).join(', ')}
            onChange={(e) =>
              updateTone({
                preferred_vocabulary: e.target.value
                  .split(',')
                  .map((v) => v.trim())
                  .filter(Boolean),
              })
            }
            placeholder="e.g. craft, effortless, smart"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Words to avoid <span className="text-gray-500">(comma separated)</span>
          </label>
          <input
            type="text"
            value={(tone.avoided_vocabulary || []).join(', ')}
            onChange={(e) =>
              updateTone({
                avoided_vocabulary: e.target.value
                  .split(',')
                  .map((v) => v.trim())
                  .filter(Boolean),
              })
            }
            placeholder="e.g. cheap, basic, discount"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50"
          />
        </div>
      </div>
    </div>
  );
}
