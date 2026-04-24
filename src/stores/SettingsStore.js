import { create } from 'zustand';
import settingsService from '../api/settingsApi';

const useSettingsStore = create((set, get) => ({
  // =======================
  // STATE
  // =======================
  settings: {
    account: {
      email: '',
      firstName: '',
      lastName: '',
      profileImage: '',
      memberSince: '',
      lastUpdated: ''
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowSearchByEmail: true,
      allowDataCollection: true,
      shareActivityStatus: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      newCollaborationRequests: true,
      collaborationUpdates: true,
      messages: true,
      systemAnnouncements: true,
      weeklyDigest: true
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      twoFactorEnabled: false
    }
  },
  isLoading: false,
  error: null,
  successMessage: null,

  // =======================
  // BASIC ACTIONS
  // =======================
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  clearError: () => set({ error: null }),
  clearSuccessMessage: () => set({ successMessage: null }),
  clearMessages: () => set({ error: null, successMessage: null }),

  // =======================
  // FETCH ALL SETTINGS
  // =======================
  fetchSettings: async () => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const res = await settingsService.getSettings();
      const data = res?.data ?? res;

      if (data) {
        set({
          settings: {
            account: data.account || get().settings.account,
            privacy: data.privacy || get().settings.privacy,
            notifications: data.notifications || get().settings.notifications,
            preferences: data.preferences || get().settings.preferences
          },
          isLoading: false,
          error: null
        });
        return { success: true, data };
      }
      return { success: false, error: 'No data received' };
    } catch (error) {
      const message = typeof error === 'string' ? error : error?.message || 'Failed to fetch settings';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // =======================
  // UPDATE ACCOUNT SETTINGS
  // =======================
  updateAccountSettings: async (data) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const res = await settingsService.updateAccountSettings(data);
      const responseData = res?.data ?? res;

      if (responseData?.account) {
        set((state) => ({
          settings: {
            ...state.settings,
            account: responseData.account
          },
          isLoading: false,
          successMessage: 'Account settings updated successfully'
        }));
      } else {
        set({ isLoading: false, successMessage: 'Account settings updated successfully' });
      }
      return { success: true };
    } catch (error) {
      const message = typeof error === 'string' ? error : error?.message || 'Failed to update account settings';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // =======================
  // UPDATE PRIVACY SETTINGS
  // =======================
  updatePrivacySettings: async (data) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const res = await settingsService.updatePrivacySettings(data);
      const responseData = res?.data ?? res;

      if (responseData?.privacySettings) {
        set((state) => ({
          settings: {
            ...state.settings,
            privacy: responseData.privacySettings
          },
          isLoading: false,
          successMessage: 'Privacy settings updated successfully'
        }));
      } else {
        // Optimistic update if server doesn't return data
        set((state) => ({
          settings: {
            ...state.settings,
            privacy: { ...state.settings.privacy, ...data }
          },
          isLoading: false,
          successMessage: 'Privacy settings updated successfully'
        }));
      }
      return { success: true };
    } catch (error) {
      const message = typeof error === 'string' ? error : error?.message || 'Failed to update privacy settings';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // =======================
  // UPDATE NOTIFICATION PREFERENCES
  // =======================
  updateNotificationPreferences: async (data) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const res = await settingsService.updateNotificationPreferences(data);
      const responseData = res?.data ?? res;

      if (responseData?.notificationPreferences) {
        set((state) => ({
          settings: {
            ...state.settings,
            notifications: responseData.notificationPreferences
          },
          isLoading: false,
          successMessage: 'Notification preferences updated successfully'
        }));
      } else {
        // Optimistic update
        set((state) => ({
          settings: {
            ...state.settings,
            notifications: { ...state.settings.notifications, ...data }
          },
          isLoading: false,
          successMessage: 'Notification preferences updated successfully'
        }));
      }
      return { success: true };
    } catch (error) {
      const message = typeof error === 'string' ? error : error?.message || 'Failed to update notification preferences';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // =======================
  // CHANGE PASSWORD
  // =======================
  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      await settingsService.changePassword(currentPassword, newPassword);
      set({
        isLoading: false,
        successMessage: 'Password changed successfully'
      });
      return { success: true };
    } catch (error) {
      const message = typeof error === 'string' ? error : error?.message || 'Failed to change password';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // =======================
  // EXPORT USER DATA
  // =======================
  exportUserData: async () => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const res = await settingsService.exportUserData();
      set({
        isLoading: false,
        successMessage: 'User data exported successfully'
      });
      return { success: true, data: res?.data };
    } catch (error) {
      const message = typeof error === 'string' ? error : error?.message || 'Failed to export user data';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // =======================
  // DELETE ACCOUNT
  // =======================
  deleteAccount: async (password) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      await settingsService.deleteAccount(password);
      set({
        isLoading: false,
        successMessage: 'Account deleted successfully'
      });
      return { success: true };
    } catch (error) {
      const message = typeof error === 'string' ? error : error?.message || 'Failed to delete account';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // =======================
  // RESET STORE
  // =======================
  resetSettings: () => set({
    settings: {
      account: {
        email: '',
        firstName: '',
        lastName: '',
        profileImage: '',
        memberSince: '',
        lastUpdated: ''
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false,
        allowSearchByEmail: true,
        allowDataCollection: true,
        shareActivityStatus: true
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
        newCollaborationRequests: true,
        collaborationUpdates: true,
        messages: true,
        systemAnnouncements: true,
        weeklyDigest: true
      },
      preferences: {
        language: 'en',
        timezone: 'UTC',
        twoFactorEnabled: false
      }
    },
    isLoading: false,
    error: null,
    successMessage: null
  })
}));

export default useSettingsStore;
