/**
 * @file: api-management.types.ts
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

// Types for API Management feature
export interface ApiToken {
  id: string;
  name: string; // "Main Token" or custom name
  token: string; // Partially hidden for UI
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  environment: 'production' | 'staging' | 'development' | 'test'; // Environment this token is intended for
  permissions: string[];
  usage: {
    requestsToday: number;
    requestsThisMonth: number;
    lastRequest: string | null;
  };
}

export interface ApiUsageStats {
  requestsThisMonth: number;
  requestLimit: number;
  dailyQuota?: number; // Para planes demo
  usagePercentage: number;
  remainingRequests: number;
  resetDate: string;
  usageBreakdown: Array<{ action: string; count: number; percentage: number }>;
  dailyUsage: Array<{ date: string; requests: number }>;
}

export interface CreateTokenRequest {
  name: string;
  permissions?: string[];
  expiresAt?: string | null;
  environment?: string;
}
