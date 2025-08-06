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
      {activity.map((activityItem, index) => {
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
