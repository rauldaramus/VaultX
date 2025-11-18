/**
 * @file: auth.model.ts
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

// Import shared API response types

// Authentication API Request Models
export interface LoginApiRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterApiRequest {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export interface RefreshTokenApiRequest {
  refreshToken: string;
}

export interface ResetPasswordApiRequest {
  email: string;
}

export interface ChangePasswordApiRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Authentication API Response Models
export interface LoginApiResponse {
  user: UserApiModel;
  tokens: TokensApiModel;
  expiresIn: number;
  sessionId: string;
}

export interface RegisterApiResponse {
  user: UserApiModel;
  tokens: TokensApiModel;
  message: string;
  sessionId?: string;
  expiresIn?: number;
  requiresVerification?: boolean;
  verificationToken?: string;
}

export interface RefreshTokenApiResponse {
  tokens: TokensApiModel;
  expiresIn: number;
}

export interface ResetPasswordApiResponse {
  message: string;
  resetToken?: string;
}

export interface ChangePasswordApiResponse {
  message: string;
  requiresReauth: boolean;
}

// User API Model
export interface UserApiModel {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  preferences: UserPreferencesApiModel;
}

// User Preferences API Model
export interface UserPreferencesApiModel {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    security: boolean;
  };
  twoFactorEnabled: boolean;
}

// Tokens API Model
export interface TokensApiModel {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  scope: string[];
}

// Session API Model
export interface SessionApiModel {
  id: string;
  userId: string;
  deviceInfo: DeviceInfoApiModel;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  isActive: boolean;
  isCurrent?: boolean;
}

// Device Info API Model
export interface DeviceInfoApiModel {
  browser: string;
  os: string;
  device: string;
  isMobile: boolean;
}

// User Role Enum for API
export type UserRole = 'admin' | 'user' | 'moderator';

// Authentication Status Enum for API
export type AuthStatusApi =
  | 'authenticated'
  | 'unauthenticated'
  | 'pending'
  | 'expired'
  | 'locked';

// API Error Model
export interface AuthApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  path: string;
}

// Validation Error Model
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// API Response with Validation Errors
// Re-export ValidationApiResponse from shared types for convenience
export type { ValidationApiResponse } from '@vaultx/shared';
