/**
 * @file: auth-guard.tsx
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

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect } from 'react';

import { useAuthValidation } from '../context/auth-validation.context';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { isValidating, isValid, validateSession } = useAuthValidation();

  useEffect(() => {
    // Wait for Zustand store to hydrate
    if (isLoading) {
      return;
    }

    // If not authenticated, redirect to login immediately
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // If authenticated but not validated yet, trigger validation
    if (isAuthenticated && !isValid && !isValidating) {
      validateSession();
      return;
    }

    // If validation failed (not valid and not validating anymore), redirect to login
    if (!isValid && !isValidating && isAuthenticated) {
      router.push('/login');
    }
  }, [
    isLoading,
    isAuthenticated,
    isValidating,
    isValid,
    router,
    validateSession,
  ]);

  // Wait for store to load
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Only render children if validated
  return isValid && isAuthenticated ? <>{children}</> : null;
}
