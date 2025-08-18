'use client';
import type {
  ApiToken,
  ApiUsageStats,
  CreateTokenRequest,
} from '@vaultx/shared';
import { useState, useEffect, useCallback } from 'react';

import {
  getApiTokens,
  getApiUsage,
  createApiToken,
  updateApiToken,
  deleteApiToken,
  regenerateApiToken,
} from '../api/mock';

interface ApiData {
  tokens: ApiToken[];
  usage: ApiUsageStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createToken: (data: CreateTokenRequest) => Promise<ApiToken | null>;
  updateToken: (
    id: string,
    data: Partial<ApiToken>
  ) => Promise<ApiToken | null>;
  deleteToken: (id: string) => Promise<boolean>;
  regenerateToken: (id: string) => Promise<ApiToken | null>;
}

export const useApiData = (): ApiData => {
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [usage, setUsage] = useState<ApiUsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [tokensResponse, usageResponse] = await Promise.all([
        getApiTokens(),
        getApiUsage(),
      ]);

      // Handle tokens response
      if (tokensResponse.success && tokensResponse.data) {
        setTokens(tokensResponse.data);
      } else {
        setError(tokensResponse.error || 'Failed to fetch API tokens');
      }

      // Handle usage response
      if (usageResponse.success && usageResponse.data) {
        setUsage(usageResponse.data);
      } else {
        setError(usageResponse.error || 'Failed to fetch API usage');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createToken = useCallback(
    async (data: CreateTokenRequest): Promise<ApiToken | null> => {
      try {
        setError(null);

        const response = await createApiToken(data);

        if (response.success && response.data) {
          // Refresh the tokens list
          await fetchData();
          return response.data;
        } else {
          setError(response.error || 'Failed to create API token');
          return null;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
        return null;
      }
    },
    [fetchData]
  );

  const updateToken = useCallback(
    async (id: string, data: Partial<ApiToken>): Promise<ApiToken | null> => {
      try {
        setError(null);

        const response = await updateApiToken(id, data);

        if (response.success && response.data) {
          // Refresh the tokens list
          await fetchData();
          return response.data;
        } else {
          setError(response.error || 'Failed to update API token');
          return null;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
        return null;
      }
    },
    [fetchData]
  );

  const deleteToken = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);

        const response = await deleteApiToken(id);

        if (response.success) {
          // Refresh the tokens list
          await fetchData();
          return true;
        } else {
          setError(response.error || 'Failed to delete API token');
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
        return false;
      }
    },
    [fetchData]
  );

  const regenerateToken = useCallback(
    async (id: string): Promise<ApiToken | null> => {
      try {
        setError(null);

        const response = await regenerateApiToken(id);

        if (response.success && response.data) {
          // Refresh the tokens list
          await fetchData();
          return response.data;
        } else {
          setError(response.error || 'Failed to regenerate API token');
          return null;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
        return null;
      }
    },
    [fetchData]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    tokens,
    usage,
    loading,
    error,
    refetch: fetchData,
    createToken,
    updateToken,
    deleteToken,
    regenerateToken,
  };
};
