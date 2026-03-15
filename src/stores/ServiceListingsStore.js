import { create } from 'zustand';
import serviceListingsService from '../api/serviceListingsApi';

const useServiceListingsStore = create((set) => ({
  listings: [],
  myListings: [],
  currentListing: null,
  categories: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  },

  // Browse service listings
  browseListings: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await serviceListingsService.getListings(params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || Array.isArray(payload);

      if (!ok && !payload?.listings) {
        throw new Error(payload?.message || 'Failed to fetch listings');
      }

      const listings = payload?.listings || payload?.data || (Array.isArray(payload) ? payload : []);
      const pagination = payload?.pagination || null;

      set({
        listings,
        pagination: pagination || { currentPage: 1, totalPages: 1, totalItems: listings.length, itemsPerPage: 10 },
        isLoading: false
      });
      return { success: true, data: listings };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch listings';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Search service listings
  searchListings: async (query, params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await serviceListingsService.searchListings(query, params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || Array.isArray(payload);

      if (!ok && !payload?.listings) {
        throw new Error(payload?.message || 'Failed to search listings');
      }

      const listings = payload?.listings || payload?.data || (Array.isArray(payload) ? payload : []);
      set({ listings, isLoading: false });
      return { success: true, data: listings };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to search listings';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get categories
  getCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await serviceListingsService.getCategories();
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || Array.isArray(payload);

      if (!ok && !payload?.categories) {
        throw new Error(payload?.message || 'Failed to fetch categories');
      }

      const categories = payload?.categories || payload?.data || (Array.isArray(payload) ? payload : []);
      set({ categories, isLoading: false });
      return { success: true, data: categories };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch categories';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Create a listing
  createListing: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await serviceListingsService.createListing(data);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to create listing');
      }

      const listing = payload?.listing || payload?.data || payload;
      set((state) => ({
        myListings: [listing, ...state.myListings],
        currentListing: listing,
        isLoading: false
      }));
      return { success: true, data: listing };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to create listing';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get my listings
  getMyListings: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await serviceListingsService.getMyListings(params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || Array.isArray(payload);

      if (!ok && !payload?.listings) {
        throw new Error(payload?.message || 'Failed to fetch my listings');
      }

      const listings = payload?.listings || payload?.data || (Array.isArray(payload) ? payload : []);
      set({ myListings: listings, isLoading: false });
      return { success: true, data: listings };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch my listings';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get listing by ID
  getListingById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await serviceListingsService.getListingById(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.listing;

      if (!ok) {
        throw new Error(payload?.message || 'Failed to fetch listing');
      }

      const listing = payload?.listing || payload?.data || payload;
      set({ currentListing: listing, isLoading: false });
      return { success: true, data: listing };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch listing';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Update a listing
  updateListing: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await serviceListingsService.updateListing(id, data);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to update listing');
      }

      const listing = payload?.listing || payload?.data || payload;
      set((state) => ({
        myListings: state.myListings.map((l) => (l.id === id || l._id === id ? { ...l, ...listing } : l)),
        currentListing: listing,
        isLoading: false
      }));
      return { success: true, data: listing };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to update listing';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Delete a listing
  deleteListing: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await serviceListingsService.deleteListing(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to delete listing');
      }

      set((state) => ({
        myListings: state.myListings.filter((l) => l.id !== id && l._id !== id),
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to delete listing';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Update listing status
  updateListingStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await serviceListingsService.updateListingStatus(id, status);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to update listing status');
      }

      const listing = payload?.listing || payload?.data || payload;
      set((state) => ({
        myListings: state.myListings.map((l) => (l.id === id || l._id === id ? { ...l, ...listing } : l)),
        currentListing: listing,
        isLoading: false
      }));
      return { success: true, data: listing };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to update listing status';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  clearError: () => set({ error: null })
}));

export default useServiceListingsStore;
