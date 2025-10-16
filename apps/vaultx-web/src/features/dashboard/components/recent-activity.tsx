/**
 * @file: recent-activity.tsx
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

import { Eye, PlusCircle, ShieldOff, LockKeyhole, Clock } from 'lucide-react';

import { useDashboardData } from '../hooks/use-dashboard-data';

import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

const iconMap = {
  create: LockKeyhole,
  view: Eye,
  expire: Clock,
  update: PlusCircle,
  delete: ShieldOff,
};

export function RecentActivity() {
  const { activity, loading } = useDashboardData();
  return (
    <Card className="bg-gray-900 border-gray-800 hover-lift animate-fade-in-up opacity-0 animate-stagger-3">
      <CardHeader className="transition-all duration-300 hover:bg-gray-800/30">
        <CardTitle className="transition-colors duration-200 hover:text-gray-200">
          Recent Activity
        </CardTitle>
        <p className="text-sm text-gray-400 transition-colors duration-200 hover:text-gray-300">
          Latest actions performed
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-2">
                <div className="w-9 h-9 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activity.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No recent activity
          </div>
        ) : (
          <div className="space-y-4">
            {activity.slice(0, 4).map((activityItem, index) => {
              const IconComponent =
                iconMap[activityItem.type as keyof typeof iconMap] ||
                LockKeyhole;
              return (
                <div
                  key={activityItem.id}
                  className="flex items-center gap-4 p-2 rounded-lg transition-all duration-300 hover:bg-gray-800/50 animate-fade-in-left opacity-0"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <div className="p-2 bg-gray-800 rounded-full transition-all duration-300 hover:bg-gray-700 hover:scale-110">
                    <IconComponent className="h-5 w-5 text-gray-400 transition-colors duration-200 hover:text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium transition-colors duration-200 hover:text-gray-200">
                      {activityItem.action}
                    </p>
                    <p className="text-sm text-gray-400 transition-colors duration-200 hover:text-gray-300">
                      {activityItem.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <Button
          variant="outline"
          className="w-full mt-6 bg-transparent border-gray-700 hover:bg-gray-800 text-gray-50 transition-all duration-300 hover:border-gray-600 hover:scale-105 hover-glow"
        >
          View all history
        </Button>
      </CardContent>
    </Card>
  );
}
