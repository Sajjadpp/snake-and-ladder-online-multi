import { AuthService } from './AuthService';

// Re-export everything from AuthService
export { AuthService } from './AuthService';

// Keep your original exports for backward compatibility
export const {
  setAccessToken,
  getAccessToken,
  clearTokens,
  setRefreshTokenId,
  getRefreshTokenId,
  canRefresh,
  hasAccessToken,
  isTokenExpired
} = AuthService;