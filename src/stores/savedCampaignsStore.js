import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getCampaignId = (campaign) => {
  return String(campaign?._id ?? campaign?.id ?? campaign?.campaignId ?? '');
};

const mergeCampaign = (existing, incoming) => {
  return {
    ...(existing || {}),
    ...(incoming || {}),
    savedAt: (existing && existing.savedAt) || new Date().toISOString(),
  };
};

const useSavedCampaignsStore = create(
  persist(
    (set, get) => ({
      savedCampaigns: [],

      saveCampaign: (campaign) => {
        const id = getCampaignId(campaign);
        if (!id) {
          return { success: false, error: 'Campaign id is required' };
        }

        set((state) => {
          const existing = state.savedCampaigns.find((item) => getCampaignId(item) === id);

          if (existing) {
            return {
              savedCampaigns: state.savedCampaigns.map((item) =>
                getCampaignId(item) === id ? mergeCampaign(item, campaign) : item
              ),
            };
          }

          return {
            savedCampaigns: [mergeCampaign(null, campaign), ...state.savedCampaigns],
          };
        });

        return { success: true };
      },

      removeCampaign: (campaignId) => {
        const id = String(campaignId || '');
        if (!id) {
          return { success: false, error: 'Campaign id is required' };
        }

        set((state) => ({
          savedCampaigns: state.savedCampaigns.filter((item) => getCampaignId(item) !== id),
        }));

        return { success: true };
      },

      isCampaignSaved: (campaignId) => {
        const id = String(campaignId || '');
        return get().savedCampaigns.some((item) => getCampaignId(item) === id);
      },

      getSavedCampaignById: (campaignId) => {
        const id = String(campaignId || '');
        return get().savedCampaigns.find((item) => getCampaignId(item) === id) || null;
      },

      clearSavedCampaigns: () => {
        set({ savedCampaigns: [] });
      },
    }),
    {
      name: 'saved-campaigns-storage',
      partialize: (state) => ({ savedCampaigns: state.savedCampaigns }),
    }
  )
);

export default useSavedCampaignsStore;
