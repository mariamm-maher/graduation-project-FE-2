import api from '../config/axios';

const profileService = {

  // GET /api/profile/owner
  // Get authenticated owner profile
  getOwnerProfile: async () => {
    try {
      const response = await api.get('/profile/owner');
      return response.data;
    } catch (error) {
      console.error('Get owner profile error:', error);
      throw error.response?.data?.message || 'Failed to fetch owner profile';
    }
  },

 
  // PUT /api/profile/owner
  // Update owner profile
  updateOwnerProfile: async (data) => {
    try {
      const response = await api.put('/profile/owner', data);
      return response.data;
    } catch (error) {
      console.error('Update owner profile error:', error);
      throw error.response?.data?.message || 'Failed to update owner profile';
    }
  },

  // DELETE /api/profile/owner
  // Delete owner profile
  deleteOwnerProfile: async () => {
    try {
      const response = await api.delete('/profile/owner');
      return response.data;
    } catch (error) {
      console.error('Delete owner profile error:', error);
      throw error.response?.data?.message || 'Failed to delete owner profile';
    }
  },

  // GET /api/profile/owner/completion
  // Get owner profile completion status
  getOwnerProfileCompletion: async () => {
    try {
      const response = await api.get('/profile/owner/completion');
      return response.data;
    } catch (error) {
      console.error('Get owner completion error:', error);
      throw error.response?.data?.message || 'Failed to fetch owner profile completion';
    }
  },

  // GET /api/profile/influencer
  // Get authenticated influencer profile
  getInfluencerProfile: async () => {
    try {
      const response = await api.get('/profile/influencer');
      return response.data;
    } catch (error) {
      console.error('Get influencer profile error:', error);
      throw error.response?.data?.message || 'Failed to fetch influencer profile';
    }
  },


  // PUT /api/profile/influencer
  // Update influencer profile
  updateInfluencerProfile: async (data) => {
    try {
      const response = await api.put('/profile/influencer', data);
      return response.data;
    } catch (error) {
      console.error('Update influencer profile error:', error);
      throw error.response?.data?.message || 'Failed to update influencer profile';
    }
  },

  // DELETE /api/profile/influencer
  // Delete influencer profile
  deleteInfluencerProfile: async () => {
    try {
      const response = await api.delete('/profile/influencer');
      return response.data;
    } catch (error) {
      console.error('Delete influencer profile error:', error);
      throw error.response?.data?.message || 'Failed to delete influencer profile';
    }
  },

  // GET /api/profile/influencer/completion
  // Get influencer profile completion status
  getInfluencerProfileCompletion: async () => {
    try {
      const response = await api.get('/profile/influencer/completion');
      return response.data;
    } catch (error) {
      console.error('Get influencer completion error:', error);
      throw error.response?.data?.message || 'Failed to fetch influencer profile completion';
    }
  },
};

export default profileService;