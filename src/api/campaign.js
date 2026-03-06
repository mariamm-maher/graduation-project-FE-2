 
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
};

export default campaignService;
