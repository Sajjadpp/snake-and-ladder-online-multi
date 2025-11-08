import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { LoungeApi } from '../services/api';

export const useLounges = () => {
  const [lounges, setLounges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchLounges = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await LoungeApi.getLounges();
        setLounges(data);
      } catch (error) {
        console.error('Error fetching lounges:', error);
        setError(error.message);
        toast.error(error.message || 'Failed to fetch lounges');
      } finally {
        setLoading(false);
      }
    };

    fetchLounges();
  }, [toast]);

  const refetch = async () => {
    const fetchLounges = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await LoungeApi.getLounges();
        setLounges(data);
      } catch (error) {
        console.error('Error refetching lounges:', error);
        setError(error.message);
        toast.error(error.message || 'Failed to refetch lounges');
      } finally {
        setLoading(false);
      }
    };

    await fetchLounges();
  };

  return { 
    lounges, 
    loading, 
    error,
    refetch 
  };
};