'use client';

import { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/mock';
import type { DashboardStats } from '@vaultx/shared';

// Hook de ejemplo
export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  return { stats, loading };
};
