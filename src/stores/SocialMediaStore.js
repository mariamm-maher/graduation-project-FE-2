import { create } from 'zustand';
import socialMediaService from '../api/SocialMediaApi';

const useSocialMediaStore = create((set) => ({
  accounts: [],
  currentAccount: null,
  stats: null,
  isLoading: false,
  error: null,

  // Connect a social media account
  connectAccount: async (platform, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await socialMediaService.connectAccount(platform, data);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to connect account');
      }

      const account = payload?.account || payload?.data || payload;
      set((state) => ({
        accounts: [account, ...state.accounts],
        isLoading: false
      }));
      return { success: true, data: account };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to connect account';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Disconnect a social media account
  disconnectAccount: async (platform) => {
    set({ isLoading: true, error: null });
    try {
      const response = await socialMediaService.disconnectAccount(platform);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to disconnect account');
      }

      set((state) => ({
        accounts: state.accounts.filter((a) => a.platform !== platform),
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to disconnect account';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get all connected accounts
  getAccounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await socialMediaService.getAccounts();
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || Array.isArray(payload);

      if (!ok && !payload?.accounts) {
        throw new Error(payload?.message || 'Failed to fetch accounts');
      }

      const accounts = payload?.accounts || payload?.data || (Array.isArray(payload) ? payload : []);
      set({ accounts, isLoading: false });
      return { success: true, data: accounts };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch accounts';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get stats for a platform
  getStats: async (platform) => {
    set({ isLoading: true, error: null });
    try {
      const response = await socialMediaService.getStats(platform);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.stats;

      if (!ok) {
        throw new Error(payload?.message || 'Failed to fetch stats');
      }

      const stats = payload?.stats || payload?.data || payload;
      set({ stats, isLoading: false });
      return { success: true, data: stats };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch stats';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  clearError: () => set({ error: null })
}));

export default useSocialMediaStore;
