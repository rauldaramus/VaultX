'use client';
import { useState, useEffect, useCallback } from 'react';
import { getSecrets, getSecretStats, getAllTags } from '../api/mock';
import type { Secret } from '@vaultx/shared';

interface SecretsFilters {
  status?: string;
  tags?: string[];
  search?: string;
}

interface SecretsStats {
  total: number;
  active: number;
  expired: number;
  viewed: number;
  protected: number;
}

interface SecretsData {
  secrets: Secret[];
  stats: SecretsStats | null;
  availableTags: string[];
  loading: boolean;
  error: string | null;
  refetch: (filters?: SecretsFilters) => Promise<void>;
}

export const useSecretsData = (
  initialFilters?: SecretsFilters
): SecretsData => {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [stats, setStats] = useState<SecretsStats | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSecrets = useCallback(async (filters?: SecretsFilters) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [secretsResponse, statsResponse, tagsResponse] = await Promise.all([
        getSecrets(filters),
        getSecretStats(),
        getAllTags(),
      ]);

      // Handle secrets response
      if (secretsResponse.success && secretsResponse.data) {
        setSecrets(secretsResponse.data);
      } else {
        setError(secretsResponse.error || 'Failed to fetch secrets');
      }

      // Handle stats response
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      } else {
        setError(statsResponse.error || 'Failed to fetch secret statistics');
      }

      // Handle tags response
      if (tagsResponse.success && tagsResponse.data) {
        setAvailableTags(tagsResponse.data);
      } else {
        setError(tagsResponse.error || 'Failed to fetch tags');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSecrets(initialFilters);
  }, [fetchSecrets, initialFilters]);

  return {
    secrets,
    stats,
    availableTags,
    loading,
    error,
    refetch: fetchSecrets,
  };
};
