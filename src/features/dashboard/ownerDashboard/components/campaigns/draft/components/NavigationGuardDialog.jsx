import { AlertTriangle, Save, LogOut, X } from 'lucide-react';

function NavigationGuardDialog({
  isOpen,
  isSaving,
  onSaveAsDraft,
  onLeaveWithoutSaving,
  onStay,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A112C] border border-[#745CB4]/30 rounded-2xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Unsaved Campaign</h2>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                You have an unsaved campaign. Do you want to save it as a draft before leaving?
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onSaveAsDraft}
              disabled={isSaving}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-[#745CB4] text-white hover:bg-[#C1B6FD]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save as Draft
                </>
              )}
            </button>

            <button
              onClick={onLeaveWithoutSaving}
              disabled={isSaving}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-[#745CB4]/30 text-[#9CA3AF] hover:text-white hover:border-[#745CB4]/50 hover:bg-[#745CB4]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Leave without saving
            </button>

            <button
              onClick={onStay}
              disabled={isSaving}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-[#9CA3AF] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <X className="w-4 h-4" />
              Stay on page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationGuardDialog;
