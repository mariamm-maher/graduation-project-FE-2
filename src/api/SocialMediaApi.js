import api from '../config/axios';

const SOCIAL_ENDPOINTS = {
  accounts: ['/channels'],
  disconnect: (identifier) => [
    `/channels/${identifier}`,
  ],
  details: (identifier) => [
    `/channels/${identifier}`,
    `/channel/${identifier}`,
  ],
  refreshToken: (identifier) => [
    `/channels/${identifier}/refresh-token`,
  ],
  stats: (identifier) => [
    `/channels/${identifier}/stats`,
  ],
};

const shouldTryNextEndpoint = (error) => {
  const status = error?.response?.status;
  return status === 404 || status === 500 || status === 502 || status === 503;
};

const tryGetWithFallback = async (urls) => {
  let lastError;
  for (const url of urls) {
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      lastError = error;
      if (!shouldTryNextEndpoint(error)) break;
    }
  }
  throw lastError;
};

const tryPostWithFallback = async (urls, data) => {
  let lastError;
  for (const url of urls) {
    try {
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      lastError = error;
      if (!shouldTryNextEndpoint(error)) break;
    }
  }
  throw lastError;
};

const tryDeleteWithFallback = async (urls) => {
  let lastError;
  for (const url of urls) {
    try {
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      lastError = error;
      if (!shouldTryNextEndpoint(error)) break;
    }
  }
  throw lastError;
};

const socialMediaService = {
  connectAccount: async (platform, data) => {
    try {
      const response = await api.post(`/social-media/${platform}/connect`, data);
      return response.data;
    } catch (error) {
      console.error('Connect social media account error:', error);
      throw error.response?.data?.message || 'Failed to connect social media account';
    }
  },

  disconnectAccount: async (identifier) => {
    try {
      return await tryDeleteWithFallback(SOCIAL_ENDPOINTS.disconnect(identifier));
    } catch (error) {
      console.error('Disconnect social media account error:', error);
      throw error.response?.data?.message || 'Failed to disconnect social media account';
    }
  },

  getAccounts: async () => {
    try {
      return await tryGetWithFallback(SOCIAL_ENDPOINTS.accounts);
    } catch (error) {
      console.error('Get social media accounts error:', error);
      throw error.response?.data?.message || 'Failed to fetch social media accounts';
    }
  },

  getStats: async (platform) => {
    try {
      return await tryGetWithFallback(SOCIAL_ENDPOINTS.stats(platform));
    } catch (error) {
      console.error('Get social media stats error:', error);
      throw error.response?.data?.message || 'Failed to fetch social media stats';
    }
  },

  getChannelDetails: async (identifier) => {
    try {
      return await tryGetWithFallback(SOCIAL_ENDPOINTS.details(identifier));
    } catch (error) {
      console.error('Get channel details error:', error);
      throw error.response?.data?.message || 'Failed to fetch channel details';
    }
  },

  refreshChannelToken: async (identifier) => {
    try {
      return await tryPostWithFallback(SOCIAL_ENDPOINTS.refreshToken(identifier), {});
    } catch (error) {
      console.error('Refresh channel token error:', error);
      throw error.response?.data?.message || 'Failed to refresh channel token';
    }
  },

  createPost: async (payload) => {
    try {
      const response = await api.post('/posts', payload);
      return response.data;
    } catch (error) {
      console.error('Create post error:', error);
      throw error.response?.data?.message || 'Failed to create post';
    }
  },

  getPosts: async () => {
    try {
      const response = await api.get('/posts');
      return response.data;
    } catch (error) {
      console.error('Get posts error:', error);
      throw error.response?.data?.message || 'Failed to fetch posts';
    }
  },

  deletePost: async (postId) => {
    try {
      const response = await api.delete(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Delete post error:', error);
      throw error.response?.data?.message || 'Failed to delete post';
    }
  },

  getPostAnalytics: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Get post analytics error:', error);
      throw error.response?.data?.message || 'Failed to fetch post analytics';
    }
  }
};

export default socialMediaService;