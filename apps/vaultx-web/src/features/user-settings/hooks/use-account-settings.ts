/**
 * @file: use-account-settings.ts
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
import type { AccountInfo } from '@vaultx/shared';
import { useState, useEffect, useCallback } from 'react';

import {
  getAccountInfo,
  updateAccountInfo,
  changePassword,
  deleteAccount,
} from '../api/mock';

interface AccountSettingsData {
  accountInfo: AccountInfo | null;
  loading: boolean;
  error: string | null;
  updateAccount: (info: Partial<AccountInfo>) => Promise<boolean>;
  updatePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<boolean>;
  deleteUserAccount: (data: {
    password: string;
    confirmation: string;
  }) => Promise<boolean>;
}

export const useAccountSettingsData = (): AccountSettingsData => {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAccountInfo();

      if (response.success && response.data) {
        setAccountInfo(response.data);
      } else {
        setError(response.error || 'Failed to fetch account information');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAccount = useCallback(
    async (info: Partial<AccountInfo>): Promise<boolean> => {
      try {
        setError(null);

        const response = await updateAccountInfo(info);

        if (response.success && response.data) {
          setAccountInfo(response.data);
          return true;
        } else {
          setError(response.error || 'Failed to update account information');
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

  const updatePassword = useCallback(
    async (data: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }): Promise<boolean> => {
      try {
        setError(null);

        const response = await changePassword(data);

        if (response.success) {
          return true;
        } else {
          setError(response.error || 'Failed to change password');
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

  const deleteUserAccount = useCallback(
    async (data: {
      password: string;
      confirmation: string;
    }): Promise<boolean> => {
      try {
        setError(null);

        const response = await deleteAccount(data);

        if (response.success) {
          return true;
        } else {
          setError(response.error || 'Failed to delete account');
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
    fetchAccountInfo();
  }, [fetchAccountInfo]);

  return {
    accountInfo,
    loading,
    error,
    updateAccount,
    updatePassword,
    deleteUserAccount,
  };
};
