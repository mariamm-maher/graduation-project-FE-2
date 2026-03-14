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
      // Response structure: { success, status, message, data: { profile: { firstName, lastName, email, status, ownerProfile: {...} } } }
      const payload = res?.data ?? res;
      const userProfile = payload?.profile ?? {};
      const ownerProfileData = userProfile?.ownerProfile ?? {};
      
      // Merge user info with owner profile
      const profile = {
        ...ownerProfileData,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        status: userProfile.status,
        userId: userProfile.id
      };
      
      set({ ownerProfile: profile, isLoading: false });
      return { success: true, profile };
    } catch (error) {
      const message = typeof error === 'string' ? error : error?.message || 'Failed to fetch owner profile';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

 
  // Update owner profile
  updateOwnerProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await profileService.updateOwnerProfile(data);
      // Response structure: { success, status, message, data: { profile: { ...user, ownerProfile: {...} } } }
      const payload = res?.data ?? res;
      const userProfile = payload?.profile ?? {};
      const ownerProfileData = userProfile?.ownerProfile ?? {};
      
      // Merge user info with owner profile
      const profile = {
        ...ownerProfileData,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        status: userProfile.status,
        userId: userProfile.id
      };
      
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
      // Response structure: { success, status, message, data: { profile: { ...user, influencerProfile: {...} } } }
      const payload = res?.data ?? res;
      const userProfile = payload?.profile ?? {};
      const influencerProfileData = userProfile?.influencerProfile ?? {};
      
      // Merge user info with influencer profile
      const profile = {
        ...influencerProfileData,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        status: userProfile.status,
        userId: userProfile.id
      };
      
      set({ influencerProfile: profile, isLoading: false });
      return { success: true, profile };
    } catch (error) {
      const message = typeof error === 'string' ? error : error?.message || 'Failed to fetch influencer profile';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

    // Update influencer profile
    updateInfluencerProfile: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const res = await profileService.updateInfluencerProfile(data);
        // Response structure: { success, status, message, data: { profile: { ...user, influencerProfile: {...} } } }
        const payload = res?.data ?? res;
        const userProfile = payload?.profile ?? {};
        const influencerProfileData = userProfile?.influencerProfile ?? {};

        // Merge user info with influencer profile
        const profile = {
          ...influencerProfileData,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          email: userProfile.email,
          status: userProfile.status,
          userId: userProfile.id
        };

        set({ influencerProfile: profile, isLoading: false });
        return { success: true, profile };
      } catch (error) {
        const message = typeof error === 'string' ? error : error?.message || 'Failed to update influencer profile';
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
