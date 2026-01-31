import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // Enable cookies for refresh token
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and token has expired
    if (
      error.response?.status === 401 && 
      error.response?.data?.message === "Access token has expired." &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint with credentials
        const refreshResponse = await axios.post(
          'http://localhost:5000/api/auth/refresh-token',
          {},
          {
            withCredentials: true, // Send cookies
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (refreshResponse.data.success) {
          const newAccessToken = refreshResponse.data.data.accessToken;

          // Update token in localStorage
          const authStorage = localStorage.getItem('auth-storage');
          if (authStorage) {
            const parsed = JSON.parse(authStorage);
            parsed.state.token = newAccessToken;
            localStorage.setItem('auth-storage', JSON.stringify(parsed));
          }

          // Update default header
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Process queued requests
          processQueue(null, newAccessToken);
          isRefreshing = false;

          // Retry original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear auth and redirect to login
        processQueue(refreshError, null);
        isRefreshing = false;
        
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }

    // For other 401 errors or non-401 errors, handle normally
    if (error.response?.status === 401 && originalRequest._retry) {
      // Already tried to refresh, clear auth and redirect
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
