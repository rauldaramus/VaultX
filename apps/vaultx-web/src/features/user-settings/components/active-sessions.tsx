/**
 * @file: active-sessions.tsx
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

import type { SessionApiModel } from '@/features/auth/api/models/auth.model';
import { authService } from '@/features/auth/api/services/auth.service';
import { Button } from '@/shared/components/ui/button';

export function ActiveSessions() {
  const [sessions, setSessions] = useState<SessionApiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.getUserSessions();

      if (response.success && response.data) {
        setSessions(response.data);
      } else {
        setError(response.error || 'Failed to load sessions');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const response = await authService.revokeSession(sessionId);

      if (response.success) {
        // Refresh sessions list
        await fetchSessions();
      } else {
        setError(response.error || 'Failed to revoke session');
      }
    } catch {
      setError('An unexpected error occurred');
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="border rounded-lg p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Active Sessions</h3>
          <p className="text-sm text-muted-foreground">
            Manage devices where you're currently logged in. You can sign out of
            any session you don't recognize.
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-md"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No active sessions found.
              </p>
            ) : (
              sessions.map(session => (
                <div
                  key={session.id}
                  className="border rounded-md p-4 flex items-start justify-between"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">
                        {session.deviceInfo.browser} on {session.deviceInfo.os}
                      </h4>
                      {session.isCurrent && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      IP: {session.ipAddress}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last active: {formatDate(session.lastActiveAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expires: {formatDate(session.expiresAt)}
                    </p>
                  </div>

                  {!session.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
