/**
 * @file: useAuth.ts
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

import type { LoginCredentials } from '@vaultx/shared';
import { useEffect } from 'react';

import type {
  LoginApiRequest,
  RegisterApiRequest,
} from '../api/models/auth.model';
import { authService } from '../api/services/auth.service';
import { useAuthStore } from '../model/auth.store';
import { APP_CONFIG } from '@/shared/config';

const ACCESS_TOKEN_KEY = APP_CONFIG.auth.tokenKey;
const REFRESH_TOKEN_KEY = APP_CONFIG.auth.refreshTokenKey;
const LEGACY_ACCESS_TOKEN_KEY = 'token';
const LEGACY_REFRESH_TOKEN_KEY = 'refresh_token';
const REMEMBER_ME_KEY = 'auth-remember-me';

const getStorage = () => {
  const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  return rememberMe ? localStorage : sessionStorage;
};

const readAccessToken = () => {
  const storage = getStorage();
  return (
    storage.getItem(ACCESS_TOKEN_KEY) ??
    storage.getItem(LEGACY_ACCESS_TOKEN_KEY) ??
    localStorage.getItem(ACCESS_TOKEN_KEY) ??
    localStorage.getItem(LEGACY_ACCESS_TOKEN_KEY)
  );
};

const storeRefreshToken = (token: string, rememberMe = false) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(REFRESH_TOKEN_KEY, token);
  if (REFRESH_TOKEN_KEY !== LEGACY_REFRESH_TOKEN_KEY) {
    storage.setItem(LEGACY_REFRESH_TOKEN_KEY, token);
  }
};

const readRefreshToken = () => {
  const storage = getStorage();
  return (
    storage.getItem(REFRESH_TOKEN_KEY) ??
    storage.getItem(LEGACY_REFRESH_TOKEN_KEY) ??
    localStorage.getItem(REFRESH_TOKEN_KEY) ??
    localStorage.getItem(LEGACY_REFRESH_TOKEN_KEY)
  );
};

const clearRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  if (REFRESH_TOKEN_KEY !== LEGACY_REFRESH_TOKEN_KEY) {
    localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
  }
};

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, logout, setLoading } =
    useAuthStore();

  // Check authentication status on load
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = readAccessToken();
      const storedUser = localStorage.getItem('auth-storage');

      if (token && storedUser) {
        try {
          const parsedStorage = JSON.parse(storedUser);
          if (
            parsedStorage.state?.user &&
            parsedStorage.state?.isAuthenticated
          ) {
            // User is already authenticated according to persisted store
            setLoading(false);
            return;
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error parsing stored auth data:', error);
        }
      }

      // No valid authentication
      setLoading(false);
    };

    checkAuthStatus();
  }, [setLoading]);

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const loginRequest: LoginApiRequest = {
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe ?? false,
      };

      const response = await authService.login(loginRequest);

      if (response.success && response.data) {
        storeRefreshToken(
          response.data.tokens.refreshToken,
          credentials.rememberMe
        );
        login(
          response.data.user,
          response.data.tokens.accessToken,
          credentials.rememberMe
        );
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData: RegisterApiRequest) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);

      if (response.success && response.data) {
        storeRefreshToken(response.data.tokens.refreshToken);
        login(response.data.user, response.data.tokens.accessToken);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || 'Registration failed',
          validationErrors: response.validationErrors,
        };
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Registration error:', error);
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      clearRefreshToken();
      logout();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = readRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
      const response = await authService.refreshToken({ refreshToken });

      if (response.success && response.data) {
        if (user) {
          login(user, response.data.tokens.accessToken, rememberMe);
        } else {
          const storage = getStorage();
          storage.setItem(ACCESS_TOKEN_KEY, response.data.tokens.accessToken);
          if (ACCESS_TOKEN_KEY !== LEGACY_ACCESS_TOKEN_KEY) {
            storage.setItem(
              LEGACY_ACCESS_TOKEN_KEY,
              response.data.tokens.accessToken
            );
          }
        }
        storeRefreshToken(response.data.tokens.refreshToken, rememberMe);
        return true;
      }
      return false;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Token refresh error:', error);
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshToken,
  };
}
