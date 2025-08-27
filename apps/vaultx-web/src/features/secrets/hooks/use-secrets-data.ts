/**
 * @file: use-secrets-data.ts
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
import type { Secret } from '@vaultx/shared';
import { useState, useEffect, useCallback } from 'react';

import { getSecrets, getSecretStats, getAllTags } from '../api/mock';

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
