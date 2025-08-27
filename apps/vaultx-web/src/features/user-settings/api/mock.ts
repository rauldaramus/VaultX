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

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ApiResponse<{ message: string }>> => {
  await simulateDelay(1000);

  // Validate current password (mock validation)
  if (data.currentPassword !== 'password123') {
    return createErrorResponse('Current password is incorrect', 400, [
      {
        field: 'currentPassword',
        message: 'Current password is incorrect',
        code: 'INVALID_PASSWORD',
      },
    ]);
  }

  // Validate new password match
  if (data.newPassword !== data.confirmPassword) {
    return createErrorResponse('Passwords do not match', 400, [
      {
        field: 'confirmPassword',
        message: 'Passwords do not match',
        code: 'PASSWORD_MISMATCH',
      },
    ]);
  }

  // Validate password strength
  if (data.newPassword.length < 8) {
    return createErrorResponse('Password too weak', 400, [
      {
        field: 'newPassword',
        message: 'Password must be at least 8 characters long',
        code: 'WEAK_PASSWORD',
      },
    ]);
  }

  // Update password last changed date
  mockSecuritySettings.passwordLastChanged = new Date().toISOString();

  return createSuccessResponse(
    { message: 'Password changed successfully' },
    'Password changed successfully'
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
  ApiResponse<Array<Record<string, unknown>>>
> => {
  await simulateDelay(500);

  const sessions = [
    {
      id: 'session_1',
      device: 'Chrome - Windows',
      location: 'Madrid, Spain',
      ipAddress: '192.168.1.100',
      lastActive: '2 minutes ago',
      current: true,
      createdAt: '2024-12-25T14:20:00Z',
    },
    {
      id: 'session_2',
      device: 'Safari - iPhone',
      location: 'Barcelona, Spain',
      ipAddress: '10.0.0.50',
      lastActive: '1 hour ago',
      current: false,
      createdAt: '2024-12-24T09:15:00Z',
    },
    {
      id: 'session_3',
      device: 'Firefox - macOS',
      location: 'Valencia, Spain',
      ipAddress: '203.0.113.45',
      lastActive: '2 days ago',
      current: false,
      createdAt: '2024-12-23T10:00:00Z',
    },
  ];

  return createSuccessResponse(
    sessions,
    'Active sessions retrieved successfully'
  );
};

export const revokeSession = async (
  sessionId: string
): Promise<ApiResponse<{ message: string }>> => {
  await simulateDelay(600);

  if (sessionId === 'session_1') {
    return createErrorResponse('Cannot revoke current session', 400, [
      {
        field: 'sessionId',
        message: 'You cannot revoke your current session',
        code: 'CURRENT_SESSION',
      },
    ]);
  }

  return createSuccessResponse(
    { message: 'Session revoked successfully' },
    'Session revoked successfully'
  );
};
