// Token storage - MATCHING YOUR SECURITY FLOW
let accessToken = null; // Keep in memory only (volatile)
const REFRESH_TOKEN_ID_KEY = 'REFRESH_ID'; // Document ID in localStorage

export const AuthService = {
  // Access Token - MEMORY ONLY (your intended flow)
  setAccessToken: (token) => {
    if (!token) {
      console.warn('Attempted to set null or undefined access token');
      return;
    }
    accessToken = token; // Only in memory, lost on refresh
  },

  getAccessToken: () => {
    return accessToken; // Returns null after page refresh
  },

  // Refresh Token ID - LOCALSTORAGE (persistent)
  setRefreshTokenId: (refreshTokenId) => {
    if (!refreshTokenId) {
      console.warn('Attempted to set null or undefined refresh token ID');
      return;
    }
    localStorage.setItem(REFRESH_TOKEN_ID_KEY, refreshTokenId);
  },

  getRefreshTokenId: () => {
    return localStorage.getItem(REFRESH_TOKEN_ID_KEY);
  },

  clearTokens: () => {
    accessToken = null; // Clear memory
    localStorage.removeItem(REFRESH_TOKEN_ID_KEY); // Clear persistent storage
  },

  // Check if user can refresh (has refresh token ID)
  canRefresh: () => {
    return !!AuthService.getRefreshTokenId();
  },

  // Check if currently has access token (before page refresh)
  hasAccessToken: () => {
    return !!accessToken;
  },

  // Token validation
  isTokenExpired: (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  }
};

// For backward compatibility with your existing code
export const setAccessToken = AuthService.setAccessToken;
export const getAccessToken = AuthService.getAccessToken;
export const clearTokens = AuthService.clearTokens;