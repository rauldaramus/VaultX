/**
 * @file: use-api-data.ts
 * @author: Raul Daramus
 * @date: 2025
 * Copyright (C) 2025 VaultX by Raul Daramus
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
 * or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 *
 * You are free to:
 *   - Share — copy and redistribute the material in any medium or format
 *   - Adapt — remix, transform, and build upon the material
 *
 * Under the following terms:
 *   - Attribution — You must give appropriate credit, provide a link to the license,
 *     and indicate if changes were made.
 *   - NonCommercial — You may not use the material for commercial purposes.
 *   - ShareAlike — If you remix, transform, or build upon the material, you must
 *     distribute your contributions under the same license as the original.
 */

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
