import api from '../config/axios';

// Campaign Service Functions
const campaignService = {
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

  // Get all campaigns
  getCampaigns: async () => {
    try {
      const response = await api.get('/campaigns');
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
