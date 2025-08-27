/**
 * @file: use-security-settings.ts
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
import type { SecuritySettings } from '@vaultx/shared';
import { useState, useEffect, useCallback } from 'react';

import { getSecuritySettings, updateSecuritySettings } from '../api/mock';

interface SecuritySettingsData {
  settings: SecuritySettings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (newSettings: Partial<SecuritySettings>) => Promise<boolean>;
}

// Complete hook for Security Settings
export const useSecuritySettingsData = (): SecuritySettingsData => {
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getSecuritySettings();

      if (response.success && response.data) {
        setSettings(response.data);
      } else {
        setError(response.error || 'Failed to fetch security settings');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(
    async (newSettings: Partial<SecuritySettings>): Promise<boolean> => {
      try {
        setError(null);

        const response = await updateSecuritySettings(newSettings);

        if (response.success && response.data) {
          setSettings(response.data);
          return true;
        } else {
          setError(response.error || 'Failed to update security settings');
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
        return false;
      }
    },
    []
  );

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
  };
};
