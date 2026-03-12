import { create } from 'zustand';
import profileService from '../api/profileApi';

const useProfileStore = create((set, get) => ({
  ownerProfile: null,
  influencerProfile: null,
  isLoading: false,
  error: null,

  setLoading: (v) => set({ isLoading: v }),
  setError: (err) => set({ error: err, isLoading: false }),

  // Fetch owner profile
  fetchOwnerProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await profileService.getOwnerProfile();
      // res is expected to be API response object; try to extract useful payload
      const payload = res?.data ?? res;
      const profile = payload?.ownerProfile ?? payload?.profile ?? payload;
      set({ ownerProfile: profile, isLoading: false });
      return { success: true, profile };
    } catch (error) {
      const message = typeof error === 'string' ? error : error?.message || 'Failed to fetch owner profile';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Create or update owner profile (used by onboarding)
  createOrUpdateOwnerProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await profileService.createOrUpdateOwnerProfile(data);
      const payload = res?.data ?? res;
      const profile = payload?.ownerProfile ?? payload;
      set({ ownerProfile: profile, isLoading: false });
      return { success: true, profile };
    } catch (error) {
      const message = typeof error === 'string' ? error : error?.message || 'Failed to create/update owner profile';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Update owner profile
  updateOwnerProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await profileService.updateOwnerProfile(data);
      const payload = res?.data ?? res;
      const profile = payload?.ownerProfile ?? payload;
      set({ ownerProfile: profile, isLoading: false });
      return { success: true, profile };
    } catch (error) {
      const message = typeof error === 'string' ? error : error?.message || 'Failed to update owner profile';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Delete owner profile
  deleteOwnerProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await profileService.deleteOwnerProfile();
      set({ ownerProfile: null, isLoading: false });
      return { success: true, data: res };
    } catch (error) {
      const message = typeof error === 'string' ? error : error?.message || 'Failed to delete owner profile';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Get owner profile completion
  fetchOwnerCompletion: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await profileService.getOwnerProfileCompletion();
      const payload = res?.data ?? res;
      set({ isLoading: false });
      return { success: true, data: payload };
    } catch (error) {
      const message = typeof error === 'string' ? error : error?.message || 'Failed to fetch completion';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Influencer counterparts
  fetchInfluencerProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await profileService.getInfluencerProfile();
      const payload = res?.data ?? res;
      const profile = payload?.influencerProfile ?? payload;
      set({ influencerProfile: profile, isLoading: false });
      return { success: true, profile };
    } catch (error) {
      const message = typeof error === 'string' ? error : error?.message || 'Failed to fetch influencer profile';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  createOrUpdateInfluencerProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await profileService.createOrUpdateInfluencerProfile(data);
      const payload = res?.data ?? res;
      const profile = payload?.influencerProfile ?? payload;
      set({ influencerProfile: profile, isLoading: false });
      return { success: true, profile };
    } catch (error) {
      const message = typeof error === 'string' ? error : error?.message || 'Failed to create/update influencer profile';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  fetchInfluencerCompletion: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await profileService.getInfluencerProfileCompletion();
      const payload = res?.data ?? res;
      set({ isLoading: false });
      return { success: true, data: payload };
    } catch (error) {
      const message = typeof error === 'string' ? error : error?.message || 'Failed to fetch influencer completion';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  }
}));

export default useProfileStore;
