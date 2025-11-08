import axios from 'axios';
// import { getAccessToken } from '../service/AuthService';
import { requestInterceptor, responseInterceptor } from './interceptors';

// Environment-based base URL
export const baseUrl = 'https://snake-and-ladder-online-multi.onrender.com';
export const baseApiUrl = `${baseUrl}/api`;

// Create axios instance with default configuration
export const axiosInstance = axios.create({
  baseURL: baseApiUrl,
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add interceptors
axiosInstance.interceptors.request.use(
  requestInterceptor.onSuccess,
  requestInterceptor.onError
);

axiosInstance.interceptors.response.use(
  responseInterceptor.onSuccess,
  responseInterceptor.onError
);

export default axiosInstance;