'use client';

import { useAuthStore } from '../model/auth.store';
import { authService } from '../api/services/auth.service';
import type {
  LoginApiRequest,
  RegisterApiRequest,
} from '../api/models/auth.model';
import type { LoginCredentials } from '@vaultx/shared';
import { useEffect } from 'react';

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, logout, setLoading } =
    useAuthStore();

  // Check authentication status on load
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
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
        rememberMe: false,
      };

      const response = await authService.login(loginRequest);

      if (response.success && response.data) {
        login(response.data.user, response.data.tokens.accessToken);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
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
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return false;

      const response = await authService.refreshToken({ refreshToken });

      if (response.success && response.data) {
        localStorage.setItem('token', response.data.tokens.accessToken);
        localStorage.setItem(
          'refresh_token',
          response.data.tokens.refreshToken
        );
        return true;
      }
      return false;
    } catch (error) {
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
