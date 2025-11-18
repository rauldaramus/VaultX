/**
 * @file: auth-validation.context.tsx
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

import type React from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { authService } from '../api/services/auth.service';
import { useAuth } from '../hooks/useAuth';

interface AuthValidationContextType {
  isValidating: boolean;
  isValid: boolean;
  validateSession: () => Promise<void>;
}

const AuthValidationContext = createContext<
  AuthValidationContextType | undefined
>(undefined);

const SESSION_VALIDATED_KEY = 'auth-session-validated';

export function AuthValidationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(() => {
    // Check if already validated on initial render
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(SESSION_VALIDATED_KEY) === 'true';
    }
    return false;
  });
  const hasValidatedRef = useRef(false);

  const validateSession = async () => {
    // Wait for Zustand store to hydrate from localStorage
    if (isLoading) {
      return;
    }

    // If not authenticated in local state, no need to validate
    if (!isAuthenticated) {
      setIsValidating(false);
      setIsValid(false);
      hasValidatedRef.current = false;
      return;
    }

    // Prevent multiple validations
    if (hasValidatedRef.current) {
      return;
    }

    // Check if we already validated in this session
    const alreadyValidated = sessionStorage.getItem(SESSION_VALIDATED_KEY);
    if (alreadyValidated === 'true') {
      setIsValid(true);
      setIsValidating(false);
      hasValidatedRef.current = true;
      return;
    }

    hasValidatedRef.current = true;
    setIsValidating(true);

    try {
      // Validate with backend
      const response = await authService.getCurrentUser();

      if (response.success && response.data) {
        // Token is valid, mark as validated for this session
        sessionStorage.setItem(SESSION_VALIDATED_KEY, 'true');
        setIsValid(true);
        setIsValidating(false);
      } else {
        // Token is invalid, clear auth
        sessionStorage.removeItem(SESSION_VALIDATED_KEY);
        logout();
        setIsValid(false);
        setIsValidating(false);
      }
    } catch {
      // Network error or server down, clear auth
      sessionStorage.removeItem(SESSION_VALIDATED_KEY);
      logout();
      setIsValid(false);
      setIsValidating(false);
    }
  };

  // Reset validation state when authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      setIsValid(false);
      setIsValidating(false);
      hasValidatedRef.current = false;
      sessionStorage.removeItem(SESSION_VALIDATED_KEY);
    }
  }, [isAuthenticated]);

  return (
    <AuthValidationContext.Provider
      value={{ isValidating, isValid, validateSession }}
    >
      {children}
    </AuthValidationContext.Provider>
  );
}

export function useAuthValidation() {
  const context = useContext(AuthValidationContext);
  if (context === undefined) {
    throw new Error(
      'useAuthValidation must be used within AuthValidationProvider'
    );
  }
  return context;
}
