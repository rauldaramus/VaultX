/**
 * @file: auth.store.ts
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

import type { AuthState, User } from '@vaultx/shared';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { APP_CONFIG } from '@/shared/config';

const ACCESS_TOKEN_KEY = APP_CONFIG.auth.tokenKey;
const LEGACY_ACCESS_TOKEN_KEY = 'token';
const REMEMBER_ME_KEY = 'auth-remember-me';

const storeAccessToken = (token: string, rememberMe = false) => {
  if (typeof window === 'undefined') {
    return;
  }

  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(ACCESS_TOKEN_KEY, token);
  if (ACCESS_TOKEN_KEY !== LEGACY_ACCESS_TOKEN_KEY) {
    storage.setItem(LEGACY_ACCESS_TOKEN_KEY, token);
  }

  // Store the rememberMe preference
  localStorage.setItem(REMEMBER_ME_KEY, String(rememberMe));
};

const removeAccessToken = () => {
  if (typeof window === 'undefined') {
    return;
  }

  // Remove from both storages to be safe
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  if (ACCESS_TOKEN_KEY !== LEGACY_ACCESS_TOKEN_KEY) {
    localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  }
  localStorage.removeItem(REMEMBER_ME_KEY);
  // Clear session validation flag
  sessionStorage.removeItem('auth-session-validated');
};

interface AuthStore extends AuthState {
  login: (user: User, token: string, rememberMe?: boolean) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user: User, token: string, rememberMe = false) => {
        storeAccessToken(token, rememberMe);
        set({ user, isAuthenticated: true, isLoading: false });
      },
      logout: () => {
        removeAccessToken();
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
      setLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      storage: {
        getItem: name => {
          // Check rememberMe preference to decide which storage to use
          const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
          const storage = rememberMe ? localStorage : sessionStorage;
          const value = storage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          // Always use localStorage for auth state persistence
          // Token storage is handled separately in storeAccessToken
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: name => {
          localStorage.removeItem(name);
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
