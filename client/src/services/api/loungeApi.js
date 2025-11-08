import { axiosInstance } from '../../axios';
import { API_ROUTES } from './apiConstants';

export const LoungeApi = {
  // Get all lounges
  getLounges: async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.LOUNGE.GET_ALL);
      console.log('Lounges fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching lounges:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch lounges');
    }
  },

  // Get lounge by ID
  getLoungeById: async (loungeId) => {
    try {
      const response = await axiosInstance.get(`${API_ROUTES.LOUNGE.BASE}/${loungeId}`);
      console.log('Lounge details:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching lounge details:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch lounge details');
    }
  },

  // Get popular lounges (if you have this endpoint)
  getPopularLounges: async () => {
    try {
      const response = await axiosInstance.get(`${API_ROUTES.LOUNGE.BASE}/popular`);
      console.log('Popular lounges:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular lounges:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch popular lounges');
    }
  },

  // Search lounges (if you have this endpoint)
  searchLounges: async (query) => {
    try {
      const response = await axiosInstance.get(`${API_ROUTES.LOUNGE.BASE}/search`, {
        params: { q: query }
      });
      console.log('Search results:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error searching lounges:', error);
      throw new Error(error.response?.data?.message || 'Failed to search lounges');
    }
  }
};

// For backward compatibility
export const getLounges = LoungeApi.getLounges;