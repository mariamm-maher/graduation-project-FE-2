import api from '../config/axios';

const serviceListingService = {

  // GET /api/service-listings/browse
  // Browse published service listings
  browsePublishedListings: async (params = {}) => {
    try {
      const { page = 1, limit = 10, category, minPrice, maxPrice } = params;
      const query = new URLSearchParams({ page, limit });
      if (category) query.set('category', category);
      if (minPrice !== undefined) query.set('minPrice', minPrice);
      if (maxPrice !== undefined) query.set('maxPrice', maxPrice);
      const response = await api.get(`/service-listings/browse?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Browse published listings error:', error);
      throw error.response?.data?.message || 'Failed to browse published service listings';
    }
  },

  // GET /api/service-listings/search
  // Search service listings with filters
  searchListings: async (params = {}) => {
    try {
      const { page = 1, limit = 10, query, category, platform, minPrice, maxPrice, sortBy, order } = params;
      const queryParams = new URLSearchParams({ page, limit });
      if (query) queryParams.set('query', query);
      if (category) queryParams.set('category', category);
      if (platform) queryParams.set('platform', platform);
      if (minPrice !== undefined) queryParams.set('minPrice', minPrice);
      if (maxPrice !== undefined) queryParams.set('maxPrice', maxPrice);
      if (sortBy) queryParams.set('sortBy', sortBy);
      if (order) queryParams.set('order', order);
      const response = await api.get(`/service-listings/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Search listings error:', error);
      throw error.response?.data?.message || 'Failed to search service listings';
    }
  },

  // GET /api/service-listings/categories
  // Get available categories
  getCategories: async () => {
    try {
      const response = await api.get('/service-listings/categories');
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error.response?.data?.message || 'Failed to fetch service listing categories';
    }
  },

  // POST /api/service-listings
  // Create a new service listing (Influencer)
  createListing: async (data) => {
    try {
      const response = await api.post('/service-listings', data);
      return response.data;
    } catch (error) {
      console.error('Create listing error:', error);
      throw error.response?.data?.message || 'Failed to create service listing';
    }
  },

  // GET /api/service-listings/my-listings
  // Get my service listings (Influencer)
  getMyListings: async (params = {}) => {
    try {
      const { page = 1, limit = 10, status } = params;
      const query = new URLSearchParams({ page, limit });
      if (status) query.set('status', status);
      const response = await api.get(`/service-listings/my-listings?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get my listings error:', error);
      throw error.response?.data?.message || 'Failed to fetch my service listings';
    }
  },

  // GET /api/service-listings/{id}
  // Get service listing by ID
  getListingById: async (id) => {
    try {
      const response = await api.get(`/service-listings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get listing by ID error:', error);
      throw error.response?.data?.message || 'Failed to fetch service listing';
    }
  },

  // PUT /api/service-listings/{id}
  // Update service listing (Influencer)
  updateListing: async (id, data) => {
    try {
      const response = await api.put(`/service-listings/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update listing error:', error);
      throw error.response?.data?.message || 'Failed to update service listing';
    }
  },

  // DELETE /api/service-listings/{id}
  // Delete service listing (Influencer)
  deleteListing: async (id) => {
    try {
      const response = await api.delete(`/service-listings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete listing error:', error);
      throw error.response?.data?.message || 'Failed to delete service listing';
    }
  },

  // PATCH /api/service-listings/{id}/status
  // Update service listing status (Influencer)
  updateListingStatus: async (id, data) => {
    try {
      const response = await api.patch(`/service-listings/${id}/status`, data);
      return response.data;
    } catch (error) {
      console.error('Update listing status error:', error);
      throw error.response?.data?.message || 'Failed to update service listing status';
    }
  },
};

export default serviceListingService;