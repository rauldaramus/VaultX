/**
 * @file: SimpleTimeline.tsx
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

import { LockKeyhole, Eye, Clock } from 'lucide-react';

import { useDashboardData } from '../hooks/use-dashboard-data';

export function SimpleTimeline() {
  const { activity, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="space-y-4 mt-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-muted animate-pulse rounded mb-1" />
              <div className="h-3 bg-muted animate-pulse rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'LockKeyhole':
        return LockKeyhole;
      case 'Eye':
        return Eye;
      case 'Clock':
        return Clock;
      default:
        return LockKeyhole;
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {activity.map((activityItem, _index) => {
        const IconComponent = getIcon(activityItem.icon);
        return (
          <div key={activityItem.id} className="flex items-start gap-3">
            <div className="rounded-full p-2 mt-0.5 bg-muted">
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">{activityItem.action}</p>
              <p className="text-xs text-muted-foreground">
                {activityItem.timestamp}
              </p>
              {activityItem.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {activityItem.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
