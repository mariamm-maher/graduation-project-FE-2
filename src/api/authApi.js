import api from '../config/axios';

// Auth Service Functions
const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      console.log('Registration response:', response);
      return response.data;
    } catch (error) {
      console.error('Registration error from axios:', error);
      throw error.response?.data?.message || 'Registration failed';
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response);
      return response.data;
    } catch (error) {
      console.error('Login error from axios:', error);
      throw error.response?.data?.message || 'Login failed';
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Logout failed';
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch profile';
    }
  },

  // Update user profile
  updateProfile: async (updates) => {
    try {
      const response = await api.put('/auth/profile', updates);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update profile';
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh-token');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to refresh token';
    }
  },

  // Request password reset
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to send reset email';
    }
  },

  // Reset password with token
  resetPassword: async (token, password) => {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to reset password';
    }
  },


  // Campaign Owner specific onboarding
  completeCampaignOwnerOnboarding: async (data) => {
    try {
      const response = await api.post('/auth/onboarding/campaign-owner', data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Onboarding failed';
    }
  },

  // Influencer specific onboarding
  completeInfluencerOnboarding: async (data) => {
    try {
      const response = await api.post('/auth/onboarding/influencer', data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Onboarding failed';
    }
  },

  // Check if user exists (for registration)
  checkUserExists: async (email) => {
    try {
      const response = await api.post('/auth/check-user', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Check failed';
    }
  },

  // Select user role after registration
  selectRole: async (userId, roleId) => {
    try {
      const response = await api.post('/auth/select-role', {
        userId,
        roleId // 1 for campaign_owner, 2 for influencer
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Role selection failed';
    }
  },
};

export default authService;
