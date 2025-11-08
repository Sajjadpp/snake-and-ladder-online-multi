import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { axiosInstance } from '../../axios';
import { AuthService } from '../../services/auth';
import { authReducer, authActions } from './authReducer';
import { useState } from 'react';

const AuthContext = createContext();

const initialState = {
  token: null,
  user: null,
  loading: true
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [quickPlayData, setQuickPlayData] = useState(false)

  const refreshToken = useCallback(async () => {
    try {
      const refreshTokenId = AuthService.getRefreshTokenId();
      
      if (!refreshTokenId) {
        // No refresh token, user is not logged in
        dispatch({ type: authActions.LOGOUT });
        return;
      }

      // Get new access token using refresh token ID
      const response = await axiosInstance.get(`/auth/refresh/${refreshTokenId}`);
      const { accessToken, user } = response.data;
      console.log(user,'user l.....')
      // Set new access token in memory
      AuthService.setAccessToken(accessToken);
      dispatch({ type: authActions.SET_TOKEN, payload: accessToken });
      dispatch({ type: authActions.SET_USER, payload: user });
      
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear invalid tokens
      AuthService.clearTokens();
      dispatch({ type: authActions.LOGOUT });
    } finally {
      dispatch({ type: authActions.SET_LOADING, payload: false });
    }
  }, []);

  const login = async (mobile, password) => {
    try {
      dispatch({ type: authActions.SET_LOADING, payload: true });
      
      const response = await axiosInstance.post('/user', { 
        mobile, 
        password 
      }, { 
        withCredentials: true 
      });

      const { accessToken, user, refreshTokenId } = response.data;

      // Set access token in memory (volatile)
      AuthService.setAccessToken(accessToken);
      
      // Set refresh token ID in localStorage (persistent)
      if (refreshTokenId) {
        AuthService.setRefreshTokenId(refreshTokenId);
      }
      
      dispatch({ type: authActions.SET_TOKEN, payload: accessToken });
      dispatch({ type: authActions.SET_USER, payload: user });

      return { success: true, user };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      dispatch({ type: authActions.SET_LOADING, payload: false });
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: authActions.SET_LOADING, payload: true });
      
      const response = await axiosInstance.post('/user', userData, { 
        withCredentials: true 
      });

      const { accessToken, user, refreshTokenId } = response.data;

      // Set access token in memory (volatile)
      AuthService.setAccessToken(accessToken);
      
      // Set refresh token ID in localStorage (persistent)
      if (refreshTokenId) {
        AuthService.setRefreshTokenId(refreshTokenId);
      }
      
      dispatch({ type: authActions.SET_TOKEN, payload: accessToken });
      dispatch({ type: authActions.SET_USER, payload: user });

      return { success: true, user };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    } finally {
      dispatch({ type: authActions.SET_LOADING, payload: false });
    }
  };

  const updateUser = async(updatedData) => {
    dispatch({type: authActions.SET_USER, payload: {...state.user, ...updatedData}})
  }

  const logout = async () => {
    try {
      const refreshTokenId = AuthService.getRefreshTokenId();
      if (refreshTokenId) {
        localStorage.removeItem('REFRESH_ID')
        await axiosInstance.post('/auth/logout', { refreshTokenId });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear both memory and localStorage
      AuthService.clearTokens();
      dispatch({ type: authActions.LOGOUT });
    }
  };

  // Refresh token on every app load (page refresh)
  useEffect(() => {
    refreshToken();
  }, [refreshToken]);

  const value = {
    token: state.token,
    user: state.user,
    loading: state.loading,
    quickPlayData,
    setQuickPlayData,
    login,
    logout,
    register,
    updateUser,
    refreshToken, // Expose if needed
    isAuthenticated: () => !!state.token && !!state.user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};