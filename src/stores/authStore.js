import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../api/authApi';

const useAuthStore = create(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: true, error: null }),
      
      setToken: (token) => set({ token }),
      
      setAuth: (user, token) => 
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          error: null 
        }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error, isLoading: false }),
      
      clearError: () => set({ error: null }),
      
      logout: () => 
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          error: null 
        }),
      
      updateUser: (updates) => 
        set((state) => ({ 
          user: { ...state.user, ...updates } 
        })),

      // Async Actions
      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(userData);
          
          // Handle successful response: { success: true, status: 201, message: "...", data: { userId, needsRoleSelection } }
          if (response.success) {
            const { userId, needsRoleSelection } = response.data || {};
            
            set({ 
              user: { userId },
              isAuthenticated: true, 
              isLoading: false,
              error: null 
            });
            
            return { 
              success: true, 
              userId, 
              needsRoleSelection,
              message: response.message 
            };
          }
          
          // Handle unexpected response format
          throw new Error(response.message || 'Registration failed');
          
        } catch (error) {
          // Error is already a string from authService (error.response?.data?.message)
          const errorMessage = typeof error === 'string' ? error : error.message || 'Registration failed';
          
          set({ 
            error: errorMessage, 
            isLoading: false,
            isAuthenticated: false 
          });
          
          return { success: false, error: errorMessage };
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          
          // Handle successful response: { success: true, status: 200, message: "...", data: { user, token, role? } }
          if (response.success) {
            const { user, token, role } = response.data || {};
            
            set({ 
              user: { 
                ...user, 
                role: role || user?.role,
                roleId: user?.roleId 
              }, 
              token, 
              isAuthenticated: true, 
              isLoading: false,
              error: null 
            });
            
            return { 
              success: true, 
              user, 
              token,
              role: role || user?.role,
              roleId: user?.roleId,
              message: response.message 
            };
          }
          
          // Handle unexpected response format
          throw new Error(response.message || 'Login failed');
          
        } catch (error) {
          const errorMessage = typeof error === 'string' ? error : error.message || 'Login failed';
          set({ 
            error: errorMessage, 
            isLoading: false,
            isAuthenticated: false 
          });
          return { success: false, error: errorMessage };
        }
      },

      selectRole: async (userId, roleId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.selectRole(userId, roleId);
          
          // Handle successful response
          if (response.success) {
            // Update user with role information
            set((state) => ({ 
              user: { 
                ...state.user, 
                roleId,
                role: roleId === 1 ? 'campaign_owner' : 'influencer'
              },
              isLoading: false,
              error: null 
            }));
            
            return { 
              success: true, 
              roleId,
              message: response.message,
              data: response.data
            };
          }
          
          // Handle unexpected response format
          throw new Error(response.message || 'Role selection failed');
          
        } catch (error) {
          const errorMessage = typeof error === 'string' ? error : error.message || 'Role selection failed';
          
          set({ 
            error: errorMessage, 
            isLoading: false
          });
          
          return { success: false, error: errorMessage };
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
