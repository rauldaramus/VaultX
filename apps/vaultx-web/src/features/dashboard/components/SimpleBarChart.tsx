/**
 * @file: SimpleBarChart.tsx
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

import { useDashboardData } from '../hooks/use-dashboard-data';

export function SimpleBarChart() {
  const { stats, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-4 text-sm">
        {[...Array(7)].map((_, index) => (
          <div
            key={index}
            className="relative group flex flex-col items-center w-8"
          >
            <div className="flex items-end h-32 mb-2 w-full justify-center">
              <div
                className="w-6 rounded-t-sm bg-muted animate-pulse"
                style={{ height: '60px' }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const data = stats?.chartData.secretActivity.map(item => item.secrets) || [];

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data);

  return (
    <div className="flex items-center justify-center gap-4 text-sm">
      {data.map((value, index) => {
        // Calculate height percentage with minimum height of 15px
        const heightPercentage = Math.max((value / maxValue) * 100, 15);
        const heightPx = Math.max((heightPercentage / 100) * 120, 20);

        return (
          <div
            key={index}
            className="relative group flex flex-col items-center w-8"
          >
            <div className="flex items-end h-32 mb-2 w-full justify-center">
              <div
                className="w-6 rounded-t-sm transition-all duration-300 group-hover:scale-105 bg-white hover:bg-gray-200"
                style={{ height: `${heightPx}px` }}
              />
            </div>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 border rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-popover border-border text-popover-foreground shadow-lg whitespace-nowrap z-10">
              {value} secrets
            </div>
          </div>
        );
      })}
    </div>
  );
}
