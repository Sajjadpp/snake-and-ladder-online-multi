import { getAccessToken } from '../../services/auth';

export const requestInterceptor = {
  onSuccess: (config) => {
    // Add auth token to request
    console.log('working preflit')
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data
      });
    }
    
    return config;
  },
  
  onError: (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
};