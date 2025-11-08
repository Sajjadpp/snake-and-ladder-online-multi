import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useNavigation = () => {
  const navigate = useNavigate();

  // 🛠️ FIX: Create stable navigation functions without auth dependencies
  const navigateTo = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const navigateToLogin = useCallback((redirectPath = 'home') => {
    console.log(redirectPath, 'redirection path');
    navigate(`/login?after=${redirectPath}`);
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    navigateTo,
    navigateToLogin,
    goBack
  };
};