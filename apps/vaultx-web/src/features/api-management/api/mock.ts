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

import type {
  ApiToken,
  ApiUsageStats,
  CreateTokenRequest,
} from '@vaultx/shared';
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
const mockTokens: ApiToken[] = [
  {
    id: 'token_1',
    name: 'Production API Token',
    token: 'vx_live_pk_1mcd4f8e9b2a3c7d6e8f9a0b1c2d3e4f',
    createdAt: '2024-12-20T10:00:00Z',
    lastUsedAt: '2024-12-24T15:30:00Z',
    expiresAt: '2025-12-20T10:00:00Z',
    isActive: true,
    permissions: ['secrets:read', 'secrets:create', 'secrets:update'],
    usage: {
      requestsToday: 12,
      requestsThisMonth: 145,
      lastRequest: '2024-12-24T15:30:00Z',
    },
  },
  {
    id: 'token_2',
    name: 'Development Token',
    token: 'vx_test_pk_9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k',
    createdAt: '2024-12-15T14:20:00Z',
    lastUsedAt: '2024-12-23T09:15:00Z',
    expiresAt: '2025-06-15T14:20:00Z',
    isActive: true,
    permissions: ['secrets:read'],
    usage: {
      requestsToday: 3,
      requestsThisMonth: 87,
      lastRequest: '2024-12-23T09:15:00Z',
    },
  },
  {
    id: 'token_3',
    name: 'Legacy Integration Token',
    token: 'vx_live_pk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    createdAt: '2024-10-01T08:00:00Z',
    lastUsedAt: '2024-11-30T16:45:00Z',
    expiresAt: '2024-12-01T08:00:00Z',
    isActive: false,
    permissions: ['secrets:read', 'secrets:create'],
    usage: {
      requestsToday: 0,
      requestsThisMonth: 0,
      lastRequest: '2024-11-30T16:45:00Z',
    },
  },
];

// Mock API service for API Management
export const getApiTokens = async (): Promise<ApiResponse<ApiToken[]>> => {
  await simulateDelay(600);

  return createSuccessResponse(mockTokens, 'API tokens retrieved successfully');
};

export const getApiToken = async (
  id: string
): Promise<ApiResponse<ApiToken | null>> => {
  await simulateDelay(400);

  const token = mockTokens.find(t => t.id === id);

  if (!token) {
    return createErrorResponse('API token not found', 404);
  }

  return createSuccessResponse(token, 'API token retrieved successfully');
};

export const createApiToken = async (
  data: CreateTokenRequest
): Promise<ApiResponse<ApiToken>> => {
  await simulateDelay(1000);

  // Validate name
  if (mockTokens.some(t => t.name === data.name)) {
    return createErrorResponse('Token name already exists', 409, [
      {
        field: 'name',
        message: 'A token with this name already exists',
        code: 'DUPLICATE_NAME',
      },
    ]);
  }

  const newToken: ApiToken = {
    id: `token_${Date.now()}`,
    name: data.name,
    token: `vx_${data.environment || 'live'}_pk_${Math.random()
      .toString(36)
      .substr(2, 32)}`,
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    expiresAt: data.expiresAt || null,
    isActive: true,
    permissions: data.permissions || ['secrets:read'],
    usage: {
      requestsToday: 0,
      requestsThisMonth: 0,
      lastRequest: null,
    },
  };

  mockTokens.unshift(newToken);
  return createSuccessResponse(newToken, 'API token created successfully', 201);
};

export const updateApiToken = async (
  id: string,
  data: Partial<ApiToken>
): Promise<ApiResponse<ApiToken | null>> => {
  await simulateDelay(800);

  const tokenIndex = mockTokens.findIndex(t => t.id === id);
  if (tokenIndex === -1) {
    return createErrorResponse('API token not found', 404);
  }

  const updatedToken = {
    ...mockTokens[tokenIndex],
    ...data,
    id, // Prevent ID from being changed
    token: mockTokens[tokenIndex].token, // Prevent token from being changed
  };

  mockTokens[tokenIndex] = updatedToken;
  return createSuccessResponse(updatedToken, 'API token updated successfully');
};

export const deleteApiToken = async (
  id: string
): Promise<ApiResponse<boolean>> => {
  await simulateDelay(600);

  const tokenIndex = mockTokens.findIndex(t => t.id === id);
  if (tokenIndex === -1) {
    return createErrorResponse('API token not found', 404);
  }

  mockTokens.splice(tokenIndex, 1);
  return createSuccessResponse(true, 'API token deleted successfully');
};

export const getApiUsage = async (
  _period?: string
): Promise<ApiResponse<ApiUsageStats>> => {
  await simulateDelay(500);

  const stats: ApiUsageStats = {
    requestsThisMonth: 232,
    requestLimit: 1000,
    dailyQuota: 50,
    usagePercentage: 23.2,
    remainingRequests: 768,
    resetDate: '2025-01-01T00:00:00Z',
    usageBreakdown: [
      { action: 'Get Secrets', count: 125, percentage: 53.9 },
      { action: 'Create Secrets', count: 67, percentage: 28.9 },
      { action: 'Update Secrets', count: 25, percentage: 10.8 },
      { action: 'Delete Secrets', count: 15, percentage: 6.4 },
    ],
    dailyUsage: [
      { date: '2024-12-19', requests: 18 },
      { date: '2024-12-20', requests: 24 },
      { date: '2024-12-21', requests: 31 },
      { date: '2024-12-22', requests: 19 },
      { date: '2024-12-23', requests: 28 },
      { date: '2024-12-24', requests: 15 },
      { date: '2024-12-25', requests: 12 },
    ],
  };

  return createSuccessResponse(
    stats,
    'API usage statistics retrieved successfully'
  );
};

export const regenerateApiToken = async (
  id: string
): Promise<ApiResponse<ApiToken | null>> => {
  await simulateDelay(1200);

  const tokenIndex = mockTokens.findIndex(t => t.id === id);
  if (tokenIndex === -1) {
    return createErrorResponse('API token not found', 404);
  }

  // Generate new token
  const token = mockTokens[tokenIndex];
  const newTokenString = `vx_${
    token.token.includes('test') ? 'test' : 'live'
  }_pk_${Math.random().toString(36).substr(2, 32)}`;

  const updatedToken = {
    ...token,
    token: newTokenString,
    lastUsedAt: null, // Reset usage
    usage: {
      requestsToday: 0,
      requestsThisMonth: 0,
      lastRequest: null,
    },
  };

  mockTokens[tokenIndex] = updatedToken;
  return createSuccessResponse(
    updatedToken,
    'API token regenerated successfully'
  );
};
