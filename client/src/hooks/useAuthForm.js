import { useState, useEffect } from 'react';
import { data, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { axiosInstance } from '../axios';
import { setAccessToken } from '../services';
import { validateAuthForm } from '../utils/validation';
import { useNavigation } from './useNavigation';

export const useAuthForm = (toast) => {
  const [isUserFresh, setIsUserFresh] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
    username: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login, register, user , updateUser} = useAuth();
  const {navigateTo} = useNavigation()
  const [searchParams] = useSearchParams();
  const afterParam = searchParams.get('after');
  const fresher = searchParams.get('f');

  useEffect(() => {
    if (fresher) {
      setIsUserFresh(true);
    }
  }, [fresher]);

  useEffect(() => {
    if (user) {
      navigateTo(`/${afterParam ?? 'home'}`);
    }
  }, [user, afterParam, navigateTo]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const AVATAR_EMOJIS = [
    '😀','😎','🤓','😇',
    '🤠','🥳','🤖','👽',
    '😺','🧙‍♂️','🧑‍🎤','🧑‍🚀',
    '🧑‍💻','🧑‍🍳','🧑‍🎓','🧑‍🚒',
    '🧑‍🚀','🧑‍⚖️','🧑‍🏫','🧑‍💼',
  ];

  const handleAvatarSelect = async(selectedEmoji) => {
    console.log(selectedEmoji,'selected emojiess')
    if(!AVATAR_EMOJIS.includes(selectedEmoji.emoji)) {
      return toast.error('Please select Avatar emojis only')
    }

    try {
      const response = await axiosInstance.put('/user', {
        avatar: selectedEmoji.emoji
      })
      await updateUser({avatar: selectedEmoji.emoji})
      return response.data;
    }
    catch(error) {
      console.log(error);
      return error.message
    }
  }

  const handleSubmit = async (e) => {
    console.log(e)
    e.preventDefault();
    
    const validationErrors = validateAuthForm(formData, isUserFresh);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    try {
      let result;
      
      if (isUserFresh) {
        result = await register(formData);
      } else {
        result = await login(formData.mobile, formData.password);
      }
      
      if (result.success) {
        const redirectPath = afterParam ? `/${afterParam}` : '/';
        console.log(redirectPath,'redirection path')
        navigateTo(redirectPath);
        toast.success(isUserFresh ? 'Account created successfully!' : 'Login successful!');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserType = () => {
    const newIsUserFresh = !isUserFresh;
    setIsUserFresh(newIsUserFresh);
    
    const newParams = new URLSearchParams();
    if (afterParam) newParams.set('after', afterParam);
    if (newIsUserFresh) newParams.set('f', '1');
    
    navigateTo(`/login?${newParams.toString()}`);
  };

  const handleBack = () => {
    navigateTo('/');
  };

  return {
    isUserFresh,
    showPassword,
    showConfirmPassword,
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleSubmit,
    toggleUserType,
    handleBack,
    setShowPassword,
    setShowConfirmPassword,
    handleAvatarSelect
  };
};