/**
 * @file: errors.ts
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

/**
 * Standardized error codes for authentication operations
 * Aligned with OpenAPI contract v0.1.1
 */
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'EMAIL_ALREADY_EXISTS'
  | 'EMAIL_NOT_VERIFIED'
  | 'ACCOUNT_LOCKED'
  | 'RATE_LIMITED'
  | 'INVALID_TOKEN'
  | 'INVALID_VERIFICATION_TOKEN'
  | 'INVALID_RESET_TOKEN'
  | 'INVALID_OAUTH_CALLBACK'
  | 'SESSION_EXPIRED'
  | 'SESSION_NOT_FOUND'
  | 'TWO_FACTOR_REQUIRED'
  | 'SERVER_ERROR';

// Re-export ValidationError from api.ts to avoid duplication
import type { ValidationError } from '../api';

/**
 * Error response structure
 */
export interface ErrorResponse {
  success: false;
  error: string;
  errorCode?: AuthErrorCode;
  statusCode: number;
  validationErrors?: ValidationError[];
  timestamp?: string;
  requestId?: string;
}
