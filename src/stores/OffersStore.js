import { create } from 'zustand';
import offersService from '../api/offersApi';

const useOffersStore = create((set) => ({
  offers: [],
  incomingOffers: [],
  currentOffer: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  },

  // Create an offer for a service listing
  createOffer: async (serviceId, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await offersService.createOffer(serviceId, data);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to create offer');
      }

      const offer = payload?.offer || payload?.data || payload;
      set((state) => ({
        offers: [offer, ...state.offers],
        currentOffer: offer,
        isLoading: false
      }));
      return { success: true, data: offer };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to create offer';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get all offers (sent offers)
  getOffers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await offersService.getOffers(params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || Array.isArray(payload);

      if (!ok && !payload?.offers) {
        throw new Error(payload?.message || 'Failed to fetch offers');
      }

      const offers = payload?.offers || payload?.data || (Array.isArray(payload) ? payload : []);
      const pagination = payload?.pagination || null;

      set({
        offers,
        pagination: pagination || { currentPage: 1, totalPages: 1, totalItems: offers.length, itemsPerPage: 10 },
        isLoading: false
      });
      return { success: true, data: offers };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch offers';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get incoming offers (offers to my services)
  getIncomingOffers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await offersService.getIncomingOffers(params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || Array.isArray(payload);

      if (!ok && !payload?.offers) {
        throw new Error(payload?.message || 'Failed to fetch incoming offers');
      }

      const offers = payload?.offers || payload?.data || (Array.isArray(payload) ? payload : []);
      const pagination = payload?.pagination || null;

      set({
        incomingOffers: offers,
        pagination: pagination || { currentPage: 1, totalPages: 1, totalItems: offers.length, itemsPerPage: 10 },
        isLoading: false
      });
      return { success: true, data: offers };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch incoming offers';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get offer by ID
  getOfferById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await offersService.getOfferById(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.offer;

      if (!ok) {
        throw new Error(payload?.message || 'Failed to fetch offer');
      }

      const offer = payload?.offer || payload?.data || payload;
      set({ currentOffer: offer, isLoading: false });
      return { success: true, data: offer };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch offer';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Update an offer
  updateOffer: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await offersService.updateOffer(id, data);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to update offer');
      }

      const offer = payload?.offer || payload?.data || payload;
      set((state) => ({
        offers: state.offers.map((o) => (o.id === id || o._id === id ? { ...o, ...offer } : o)),
        currentOffer: offer,
        isLoading: false
      }));
      return { success: true, data: offer };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to update offer';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Delete an offer
  deleteOffer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await offersService.deleteOffer(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to delete offer');
      }

      set((state) => ({
        offers: state.offers.filter((o) => o.id !== id && o._id !== id),
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to delete offer';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Accept an offer
  acceptOffer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await offersService.acceptOffer(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to accept offer');
      }

      const offer = payload?.offer || payload?.data || payload;
      set((state) => ({
        incomingOffers: state.incomingOffers.map((o) => (o.id === id || o._id === id ? { ...o, ...offer } : o)),
        currentOffer: offer,
        isLoading: false
      }));
      return { success: true, data: offer };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to accept offer';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Reject an offer
  rejectOffer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await offersService.rejectOffer(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to reject offer');
      }

      set((state) => ({
        incomingOffers: state.incomingOffers.map((o) => (o.id === id || o._id === id ? { ...o, status: 'rejected' } : o)),
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to reject offer';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Counter an offer
  counterOffer: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await offersService.counterOffer(id, data);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to counter offer');
      }

      const offer = payload?.offer || payload?.data || payload;
      set((state) => ({
        incomingOffers: state.incomingOffers.map((o) => (o.id === id || o._id === id ? { ...o, ...offer } : o)),
        currentOffer: offer,
        isLoading: false
      }));
      return { success: true, data: offer };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to counter offer';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  clearError: () => set({ error: null })
}));

export default useOffersStore;
