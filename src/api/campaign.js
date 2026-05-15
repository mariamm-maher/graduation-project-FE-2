 
import api from '../config/axios';

// Campaign Service Functions
const campaignService = {

  // Save and Publish Campaign
  saveAndPublishCampaign: async (campaignData) => {
    try {
      const response = await api.post('/campaigns/save-and-publish', campaignData);
      console.log('Save and publish campaign response:', response);
      return response.data;
    } catch (error) {
      console.error('Save and publish campaign error:', error);
      throw error.response?.data?.message || 'Failed to save and publish campaign';
    }
  },

  // Save Campaign
  saveCampaign: async (campaignData) => {
    try {
      const response = await api.post('/campaigns/save', campaignData);
      console.log('Save campaign response:', response);
      return response.data;
    } catch (error) {
      console.error('Save campaign error:', error);
      throw error.response?.data?.message || 'Failed to save campaign';
    }
  },

  // Save Campaign as Draft
  saveDraftCampaign: async (draftData) => {
    try {
      const response = await api.post('/campaigns/draft', draftData);
      console.log('Save draft campaign response:', response);
      return response.data;
    } catch (error) {
      console.error('Save draft campaign error:', error);
      throw error.response?.data?.message || 'Failed to save campaign as draft';
    }
  },

  // Generate Campaign with AI
  generateCampaignAI: async (aiData) => {
    try {
      const response = await api.post('/campaigns/ai/generate', aiData);
      console.log('AI Generate campaign response:', response);
      return response.data;
    } catch (error) {
      console.error('AI Generate campaign error:', error);
      throw error.response?.data?.message || 'Failed to generate campaign with AI';
    }
  },
  // Create new campaign
  createCampaign: async (campaignData) => {
    try {
      const response = await api.post('/campaigns/create', campaignData);
      console.log('Create campaign response:', response);
      return response.data;
    } catch (error) {
      console.error('Create campaign error:', error);
      throw error.response?.data?.message || 'Failed to create campaign';
    }
  },

  // Get all campaigns (with optional pagination and lifecycle filter)
  getCampaigns: async ({ page = 1, limit = 10, lifecycleStage } = {}) => {
    try {
      const params = { page, limit };
      if (lifecycleStage) params.lifecycleStage = lifecycleStage;
      const response = await api.get('/campaigns', { params });
      console.log('Campaigns response:', response);
      return response.data;
    } catch (error) {
      console.error('Campaigns error:', error);
      throw error.response?.data?.message || 'Failed to fetch campaigns';
    }
  },

  // Get active campaigns
  getActiveCampaigns: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await api.get('/campaigns/active', {
        params: { page, limit },
      });
      console.log('Active campaigns response:', response);
      return response.data;
    } catch (error) {
      console.error('Active campaigns error:', error);
      throw error.response?.data?.message || 'Failed to fetch active campaigns';
    }
  },

  // Get campaigns overview
  getCampaignsOverview: async () => {
    try {
      const response = await api.get('/campaigns/overview');
      console.log('Campaigns overview response:', response);
      return response.data;
    } catch (error) {
      console.error('Campaigns overview error:', error);
      throw error.response?.data?.message || 'Failed to fetch campaigns overview';
    }
  },

  // Get campaign by ID
  getCampaignById: async (id) => {
    try {
      const response = await api.get(`/campaigns/${id}`);
      console.log('Campaign detail response:', response);
      return response.data;
    } catch (error) {
      console.error('Campaign detail error:', error);
      throw error.response?.data?.message || 'Failed to fetch campaign';
    }
  },

  // Update campaign
  updateCampaign: async (id, campaignData) => {
    try {
      const response = await api.put(`/campaigns/${id}`, campaignData);
      console.log('Update campaign response:', response);
      return response.data;
    } catch (error) {
      console.error('Update campaign error:', error);
      throw error.response?.data?.message || 'Failed to update campaign';
    }
  },

  // Delete campaign
  deleteCampaign: async (id) => {
    try {
      const response = await api.delete(`/campaigns/${id}`);
      console.log('Delete campaign response:', response);
      return response.data;
    } catch (error) {
      console.error('Delete campaign error:', error);
      throw error.response?.data?.message || 'Failed to delete campaign';
    }
  },

  // Complete Campaign
  // POST /api/campaigns/{id}/complete
  completeCampaign: async (id) => {
    try {
      const response = await api.post(`/campaigns/${id}/complete`);
      console.log('Complete campaign response:', response);
      return response.data;
    } catch (error) {
      console.error('Complete campaign error:', error);
      throw error.response?.data?.message || 'Failed to complete campaign';
    }
  },

  // Get Campaign Analytics (overview or single campaign)
  getCampaignAnalytics: async (campaignId = null) => {
    try {
      const url = campaignId ? `/campaigns/${campaignId}/analytics` : '/campaigns/analytics';
      const response = await api.get(url);
      console.log('Campaign analytics response:', response);
      return response.data;
    } catch (error) {
      console.error('Campaign analytics error:', error);
      throw error.response?.data?.message || 'Failed to fetch campaign analytics';
    }
  },

  // Get Active Campaigns with Smart Tracking (Enhanced)
  getActiveCampaignsWithTracking: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await api.get('/campaigns/active/enhanced', {
        params: { page, limit },
      });
      console.log('Enhanced active campaigns response:', response);
      return response.data;
    } catch (error) {
      console.error('Enhanced active campaigns error:', error);
      throw error.response?.data?.message || 'Failed to fetch enhanced tracking data';
    }
  },

  // Cancel Campaign
  // POST /api/campaigns/{id}/cancel
  cancelCampaign: async (id) => {
    try {
      const response = await api.post(`/campaigns/${id}/cancel`);
      console.log('Cancel campaign response:', response);
      return response.data;
    } catch (error) {
      console.error('Cancel campaign error:', error);
      throw error.response?.data?.message || 'Failed to cancel campaign';
    }
  },

  // Generate Campaign PDF Report
  // GET /api/campaigns/{id}/report
  generateCampaignReport: async (campaignId) => {
    try {
      const response = await api.get(`/campaigns/${campaignId}/report`, {
        responseType: 'blob', // Important for PDF download
      });
      
      // Create download link
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
      throw error.response?.data?.message || 'Failed to generate campaign report';
    }
  },

  // Generate Bulk PDF Report for All Completed Campaigns
  // GET /api/campaigns/reports/completed
  generateBulkReport: async () => {
    try {
      const response = await api.get('/campaigns/reports/completed', {
        responseType: 'blob', // Important for PDF download
      });
      
      // Create download link
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
      throw error.response?.data?.message || 'Failed to generate bulk report';
    }
  },
};

export default campaignService;
