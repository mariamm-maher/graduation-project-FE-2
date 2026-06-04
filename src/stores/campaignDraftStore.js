import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const SESSION_STORAGE_KEY = 'campaign_draft_id';

const initialState = {
  inputs: {
    name: '',
    goal: '',
    duration_days: null,
    budget: null,
    extra_notes: '',
  },
  versions: [],
  currentVersionIndex: 0,
  isGenerating: false,
  isDraft: false,
  draftId: null,
};

const useCampaignDraftStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions
      setInputs: (inputs) =>
        set((state) => ({
          inputs: { ...state.inputs, ...inputs },
        })),

      addVersion: (output) =>
        set((state) => {
          const newVersion = {
            versionNumber: state.versions.length + 1,
            generatedAt: new Date().toISOString(),
            output,
          };
          const newVersions = [...state.versions, newVersion];
          return {
            versions: newVersions,
            currentVersionIndex: newVersions.length - 1,
            isGenerating: false,
          };
        }),

      setCurrentVersion: (index) =>
        set(() => ({
          currentVersionIndex: index,
        })),

      setDraftSaved: (draftId) => {
        sessionStorage.setItem(SESSION_STORAGE_KEY, draftId);
        set(() => ({
          isDraft: true,
          draftId,
        }));
      },

      rehydrateDraft: (draftData) =>
        set(() => ({
          inputs: draftData.inputs || initialState.inputs,
          versions: draftData.versions || [],
          currentVersionIndex: draftData.currentVersionIndex || 0,
          isGenerating: false,
          isDraft: true,
          draftId: draftData.draftId || null,
        })),

      setGenerating: (isGenerating) =>
        set(() => ({
          isGenerating,
        })),

      clearAll: () => {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        set(() => ({ ...initialState }));
      },

      // Getter for current version
      getCurrentVersion: () => {
        const state = get();
        return state.versions[state.currentVersionIndex] || null;
      },

      // Check if has unsaved work
      hasUnsavedWork: () => {
        const state = get();
        return state.versions.length > 0 && !state.isDraft;
      },
    }),
    {
      name: 'campaign-draft-storage',
      partialize: (state) => ({
        inputs: state.inputs,
        versions: state.versions,
        currentVersionIndex: state.currentVersionIndex,
        isDraft: state.isDraft,
        draftId: state.draftId,
      }),
    }
  )
);

export default useCampaignDraftStore;
