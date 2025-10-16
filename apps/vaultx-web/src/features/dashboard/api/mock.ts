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
  DashboardStats,
  ActivityLog,
  SecurityRecommendation,
} from '@vaultx/shared';
import { createSuccessResponse, type ApiResponse } from '@vaultx/shared';

// Simulate API delay
const simulateDelay = (ms = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock API service for Dashboard Overview
export const getDashboardStats = async (): Promise<
  ApiResponse<DashboardStats>
> => {
  await simulateDelay(600);

  const stats: DashboardStats = {
    secretsCreated: 12,
    secretsViewed: 9,
    activeSecrets: 3,
    plan: 'On-Premise',
    trends: {
      secretsCreatedChange: 8,
      secretsViewedChange: 12,
      activeSecretsChange: -5,
    },
    chartData: {
      secretActivity: [
        { day: 'Mon', secrets: 12 },
        { day: 'Tue', secrets: 8 },
        { day: 'Wed', secrets: 15 },
        { day: 'Thu', secrets: 6 },
        { day: 'Fri', secrets: 10 },
        { day: 'Sat', secrets: 11 },
        { day: 'Sun', secrets: 14 },
      ],
      statusDistribution: [
        { status: 'Active', count: 45, percentage: 45 },
        { status: 'Viewed', count: 30, percentage: 30 },
        { status: 'Expired', count: 25, percentage: 25 },
      ],
    },
  };

  return createSuccessResponse(
    stats,
    'Dashboard statistics retrieved successfully'
  );
};

export const getRecentActivity = async (): Promise<
  ApiResponse<ActivityLog[]>
> => {
  await simulateDelay(400);

  const activities: ActivityLog[] = [
    {
      id: '1',
      action: 'Secret created',
      description: 'API Key for Production Database',
      timestamp: 'Today, 10:30',
      type: 'create',
      icon: 'LockKeyhole',
    },
    {
      id: '2',
      action: 'Secret viewed',
      description: 'JWT Secret for Authentication',
      timestamp: 'Yesterday, 3:45 PM',
      type: 'view',
      icon: 'Eye',
    },
    {
      id: '3',
      action: 'Secret expired',
      description: 'Temporary API Token',
      timestamp: '2 days ago',
      type: 'expire',
      icon: 'Clock',
    },
    {
      id: '4',
      action: 'Secret created',
      description: 'Database Connection String',
      timestamp: '3 days ago',
      type: 'create',
      icon: 'LockKeyhole',
    },
    {
      id: '5',
      action: 'Secret viewed',
      description: 'OAuth Client Secret',
      timestamp: '5 days ago',
      type: 'view',
      icon: 'Eye',
    },
  ];

  return createSuccessResponse(
    activities,
    'Recent activity retrieved successfully'
  );
};

export const getSecurityRecommendations = async (): Promise<
  ApiResponse<SecurityRecommendation[]>
> => {
  await simulateDelay(300);

  const recommendations: SecurityRecommendation[] = [
    {
      id: '1',
      title: 'Enable two-factor authentication',
      description: 'Add an extra layer of security to your account.',
      type: 'security',
      priority: 'high',
      action: {
        label: 'Configure now',
        href: '/security',
      },
      icon: 'Shield',
    },
    {
      id: '2',
      title: 'Use passwords on your secrets',
      description: 'Add an additional layer of protection.',
      type: 'secrets',
      priority: 'medium',
      action: {
        label: 'Create protected secret',
        href: '/create',
      },
      icon: 'LockKeyhole',
    },
    {
      id: '3',
      title: 'Review your active secrets',
      description: "You have 3 secrets that haven't been viewed yet.",
      type: 'review',
      priority: 'low',
      action: {
        label: 'View active secrets',
        href: '/secrets',
      },
      icon: 'Eye',
    },
  ];

  return createSuccessResponse(
    recommendations,
    'Security recommendations retrieved successfully'
  );
};
