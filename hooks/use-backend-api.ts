'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface UseBackendApiOptions {
  immediate?: boolean;
  refreshInterval?: number; // Auto-refresh interval in milliseconds
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
        console.error('Backend API Error:', result.error);
      } else {
        setData(result.data);
        setError(null);
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

    // Set up auto-refresh if specified
    let intervalId: NodeJS.Timeout | null = null;
    if (options.refreshInterval && options.refreshInterval > 0) {
      intervalId = setInterval(fetchData, options.refreshInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [options.immediate, options.refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Specific hooks for different API endpoints
export function useUsers(params?: { limit?: number; offset?: number; platform?: string }) {
  return useBackendApi(
    () => apiClient.getUsers(params),
    { immediate: true, refreshInterval: 30000 } // Refresh every 30 seconds
  );
}

export function useMessages(params?: { limit?: number }) {
  return useBackendApi(
    () => apiClient.getMessages(params),
    { immediate: true, refreshInterval: 10000 } // Refresh every 10 seconds
  );
}

export function useOverviewStats() {
  return useBackendApi(
    () => apiClient.getOverviewStats(),
    { immediate: true, refreshInterval: 15000 } // Refresh every 15 seconds
  );
}

export function useHealthCheck() {
  return useBackendApi(
    () => apiClient.healthCheck(),
    { immediate: true, refreshInterval: 60000 } // Refresh every minute
  );
}

export function useUserMessages(userId: string, params?: { limit?: number }) {
  return useBackendApi(
    () => apiClient.getUserMessages(userId, params),
    { immediate: !!userId }
  );
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
        console.error('Backend API Mutation Error:', result.error);
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

// Hook for webhook setup
export function useWebhookSetup() {
  return useBackendApiMutation<{
    success: boolean;
    results: {
      telegram: { success: boolean; url: string };
      viber: { success: boolean; url: string };
    };
  }>();
}