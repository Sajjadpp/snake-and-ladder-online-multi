import axios from 'axios';
import { getAccessToken, setAccessToken, clearTokens } from '../../services/auth';
import { baseUrl } from '../axiosInstance';

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

export const responseInterceptor = {
  onSuccess: (response) => {
    // Log successful response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.url}`, response.data);
    }
    return response;
  },
  
  onError: async (error) => {
    const originalRequest = error.config;
    console.log(error);
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${originalRequest?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
    }
    
    // Handle token refresh for 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, add to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const refreshId = localStorage.getItem('REFRESH_ID');
        if (!refreshId) {
          throw new Error('No refresh token available');
        }
        
        // Create a new axios instance without interceptors for refresh call
        const refreshAxios = axios.create({
          baseURL: baseUrl,
          withCredentials: true
        });
        
        const response = await refreshAxios.get(`/auth/refresh/${refreshId}`);
        const { accessToken, user } = response.data;
        
        setAccessToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Process queued requests
        processQueue(null, accessToken);
        
        // Retry original request
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Clear tokens and redirect to login
        clearTokens();
        localStorage.removeItem('REFRESH_ID');
        
        // Process queued requests with error
        processQueue(refreshError, null);
        
        // Redirect to login page if we're not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?session=expired';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle other error cases
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'An unexpected error occurred';
    
    // Enhanced error object
    const enhancedError = {
      ...error,
      message: errorMessage,
      status: error.response?.status,
      code: error.response?.data?.code,
      timestamp: new Date().toISOString()
    };
    
    return Promise.reject(enhancedError);
  }
};