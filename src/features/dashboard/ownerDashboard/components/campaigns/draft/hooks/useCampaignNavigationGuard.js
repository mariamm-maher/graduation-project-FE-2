import { useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useCampaignDraftStore from '../../../../../../../stores/campaignDraftStore';
import campaignService from '../../../../../../../api/campaign';

export function useCampaignNavigationGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDialog, setShowDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const nextPathRef = useRef(null);

  const versions = useCampaignDraftStore((state) => state.versions);
  const isDraft = useCampaignDraftStore((state) => state.isDraft);
  const inputs = useCampaignDraftStore((state) => state.inputs);
  const draftId = useCampaignDraftStore((state) => state.draftId);
  const clearAll = useCampaignDraftStore((state) => state.clearAll);
  const setDraftSaved = useCampaignDraftStore((state) => state.setDraftSaved);
  const currentVersionIndex = useCampaignDraftStore((state) => state.currentVersionIndex);

  const hasUnsavedWork = versions.length > 0 && !isDraft;

  // Handle navigation attempts
  const confirmNavigation = useCallback((nextPath) => {
    if (!hasUnsavedWork) {
      return true;
    }

    // Don't block if navigating to the same location
    if (location.pathname === nextPath) {
      return true;
    }

    nextPathRef.current = nextPath;
    setShowDialog(true);
    return false;
  }, [hasUnsavedWork, location.pathname]);

  const handleSaveAsDraft = async () => {
    setIsSaving(true);
    try {
      // Map store data to backend format { inputs, current_output, version_history }
      const currentVersion = versions[currentVersionIndex];
      const draftPayload = {
        inputs: inputs || {},
        current_output: currentVersion || null,
        version_history: versions,
      };

      let response;
      if (draftId) {
        response = await campaignService.updateCampaignDraft(draftId, draftPayload);
      } else {
        response = await campaignService.saveDraftCampaign(draftPayload);
      }

      // Backend returns { success: true, draft_id: '...' }
      if (response?.success) {
        const newDraftId = response.draft_id || draftId;
        setDraftSaved(newDraftId);

        // Proceed with navigation after saving
        const targetPath = nextPathRef.current;
        nextPathRef.current = null;
        setShowDialog(false);

        if (targetPath) {
          navigate(targetPath);
        }
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
      // Keep dialog open on error
      return;
    } finally {
      setIsSaving(false);
    }
  };

  const handleLeaveWithoutSaving = () => {
    clearAll();
    const targetPath = nextPathRef.current;
    nextPathRef.current = null;
    setShowDialog(false);

    if (targetPath) {
      navigate(targetPath);
    }
  };

  const handleStay = () => {
    nextPathRef.current = null;
    setShowDialog(false);
  };

  // Handle beforeunload event for closing tab/browser
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedWork) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedWork]);

  return {
    showDialog,
    isSaving,
    hasUnsavedWork,
    confirmNavigation,
    handleSaveAsDraft,
    handleLeaveWithoutSaving,
    handleStay,
  };
}

export default useCampaignNavigationGuard;
