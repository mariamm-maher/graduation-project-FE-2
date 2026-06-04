import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

function VersionSelector({ versions, currentVersionIndex, onVersionChange }) {
  if (versions.length <= 1) return null;

  const currentVersion = versions[currentVersionIndex];

  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePrevious = () => {
    if (currentVersionIndex > 0) {
      onVersionChange(currentVersionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentVersionIndex < versions.length - 1) {
      onVersionChange(currentVersionIndex + 1);
    }
  };

  const handleDropdownChange = (e) => {
    onVersionChange(parseInt(e.target.value, 10));
  };

  return (
    <div className="flex items-center gap-4 bg-[#1A112C]/60 border border-[#745CB4]/20 rounded-lg px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#9CA3AF]">Version</span>

        <select
          value={currentVersionIndex}
          onChange={handleDropdownChange}
          className="bg-[#241A3A] border border-[#745CB4]/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#C1B6FD]/50 cursor-pointer"
        >
          {versions.map((version, index) => (
            <option key={index} value={index}>
              {version.versionNumber} of {versions.length}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1 border-l border-[#745CB4]/20 pl-4">
        <button
          onClick={handlePrevious}
          disabled={currentVersionIndex === 0}
          className="p-1.5 rounded hover:bg-[#745CB4]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous version"
        >
          <ChevronLeft className="w-4 h-4 text-[#C1B6FD]" />
        </button>

        <span className="text-sm text-[#C1B6FD] min-w-[60px] text-center">
          {currentVersionIndex + 1} / {versions.length}
        </span>

        <button
          onClick={handleNext}
          disabled={currentVersionIndex === versions.length - 1}
          className="p-1.5 rounded hover:bg-[#745CB4]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next version"
        >
          <ChevronRight className="w-4 h-4 text-[#C1B6FD]" />
        </button>
      </div>

      {currentVersion?.generatedAt && (
        <div className="flex items-center gap-1.5 border-l border-[#745CB4]/20 pl-4 text-xs text-[#9CA3AF]">
          <Clock className="w-3.5 h-3.5" />
          <span>Generated {formatTimestamp(currentVersion.generatedAt)}</span>
        </div>
      )}
    </div>
  );
}

export default VersionSelector;
