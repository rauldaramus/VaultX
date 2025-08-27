/**
 * @file: use-dashboard-data.ts
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

'use client';

import type {
  DashboardStats,
  ActivityLog,
  SecurityRecommendation,
} from '@vaultx/shared';
import { useState, useEffect } from 'react';

import {
  getDashboardStats,
  getRecentActivity,
  getSecurityRecommendations,
} from '../api/mock';

interface DashboardData {
  stats: DashboardStats | null;
  activity: ActivityLog[];
  recommendations: SecurityRecommendation[];
  loading: boolean;
  error: string | null;
}

export const useDashboardData = (): DashboardData => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [recommendations, setRecommendations] = useState<
    SecurityRecommendation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [statsResponse, activityResponse, recommendationsResponse] =
          await Promise.all([
            getDashboardStats(),
            getRecentActivity(),
            getSecurityRecommendations(),
          ]);

        // Handle stats response
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        } else {
          setError(statsResponse.error || 'Failed to fetch dashboard stats');
        }

        // Handle activity response
        if (activityResponse.success && activityResponse.data) {
          setActivity(activityResponse.data);
        } else {
          setError(activityResponse.error || 'Failed to fetch recent activity');
        }

        // Handle recommendations response
        if (recommendationsResponse.success && recommendationsResponse.data) {
          setRecommendations(recommendationsResponse.data);
        } else {
          setError(
            recommendationsResponse.error ||
              'Failed to fetch security recommendations'
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    stats,
    activity,
    recommendations,
    loading,
    error,
  };
};
