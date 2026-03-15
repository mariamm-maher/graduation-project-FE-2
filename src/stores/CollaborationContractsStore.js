import { create } from 'zustand';
import collaborationContractsService from '../api/CollaborationContractsApi';

const useCollaborationContractsStore = create((set) => ({
  contracts: [],
  currentContract: null,
  isLoading: false,
  error: null,

  // Create a contract
  createContract: async (collaborationId, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationContractsService.createContract(collaborationId, data);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to create contract');
      }

      const contract = payload?.contract || payload?.data || payload;
      set((state) => ({
        contracts: [contract, ...state.contracts],
        currentContract: contract,
        isLoading: false
      }));
      return { success: true, data: contract };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to create contract';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get contract by collaboration
  getContractByCollaboration: async (collaborationId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationContractsService.getContractByCollaboration(collaborationId);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.contract;

      if (!ok) {
        throw new Error(payload?.message || 'Failed to fetch contract');
      }

      const contract = payload?.contract || payload?.data || payload;
      set({ currentContract: contract, isLoading: false });
      return { success: true, data: contract };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch contract';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Update a contract
  updateContract: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationContractsService.updateContract(id, data);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to update contract');
      }

      const contract = payload?.contract || payload?.data || payload;
      set((state) => ({
        contracts: state.contracts.map((c) => (c.id === id || c._id === id ? { ...c, ...contract } : c)),
        currentContract: contract,
        isLoading: false
      }));
      return { success: true, data: contract };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to update contract';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Send contract for signature
  sendContract: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationContractsService.sendContract(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to send contract');
      }

      const contract = payload?.contract || payload?.data || payload;
      set((state) => ({
        contracts: state.contracts.map((c) => (c.id === id || c._id === id ? { ...c, ...contract } : c)),
        currentContract: contract,
        isLoading: false
      }));
      return { success: true, data: contract };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to send contract';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Sign a contract
  signContract: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationContractsService.signContract(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to sign contract');
      }

      const contract = payload?.contract || payload?.data || payload;
      set((state) => ({
        contracts: state.contracts.map((c) => (c.id === id || c._id === id ? { ...c, ...contract } : c)),
        currentContract: contract,
        isLoading: false
      }));
      return { success: true, data: contract };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to sign contract';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  clearError: () => set({ error: null })
}));

export default useCollaborationContractsStore;
