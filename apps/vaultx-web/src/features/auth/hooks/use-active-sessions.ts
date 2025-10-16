/**
 * @file: use-active-sessions.ts
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
