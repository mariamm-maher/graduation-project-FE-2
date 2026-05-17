import { create } from 'zustand';
import socialMediaService from '../api/SocialMediaApi';

const useSocialMediaStore = create((set, get) => ({
  accounts: [],
  currentAccount: null,
  stats: null,
  posts: [],
  postAnalytics: {},
  isLoading: false,
  postsLoading: false,
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
        accounts: state.accounts.filter((a) => {
          const accountId = a.id || a._id;
          return accountId ? String(accountId) !== String(platform) : a.platform !== platform;
        }),
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
      const res = await socialMediaService.getAccounts();

      const raw =
        Array.isArray(res) ? res :
        Array.isArray(res?.data) ? res.data :
        Array.isArray(res?.data?.data) ? res.data.data :
        Array.isArray(res?.channels) ? res.channels :
        [];

      console.log('[STORE] raw channels received:', raw.length);

      const mapped = raw.map((ch) => {
        const pd = ch.platformData && typeof ch.platformData === 'object' ? ch.platformData : {};
        const handle =
          ch.handle ?? pd.handle ?? ch.screen_name ?? pd.screen_name ?? null;
        const channelTitle = ch.channelTitle ?? pd.channelTitle ?? null;
        const pageName =
          ch.name ??
          pd.name ??
          pd.pageName ??
          pd.page_name ??
          pd.page_title ??
          null;
        const usernameRaw =
          ch.accountUsername ??
          ch.username ??
          handle ??
          ch.screen_name ??
          pageName ??
          channelTitle ??
          ch.accountName ??
          '';
        const isSimulated = Boolean(pd.isSimulated ?? ch.isSimulated);
        const connectionStatus = (() => {
          const s = (ch.status || '').toLowerCase();
          if (isSimulated) return 'simulated';
          if (s.includes('sync')) return 'syncing';
          if (s.includes('error') || s === 'failed' || s === 'disconnected') return 'error';
          return 'connected';
        })();
        const followers =
          pd.followerCount ?? pd.followers ?? ch.followers ?? ch.followersCount ?? null;
        const engagementRate =
          pd.engagement ?? ch.engagement ?? pd.engagement_rate ?? ch.engagement_rate ?? null;

        return {
          id: ch.id ?? ch._id,
          platform: ch.platform,
          accountName: ch.accountName,
          username: usernameRaw,
          pageName,
          handle,
          channelTitle,
          profilePicture: ch.profilePicture ?? pd.profilePicture ?? pd.thumbnail ?? null,
          status: ch.status,
          platformData: ch.platformData,
          isSimulated,
          connectionStatus,
          followers,
          engagementRate,
          lastSyncAt: ch.lastSyncAt,
          createdAt: ch.createdAt,
        };
      });

      set({ accounts: mapped, isLoading: false });
      return { success: true, data: mapped };
    } catch (err) {
      console.error('[STORE] getAccounts error:', err);
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Failed to fetch accounts';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  connectTikTokSimulated: async (username, displayName) => {
    set({ isLoading: true, error: null });
    try {
      await socialMediaService.connectTikTokSimulated(username, displayName);
      await get().getAccounts();
      return { success: true };
    } catch (err) {
      const errorMessage =
        typeof err === 'string' ? err : err?.message || 'Failed to connect simulated TikTok';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ isLoading: false });
    }
  },

  // Get stats for a channel (optional silent: no global isLoading, no error banner)
  getStats: async (channelId, options = {}) => {
    const silent = options.silent === true;
    if (!silent) set({ isLoading: true, error: null });
    try {
      const response = await socialMediaService.getStats(channelId);

      const data = response?.data ?? response ?? {};

      set((state) => ({
        accounts: state.accounts.map((a) =>
          String(a.id) === String(channelId)
            ? {
                ...a,
                followers: data.followers ?? data.followerCount ?? a.followers,
                engagementRate: data.engagement ?? data.engagement_rate ?? a.engagementRate,
                engagement: data.engagement ?? a.engagement,
                likes: data.likes ?? a.likes,
                reach: data.reach ?? a.reach,
                impressions: data.impressions ?? a.impressions,
                postsCount: data.postsCount ?? a.postsCount,
              }
            : a
        ),
        ...(silent ? {} : { isLoading: false }),
      }));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.message || 'Failed to fetch stats';
      if (!silent) set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },
  getPosts: async () => {
    set({ postsLoading: true });
    try {
      const data = await socialMediaService.getPosts();
      const posts = data?.data?.posts || data?.posts || [];
      set({ posts, postsLoading: false });
      return { success: true };
    } catch (error) {
      set({ postsLoading: false });
      return { success: false, error };
    }
  },

  createPost: async (payload) => {
    set({ postsLoading: true });
    try {
      const data = await socialMediaService.createPost(payload);
      set({ postsLoading: false });
      return { success: true, data };
    } catch (error) {
      set({ postsLoading: false });
      return { success: false, error };
    }
  },

  deletePost: async (postId) => {
    try {
      await socialMediaService.deletePost(postId);
      set((state) => ({
        posts: state.posts.filter((p) => (p.id || p._id) !== postId)
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },

  getPostAnalytics: async (postId) => {
    try {
      const data = await socialMediaService.getPostAnalytics(postId);
      const analytics = data?.data || data;
      set((state) => ({
        postAnalytics: { ...state.postAnalytics, [postId]: analytics }
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },

  clearError: () => set({ error: null })
}));

export default useSocialMediaStore;
