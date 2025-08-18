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
