/**
 * @file: auth.service.ts
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

import type { ApiResponse } from '@vaultx/shared';
import type { AxiosRequestConfig } from 'axios';

import { APP_CONFIG } from '@/shared/config';
import { apiRequest } from '@/shared/lib/http-client';

import type {
  ChangePasswordApiRequest,
  ChangePasswordApiResponse,
  LoginApiRequest,
  LoginApiResponse,
  RefreshTokenApiRequest,
  RefreshTokenApiResponse,
  RegisterApiRequest,
  RegisterApiResponse,
  ResetPasswordApiRequest,
  ResetPasswordApiResponse,
  SessionApiModel,
  UserApiModel,
} from '../models/auth.model';

const AUTH_BASE_PATH = '/auth';

const readTokenFromStorage = (storage: Storage) => {
  return (
    storage.getItem(APP_CONFIG.auth.tokenKey) ??
    storage.getItem('token') ??
    null
  );
};

const resolveStoredToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  // Look in both storages because session-based logins keep tokens in sessionStorage
  return (
    readTokenFromStorage(localStorage) ?? readTokenFromStorage(sessionStorage)
  );
};

const withAuthHeader = (): Record<string, string> => {
  const token = resolveStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const buildRequest = async <T>(
  endpoint: string,
  config: AxiosRequestConfig,
  requiresAuth = false
): Promise<ApiResponse<T>> => {
  return apiRequest<T>({
    url: `${AUTH_BASE_PATH}${endpoint}`,
    ...config,
    headers: {
      ...(config.headers ?? {}),
      ...(requiresAuth ? withAuthHeader() : {}),
    },
  });
};

class AuthService {
  static login(
    credentials: LoginApiRequest
  ): Promise<ApiResponse<LoginApiResponse>> {
    return buildRequest<LoginApiResponse>('/login', {
      method: 'POST',
      data: credentials,
    });
  }

  static register(
    payload: RegisterApiRequest
  ): Promise<ApiResponse<RegisterApiResponse>> {
    return buildRequest<RegisterApiResponse>('/register', {
      method: 'POST',
      data: payload,
    });
  }

  static logout(): Promise<ApiResponse<{ message: string }>> {
    return buildRequest<{ message: string }>(
      '/logout',
      { method: 'POST' },
      true
    );
  }

  static refreshToken(
    payload: RefreshTokenApiRequest
  ): Promise<ApiResponse<RefreshTokenApiResponse>> {
    return buildRequest<RefreshTokenApiResponse>('/refresh', {
      method: 'POST',
      data: payload,
    });
  }

  static async getCurrentUser(): Promise<ApiResponse<UserApiModel>> {
    const response = await buildRequest<UserApiModel | { user: UserApiModel }>(
      '/me',
      { method: 'GET' },
      true
    );

    if (response.success && response.data) {
      const data =
        (response.data as { user?: UserApiModel }).user ??
        (response.data as UserApiModel);

      if (data) {
        return {
          ...response,
          data,
        };
      }
    }

    return response as ApiResponse<UserApiModel>;
  }

  static resetPassword(
    payload: ResetPasswordApiRequest
  ): Promise<ApiResponse<ResetPasswordApiResponse>> {
    return buildRequest<ResetPasswordApiResponse>('/reset-password/request', {
      method: 'POST',
      data: payload,
    });
  }

  static confirmPasswordReset(payload: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return buildRequest<{ message: string }>('/reset-password/confirm', {
      method: 'POST',
      data: payload,
    });
  }

  static changePassword(
    payload: ChangePasswordApiRequest
  ): Promise<ApiResponse<ChangePasswordApiResponse>> {
    return buildRequest<ChangePasswordApiResponse>(
      '/change-password',
      {
        method: 'POST',
        data: payload,
      },
      true
    );
  }

  static async getUserSessions(): Promise<ApiResponse<SessionApiModel[]>> {
    const response = await buildRequest<{ sessions: SessionApiModel[] }>(
      '/sessions',
      { method: 'GET' },
      true
    );

    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.sessions,
      };
    }

    return response as ApiResponse<SessionApiModel[]>;
  }

  static revokeSession(sessionId: string): Promise<ApiResponse> {
    return buildRequest(`/sessions/${sessionId}`, { method: 'DELETE' }, true);
  }

  static async updateProfile(
    updates: Partial<UserApiModel>
  ): Promise<ApiResponse<UserApiModel>> {
    const response = await buildRequest<{ user: UserApiModel }>(
      '/profile',
      {
        method: 'PATCH',
        data: updates,
      },
      true
    );

    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.user,
      };
    }

    return response as ApiResponse<UserApiModel>;
  }

  static verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return buildRequest<{ message: string }>('/verify-email', {
      method: 'POST',
      data: { token },
    });
  }

  static resendVerification(
    email: string
  ): Promise<ApiResponse<{ verificationToken?: string }>> {
    return buildRequest<{ verificationToken?: string }>(
      '/verify-email/resend',
      {
        method: 'POST',
        data: { email },
      }
    );
  }
}

export const authService = {
  login: AuthService.login,
  register: AuthService.register,
  logout: AuthService.logout,
  refreshToken: AuthService.refreshToken,
  getCurrentUser: AuthService.getCurrentUser,
  resetPassword: AuthService.resetPassword,
  confirmPasswordReset: AuthService.confirmPasswordReset,
  changePassword: AuthService.changePassword,
  getUserSessions: AuthService.getUserSessions,
  revokeSession: AuthService.revokeSession,
  updateProfile: AuthService.updateProfile,
  verifyEmail: AuthService.verifyEmail,
  resendVerification: AuthService.resendVerification,
};

export default AuthService;
