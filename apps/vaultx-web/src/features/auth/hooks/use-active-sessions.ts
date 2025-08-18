'use client';

import { useState, useEffect, useCallback } from 'react';

import type { SessionApiModel } from '@/features/auth/api/models/auth.model';
import { authService } from '@/features/auth/api/services/auth.service';

export function useActiveSessions() {
  const [sessions, setSessions] = useState<SessionApiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.getUserSessions();
      if (response.success && response.data) {
        setSessions(response.data);
      } else {
        setError(response.error || 'Failed to fetch sessions.');
      }
    } catch (err) {
      setError('Network error or server unreachable.');
      // eslint-disable-next-line no-console
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const revokeSession = useCallback(
    async (sessionId: string) => {
      try {
        // Optimistic update
        setSessions(prev => prev.filter(session => session.id !== sessionId));
        const response = await authService.revokeSession(sessionId);
        if (!response.success) {
          setError(response.error || 'Failed to revoke session.');
          // Revert if API call fails
          fetchSessions();
        }
      } catch (err) {
        setError('Network error or server unreachable.');
        // eslint-disable-next-line no-console
        console.error('Error revoking session:', err);
        // Revert if API call fails
        fetchSessions();
      }
    },
    [fetchSessions]
  );

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return { sessions, loading, error, revokeSession, fetchSessions };
}
