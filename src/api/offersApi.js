import api from '../config/axios';

const offersService = {

  // POST /api/service-listings/{id}/offers
  // Create an offer for a service listing
  createOffer: async (id, data) => {
    try {
      const response = await api.post(`/service-listings/${id}/offers`, data);
      return response.data;
    } catch (error) {
      console.error('Create offer error:', error);
      throw error.response?.data?.message || 'Failed to create offer';
    }
  },

  // GET /api/offers
  // Get my offers (Owner)
  getMyOffers: async (params = {}) => {
    try {
      const { page = 1, limit = 10, status } = params;
      const query = new URLSearchParams({ page, limit });
      if (status) query.set('status', status);
      const response = await api.get(`/offers?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get my offers error:', error);
      throw error.response?.data?.message || 'Failed to fetch my offers';
    }
  },

  // GET /api/offers/{id}
  // Get offer by ID
  getOfferById: async (id) => {
    try {
      const response = await api.get(`/offers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get offer by ID error:', error);
      throw error.response?.data?.message || 'Failed to fetch offer';
    }
  },

  // PUT /api/offers/{id}
  // Update an offer (Owner)
  updateOffer: async (id, data) => {
    try {
      const response = await api.put(`/offers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update offer error:', error);
      throw error.response?.data?.message || 'Failed to update offer';
    }
  },

  // DELETE /api/offers/{id}
  // Withdraw an offer (Owner)
  withdrawOffer: async (id) => {
    try {
      const response = await api.delete(`/offers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Withdraw offer error:', error);
      throw error.response?.data?.message || 'Failed to withdraw offer';
    }
  },

  // GET /api/offers/incoming
  // Get incoming offers (Influencer)
  getIncomingOffers: async (params = {}) => {
    try {
      const { page = 1, limit = 10, status } = params;
      const query = new URLSearchParams({ page, limit });
      if (status) query.set('status', status);
      const response = await api.get(`/offers/incoming?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get incoming offers error:', error);
      throw error.response?.data?.message || 'Failed to fetch incoming offers';
    }
  },

  // POST /api/offers/{id}/accept
  // Accept an offer (Influencer)
  acceptOffer: async (id) => {
    try {
      const response = await api.post(`/offers/${id}/accept`);
      return response.data;
    } catch (error) {
      console.error('Accept offer error:', error);
      throw error.response?.data?.message || 'Failed to accept offer';
    }
  },

  // POST /api/offers/{id}/reject
  // Reject an offer (Influencer)
  rejectOffer: async (id, data) => {
    try {
      const response = await api.post(`/offers/${id}/reject`, data);
      return response.data;
    } catch (error) {
      console.error('Reject offer error:', error);
      throw error.response?.data?.message || 'Failed to reject offer';
    }
  },

  // POST /api/offers/{id}/counter
  // Counter an offer (Influencer)
  counterOffer: async (id, data) => {
    try {
      const response = await api.post(`/offers/${id}/counter`, data);
      return response.data;
    } catch (error) {
      console.error('Counter offer error:', error);
      throw error.response?.data?.message || 'Failed to counter offer';
    }
  },
};

export default offersService;