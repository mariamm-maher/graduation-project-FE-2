
import api from '../config/axios';

const throwApiError = (error, fallback) => {
  const message = error.response?.data?.message
    || error.response?.data?.error
    || error.message
    || fallback;
  throw new Error(message);
};

const campaignService = {
  saveAndPublishCampaign: async (builtPayload) => {
    try {
      const response = await api.post('/campaigns/save-and-publish', {
        ...builtPayload,
        isPublished: true,
      });
      return response.data;
    } catch (error) {
      console.error('Save and publish campaign error:', error);
      throw error.response?.data?.message || 'Failed to save and publish campaign';
    }
  },

  saveCampaign: async (builtPayload) => {
    try {
      const response = await api.post('/campaigns/save', builtPayload);
      return response.data;
    } catch (error) {
      console.error('Save campaign error:', error);
      throwApiError(error, 'Failed to save campaign');
    }
  },

  saveDraftCampaign: async (draftData) => {
    try {
      const response = await api.post('/campaigns/draft', draftData);
      return response.data;
    } catch (error) {
      console.error('Save draft campaign error:', error);
      throwApiError(error, 'Failed to save campaign as draft');
    }
  },

  generateCampaignAI: async (aiData) => {
    try {
      const response = await api.post('/campaigns/ai/generate', aiData);
      return response.data;
    } catch (error) {
      console.error('AI Generate campaign error:', error);
      throwApiError(error, 'Failed to generate campaign with AI');
    }
  },

  createCampaign: async (campaignData) => {
    try {
      const response = await api.post('/campaigns/create', campaignData);
      return response.data;
    } catch (error) {
      console.error('Create campaign error:', error);
      throwApiError(error, 'Failed to create campaign');
    }
  },

  getCampaigns: async ({ page = 1, limit = 10, lifecycleStage } = {}) => {
    try {
      const params = { page, limit };
      if (lifecycleStage) params.lifecycleStage = lifecycleStage;
      const response = await api.get('/campaigns', { params });
      return response.data;
    } catch (error) {
      console.error('Campaigns error:', error);
      throwApiError(error, 'Failed to fetch campaigns');
    }
  },

  getActiveCampaigns: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await api.get('/campaigns/active', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Active campaigns error:', error);
      throwApiError(error, 'Failed to fetch active campaigns');
    }
  },

  getCampaignsOverview: async () => {
    try {
      const response = await api.get('/campaigns/overview');
      return response.data;
    } catch (error) {
      console.error('Campaigns overview error:', error);
      throwApiError(error, 'Failed to fetch campaigns overview');
    }
  },

  getCampaignById: async (id) => {
    try {
      const response = await api.get(`/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Campaign detail error:', error);
      throwApiError(error, 'Failed to fetch campaign');
    }
  },

  updateCampaign: async (id, campaignData) => {
    try {
      const response = await api.put(`/campaigns/${id}`, campaignData);
      return response.data;
    } catch (error) {
      console.error('Update campaign error:', error);
      throwApiError(error, 'Failed to update campaign');
    }
  },

  deleteCampaign: async (id) => {
    try {
      const response = await api.delete(`/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete campaign error:', error);
      throwApiError(error, 'Failed to delete campaign');
    }
  },

  completeCampaign: async (id) => {
    try {
      const response = await api.post(`/campaigns/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error('Complete campaign error:', error);
      throwApiError(error, 'Failed to complete campaign');
    }
  },

  getCampaignAnalytics: async (campaignId = null) => {
    try {
      const url = campaignId ? `/campaigns/${campaignId}/analytics` : '/campaigns/analytics';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Campaign analytics error:', error);
      throwApiError(error, 'Failed to fetch campaign analytics');
    }
  },

  getActiveCampaignsWithTracking: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await api.get('/campaigns/active/enhanced', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Enhanced active campaigns error:', error);
      throwApiError(error, 'Failed to fetch enhanced tracking data');
    }
  },

  cancelCampaign: async (id) => {
    try {
      const response = await api.post(`/campaigns/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Cancel campaign error:', error);
      throwApiError(error, 'Failed to cancel campaign');
    }
  },

  updateBrandTone: async (brandTone) => {
    try {
      const response = await api.patch('/profile/brand-tone', { brandTone });
      return response.data;
    } catch (error) {
      console.error('Update brand tone error:', error);
      throwApiError(error, 'Failed to update brand tone');
    }
  },

  generateCampaignReport: async (campaignId) => {
    try {
      const response = await api.get(`/campaigns/${campaignId}/report`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `campaign-report-${campaignId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Generate campaign report error:', error);
      throwApiError(error, 'Failed to generate campaign report');
    }
  },

  generateBulkReport: async () => {
    try {
      const response = await api.get('/campaigns/reports/completed', {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `all-campaigns-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Generate bulk report error:', error);
      throwApiError(error, 'Failed to generate bulk report');
    }
  },
};

export default campaignService;
