/**
 * @file: dashboard.types.ts
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

export interface DashboardStats {
  secretsCreated: number;
  secretsViewed: number;
  activeSecrets: number;
  plan: string;
  trends: {
    secretsCreatedChange: number;
    secretsViewedChange: number;
    activeSecretsChange: number;
  };
  chartData: {
    secretActivity: Array<{ day: string; secrets: number }>;
    statusDistribution: Array<{
      status: string;
      count: number;
      percentage: number;
    }>;
  };
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  type: 'create' | 'view' | 'expire' | 'update' | 'delete';
  icon: string;
}

export interface SecurityRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'security' | 'secrets' | 'review';
  priority: 'high' | 'medium' | 'low';
  action: {
    label: string;
    href: string;
  };
  icon: string;
  // Legacy fields for backward compatibility
  actionText?: string;
}
