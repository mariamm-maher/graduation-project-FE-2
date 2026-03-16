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

  // Get contracts for current owner
  getMyOwnerContracts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationContractsService.getMyOwnerContracts();
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.contracts || payload?.data;

      if (!ok) {
        throw new Error(payload?.message || 'Failed to fetch owner contracts');
      }

      const contracts = payload?.contracts || payload?.data?.contracts || payload?.data || (Array.isArray(payload) ? payload : []);
      set({ contracts: Array.isArray(contracts) ? contracts : [contracts], isLoading: false });
      return { success: true, data: contracts };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch owner contracts';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get contracts for current influencer
  getMyInfluencerContracts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationContractsService.getMyInfluencerContracts();
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.contracts || payload?.data;

      if (!ok) {
        throw new Error(payload?.message || 'Failed to fetch influencer contracts');
      }

      const contracts = payload?.contracts || payload?.data?.contracts || payload?.data || (Array.isArray(payload) ? payload : []);
      set({ contracts: Array.isArray(contracts) ? contracts : [contracts], isLoading: false });
      return { success: true, data: contracts };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch influencer contracts';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Sign contract as owner
  signContractAsOwner: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationContractsService.signContractAsOwner(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to sign contract as owner');
      }

      const updated = payload?.contract || payload?.data || payload;
      set((state) => ({
        contracts: state.contracts.map((c) => (c.id === id || c._id === id ? { ...c, ...updated } : c)),
        currentContract: state.currentContract && (state.currentContract.id === id || state.currentContract._id === id)
          ? { ...state.currentContract, ...updated }
          : state.currentContract,
        isLoading: false,
      }));
      return { success: true, data: updated };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to sign contract as owner';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Sign contract as influencer
  signContractAsInfluencer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationContractsService.signContractAsInfluencer(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to sign contract as influencer');
      }

      const updated = payload?.contract || payload?.data || payload;
      set((state) => ({
        contracts: state.contracts.map((c) => (c.id === id || c._id === id ? { ...c, ...updated } : c)),
        currentContract: state.currentContract && (state.currentContract.id === id || state.currentContract._id === id)
          ? { ...state.currentContract, ...updated }
          : state.currentContract,
        isLoading: false,
      }));
      return { success: true, data: updated };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to sign contract as influencer';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },


  clearError: () => set({ error: null })
}));

export default useCollaborationContractsStore;
