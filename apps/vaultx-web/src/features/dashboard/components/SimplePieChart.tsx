/**
 * @file: SimplePieChart.tsx
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

import { useState, useEffect } from 'react';

import { useDashboardData } from '../hooks/use-dashboard-data';

export function SimplePieChart() {
  const { stats, loading } = useDashboardData();
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0]);

  const statusDistribution = stats?.chartData.statusDistribution || [];
  const activeData = statusDistribution.find(item => item.status === 'Active');
  const viewedData = statusDistribution.find(item => item.status === 'Viewed');
  const expiredData = statusDistribution.find(
    item => item.status === 'Expired'
  );

  const activePercentage = activeData?.percentage || 0;
  const viewedPercentage = viewedData?.percentage || 0;
  const expiredPercentage = expiredData?.percentage || 0;

  // Animate the values on mount
  useEffect(() => {
    if (stats && !loading) {
      const interval = setInterval(() => {
        setAnimatedValues(prev => [
          Math.min(prev[0] + 2, activePercentage),
          Math.min(prev[1] + 2, viewedPercentage),
          Math.min(prev[2] + 2, expiredPercentage),
        ]);
      }, 20);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        setAnimatedValues([
          activePercentage,
          viewedPercentage,
          expiredPercentage,
        ]);
      }, 1000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [stats, loading, activePercentage, viewedPercentage, expiredPercentage]);

  if (loading) {
    return (
      <div className="relative w-full h-48 flex items-center justify-center mt-4">
        <div className="w-36 h-36 bg-muted animate-pulse rounded-full" />
      </div>
    );
  }

  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  // Calculate offsets for each segment
  const activeOffset =
    circumference - (circumference * animatedValues[0]) / 100;
  const viewedOffset =
    circumference - (circumference * animatedValues[1]) / 100;
  const expiredOffset =
    circumference - (circumference * animatedValues[2]) / 100;

  // Calculate rotation for each segment to stack them
  const activeRotation = 0;
  const viewedRotation = (animatedValues[0] / 100) * 360;
  const expiredRotation = ((animatedValues[0] + animatedValues[1]) / 100) * 360;

  return (
    <div className="relative w-full h-48 flex items-center justify-center mt-4">
      <svg
        width="150"
        height="150"
        viewBox="0 0 100 100"
        className="transform -rotate-90"
      >
        {/* Active circle (green) */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="rgb(134 239 172)" // green-300 - más pálido y suave
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={activeOffset}
          strokeLinecap="round"
          style={{
            transform: `rotate(${activeRotation}deg)`,
            transformOrigin: '50px 50px',
            transition: 'stroke-dashoffset 0.02s ease-out',
          }}
        />
        {/* Viewed circle (red) */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="rgb(252 165 165)" // red-300 - más pálido y suave
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={viewedOffset}
          strokeLinecap="round"
          style={{
            transform: `rotate(${viewedRotation}deg)`,
            transformOrigin: '50px 50px',
            transition: 'stroke-dashoffset 0.02s ease-out',
          }}
        />
        {/* Expired circle (yellow) */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="rgb(253 224 71)" // yellow-300 - más pálido y suave
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={expiredOffset}
          strokeLinecap="round"
          style={{
            transform: `rotate(${expiredRotation}deg)`,
            transformOrigin: '50px 50px',
            transition: 'stroke-dashoffset 0.02s ease-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-2xl font-bold">{activePercentage}%</span>
        <span className="text-xs text-muted-foreground">Active</span>
      </div>
    </div>
  );
}
