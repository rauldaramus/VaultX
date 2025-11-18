/**
 * @file: use-password-reset.ts
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

import type { ValidationError } from '@vaultx/shared';
import { useCallback, useState } from 'react';

import type { ResetPasswordApiRequest } from '../api/models/auth.model';
import { authService } from '../api/services/auth.service';

interface PasswordResetResult {
  success: boolean;
  message?: string;
  error?: string;
  validationErrors?: ValidationError[];
}

export function usePasswordReset() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const requestReset = useCallback(
    async (payload: ResetPasswordApiRequest): Promise<PasswordResetResult> => {
      setIsSubmitting(true);
      setHasRequested(false);

      try {
        const response = await authService.resetPassword(payload);

        if (response.success) {
          setHasRequested(true);
          return {
            success: true,
            message:
              response.data?.message ??
              'If that email is registered, you will receive reset instructions shortly.',
          };
        }

        return {
          success: false,
          error: response.error ?? 'Unable to process your request.',
          validationErrors: response.validationErrors,
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Password reset error:', error);
        return { success: false, error: 'Network error' };
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const confirmReset = useCallback(
    async (payload: {
      token: string;
      newPassword: string;
      confirmPassword: string;
    }): Promise<PasswordResetResult> => {
      setIsSubmitting(true);

      try {
        const response = await authService.confirmPasswordReset(payload);

        if (response.success) {
          return {
            success: true,
            message:
              response.data?.message ?? 'Your password has been updated.',
          };
        }

        return {
          success: false,
          error: response.error ?? 'Unable to update password.',
          validationErrors: response.validationErrors,
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Confirm reset error:', error);
        return { success: false, error: 'Network error' };
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  return {
    requestReset,
    confirmReset,
    isSubmitting,
    hasRequested,
  };
}
