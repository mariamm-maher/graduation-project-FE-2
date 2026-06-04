import { FileText, RotateCcw, Sparkles } from 'lucide-react';
import { useState } from 'react';

function ResumeDraftBanner({ onResume, onStartFresh, isLoading }) {
  const [isResuming, setIsResuming] = useState(false);
  const [isStartingFresh, setIsStartingFresh] = useState(false);

  const handleResume = async () => {
    setIsResuming(true);
    try {
      await onResume();
    } finally {
      setIsResuming(false);
    }
  };

  const handleStartFresh = async () => {
    setIsStartingFresh(true);
    try {
      await onStartFresh();
    } finally {
      setIsStartingFresh(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#241A3A]/80 to-[#1A112C]/80 border border-[#745CB4]/30 rounded-xl p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#745CB4]/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#C1B6FD]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Unfinished Draft Available</h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              You have a saved campaign draft. Resume where you left off or start fresh.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStartFresh}
            disabled={isLoading || isStartingFresh || isResuming}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#745CB4]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isStartingFresh ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Start Fresh
              </>
            )}
          </button>

          <button
            onClick={handleResume}
            disabled={isLoading || isStartingFresh || isResuming}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#745CB4] text-white hover:bg-[#C1B6FD]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isResuming ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Resume Draft
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResumeDraftBanner;
