'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface UseBackendApiOptions {
  immediate?: boolean;
}

interface UseBackendApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBackendApi<T>(
  apiCall: () => Promise<{ data: T | null; error: string | null }>,
  options: UseBackendApiOptions = { immediate: true }
): UseBackendApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiCall();
      
      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Backend API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate) {
      fetchData();
    }
  }, [options.immediate]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Specific hooks for different API endpoints
export function useUsers(params?: { limit?: number; offset?: number; platform?: string }) {
  return useBackendApi(() => apiClient.getUsers(params));
}

export function useMessages(params?: { limit?: number }) {
  return useBackendApi(() => apiClient.getMessages(params));
}

export function useOverviewStats() {
  return useBackendApi(() => apiClient.getOverviewStats());
}

export function useHealthCheck() {
  return useBackendApi(() => apiClient.healthCheck());
}

export function useBackendApiMutation<T, P = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    apiCall: (payload: P) => Promise<{ data: T | null; error: string | null }>,
    payload: P
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiCall(payload);
      
      if (result.error) {
        setError(result.error);
        return null;
      }
      
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Backend API Mutation Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
    error
  };
}