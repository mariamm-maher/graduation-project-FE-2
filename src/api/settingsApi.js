import api from '../config/axios';

const settingsService = {
  // =======================
  // GET ALL SETTINGS
  // =======================
  getSettings: async () => {
    try {
      const response = await api.get('/settings');
      return response.data;
    } catch (error) {
      console.error('Get settings error:', error);
      throw error.response?.data?.message || 'Failed to fetch settings';
    }
  },

  // =======================
  // UPDATE ACCOUNT SETTINGS
  // =======================
  updateAccountSettings: async (data) => {
    try {
      const response = await api.patch('/settings/account', data);
      return response.data;
    } catch (error) {
      console.error('Update account settings error:', error);
      throw error.response?.data?.message || 'Failed to update account settings';
    }
  },

  // =======================
  // UPDATE PRIVACY SETTINGS
  // =======================
  updatePrivacySettings: async (data) => {
    try {
      const response = await api.patch('/settings/privacy', data);
      return response.data;
    } catch (error) {
      console.error('Update privacy settings error:', error);
      throw error.response?.data?.message || 'Failed to update privacy settings';
    }
  },

  // =======================
  // UPDATE NOTIFICATION PREFERENCES
  // =======================
  updateNotificationPreferences: async (data) => {
    try {
      const response = await api.patch('/settings/notifications', data);
      return response.data;
    } catch (error) {
      console.error('Update notification preferences error:', error);
      throw error.response?.data?.message || 'Failed to update notification preferences';
    }
  },

  // =======================
  // CHANGE PASSWORD
  // =======================
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/settings/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error.response?.data?.message || 'Failed to change password';
    }
  },

  // =======================
  // EXPORT USER DATA
  // =======================
  exportUserData: async () => {
    try {
      const response = await api.post('/settings/export-data');
      return response.data;
    } catch (error) {
      console.error('Export user data error:', error);
      throw error.response?.data?.message || 'Failed to export user data';
    }
  },

  // =======================
  // DELETE ACCOUNT
  // =======================
  deleteAccount: async (password, confirmDelete = true) => {
    try {
      const response = await api.delete('/settings/account', {
        data: { password, confirmDelete }
      });
      return response.data;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error.response?.data?.message || 'Failed to delete account';
    }
  }
};

export default settingsService;
