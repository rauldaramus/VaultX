/**
 * @file: mock.ts
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

import type { AccountInfo, SecuritySettings } from '@vaultx/shared';
import {
  createSuccessResponse,
  createErrorResponse,
  type ApiResponse,
} from '@vaultx/shared';
import { authService } from '@/features/auth/api/services/auth.service';
import type {
  ChangePasswordApiRequest,
  SessionApiModel,
} from '@/features/auth/api/models/auth.model';

// Simulate API delay
const simulateDelay = (ms = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock data storage
let mockAccountInfo: AccountInfo = {
  name: 'Test User',
  email: 'test@example.com',
  avatar: 'https://avatar.vercel.sh/test@example.com',
  bio: 'Software developer passionate about security and privacy.',
  location: 'Madrid, Spain',
  website: 'https://example.com',
  joinedAt: '2024-01-15T10:30:00Z',
  emailVerified: true,
  plan: {
    name: 'On-Premise',
    features: [
      'Unlimited secrets',
      'Advanced security features',
      'API access',
      'Custom integrations',
    ],
  },
};

let mockSecuritySettings: SecuritySettings = {
  enableScreenshotProtection: false,
  isTwoFactorEnabled: false,
  passwordLastChanged: '2024-11-20T14:30:00Z',
  loginNotifications: true,
  securityAlerts: true,
  allowedIPs: [],
  sessionTimeout: 3600, // 1 hour in seconds
  requirePasswordFor: {
    viewSecrets: false,
    editProfile: true,
    deleteAccount: true,
  },
};

// Mock API service for User Settings (Account + Security)

// Account Settings
export const getAccountInfo = async (): Promise<ApiResponse<AccountInfo>> => {
  await simulateDelay(400);

  return createSuccessResponse(
    mockAccountInfo,
    'Account information retrieved successfully'
  );
};

export const updateAccountInfo = async (
  info: Partial<AccountInfo>
): Promise<ApiResponse<AccountInfo>> => {
  await simulateDelay(800);

  // Validate email format if provided
  if (info.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
    return createErrorResponse('Invalid email format', 400, [
      {
        field: 'email',
        message: 'Please enter a valid email address',
        code: 'INVALID_EMAIL',
      },
    ]);
  }

  // Check if email is already taken (mock check)
  if (
    info.email &&
    info.email !== mockAccountInfo.email &&
    info.email === 'taken@example.com'
  ) {
    return createErrorResponse('Email already in use', 409, [
      {
        field: 'email',
        message: 'This email address is already in use',
        code: 'EMAIL_TAKEN',
      },
    ]);
  }

  mockAccountInfo = { ...mockAccountInfo, ...info };
  return createSuccessResponse(
    mockAccountInfo,
    'Account information updated successfully'
  );
};

export const changePassword = async (
  data: ChangePasswordApiRequest
): Promise<ApiResponse<{ message: string; requiresReauth: boolean }>> => {
  const response = await authService.changePassword(data);

  if (response.success && response.data) {
    mockSecuritySettings.passwordLastChanged = new Date().toISOString();
    return createSuccessResponse(
      response.data,
      response.data.message ?? 'Password changed successfully'
    );
  }

  return createErrorResponse(
    response.error ?? 'Failed to change password',
    response.statusCode,
    response.validationErrors
  );
};

export const deleteAccount = async (data: {
  password: string;
  confirmation: string;
}): Promise<ApiResponse<{ message: string }>> => {
  await simulateDelay(1500);

  // Validate password
  if (data.password !== 'password123') {
    return createErrorResponse('Password is incorrect', 400, [
      {
        field: 'password',
        message: 'Password is incorrect',
        code: 'INVALID_PASSWORD',
      },
    ]);
  }

  // Validate confirmation
  if (data.confirmation !== 'DELETE') {
    return createErrorResponse('Confirmation text is incorrect', 400, [
      {
        field: 'confirmation',
        message: 'Please type DELETE to confirm',
        code: 'INVALID_CONFIRMATION',
      },
    ]);
  }

  return createSuccessResponse(
    {
      message:
        'Account deletion initiated. You will receive a confirmation email.',
    },
    'Account deletion initiated successfully'
  );
};

// Security Settings
export const getSecuritySettings = async (): Promise<
  ApiResponse<SecuritySettings>
> => {
  await simulateDelay(400);

  return createSuccessResponse(
    mockSecuritySettings,
    'Security settings retrieved successfully'
  );
};

export const updateSecuritySettings = async (
  settings: Partial<SecuritySettings>
): Promise<ApiResponse<SecuritySettings>> => {
  await simulateDelay(800);

  mockSecuritySettings = { ...mockSecuritySettings, ...settings };
  return createSuccessResponse(
    mockSecuritySettings,
    'Security settings updated successfully'
  );
};

// Active Sessions Mock (this will be moved to auth service)
export const getActiveSessions = async (): Promise<
  ApiResponse<SessionApiModel[]>
> => authService.getUserSessions();

export const revokeSession = (
  sessionId: string
): Promise<ApiResponse<{ message?: string }>> =>
  authService.revokeSession(sessionId);
