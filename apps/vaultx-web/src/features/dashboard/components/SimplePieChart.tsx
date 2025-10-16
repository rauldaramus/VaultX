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

import { useEffect, useMemo, useState } from 'react';

import { useDashboardData } from '../hooks/use-dashboard-data';

const SEGMENTS = [
  { label: 'Active', color: 'rgb(134 239 172)' },
  { label: 'Viewed', color: 'rgb(252 165 165)' },
  { label: 'Expired', color: 'rgb(253 224 71)' },
];

export function SimplePieChart() {
  const { stats, loading } = useDashboardData();
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0]);

  const statusDistribution = stats?.chartData.statusDistribution || [];
  const percentages = useMemo(() => {
    const getPercentage = (status: string) =>
      statusDistribution.find(item => item.status === status)?.percentage || 0;

    return [
      getPercentage('Active'),
      getPercentage('Viewed'),
      getPercentage('Expired'),
    ] as const;
  }, [statusDistribution]);

  const activePercentage = percentages[0];

  useEffect(() => {
    if (!stats || loading) {
      return;
    }

    let frame = 0;
    const duration = 500;
    const maxFrames = Math.ceil(duration / 16);

    const animate = () => {
      frame += 1;
      const progress = Math.min(frame / maxFrames, 1);

      setAnimatedValues([
        percentages[0] * progress,
        percentages[1] * progress,
        percentages[2] * progress,
      ]);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [stats, loading, percentages]);

  if (loading) {
    return (
      <div className="relative w-full h-48 flex items-center justify-center mt-4">
        <div className="w-36 h-36 bg-muted animate-pulse rounded-full" />
      </div>
    );
  }

  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const trackColor = 'rgba(148, 163, 184, 0.15)';

  const segmentsWithProgress = SEGMENTS.map((segment, index) => ({
    ...segment,
    finalPercentage: percentages[index],
    animatedPercentage: Math.min(animatedValues[index], percentages[index]),
  }));

  return (
    <div className="relative w-full h-48 flex items-center justify-center mt-4">
      <svg
        width="150"
        height="150"
        viewBox="0 0 100 100"
        className="transform -rotate-90"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {(() => {
          let rotationAngle = 0;

          return segmentsWithProgress.map(segment => {
            const visiblePercentage = segment.animatedPercentage;

            if (visiblePercentage <= 0) {
              return null;
            }

            const segmentLength = (visiblePercentage / 100) * circumference;
            const currentRotation = rotationAngle;

            const circle = (
              <circle
                key={segment.label}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${segmentLength} ${
                  circumference - segmentLength
                }`}
                strokeLinecap="round"
                style={{
                  transform: `rotate(${currentRotation}deg)`,
                  transformOrigin: '50% 50%',
                  transition: 'all 0.3s ease',
                }}
              />
            );

            rotationAngle += (visiblePercentage / 100) * 360;

            return circle;
          });
        })()}
        <circle
          cx="50"
          cy="50"
          r={radius - strokeWidth * 0.95}
          fill="var(--background)"
          stroke="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-2xl font-bold">{activePercentage}%</span>
        <span className="text-xs text-muted-foreground">Active</span>
      </div>
    </div>
  );
}
