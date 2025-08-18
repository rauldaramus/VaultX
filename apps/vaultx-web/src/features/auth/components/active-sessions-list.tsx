'use client';

import { Laptop, MapPin, Wifi, XCircle } from 'lucide-react';

import { useActiveSessions } from '../hooks/use-active-sessions';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { timeAgo } from '@/shared/lib/utils';

export function ActiveSessionsList() {
  const { sessions, loading, error, revokeSession } = useActiveSessions();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-24 w-full bg-muted animate-pulse rounded-lg" />
        <div className="h-16 w-full bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive-foreground bg-destructive/20 p-4 rounded-md">
        <p>Error: {error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  const currentSession = sessions.find(session => session.isCurrent);
  const otherSessions = sessions.filter(session => !session.isCurrent);

  return (
    <div className="space-y-6 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Current Session</CardTitle>
          <CardDescription>
            Manage active sessions on your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentSession ? (
            <div className="relative p-4 border border-border rounded-lg bg-card">
              <Badge className="absolute top-3 right-3 bg-green-500/20 text-green-300">
                Current
              </Badge>
              <p className="text-sm text-muted-foreground mb-2">
                Started {timeAgo(currentSession.lastActiveAt)}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Laptop className="h-4 w-4 text-muted-foreground" />
                <span>
                  Device: {currentSession.deviceInfo.os} •{' '}
                  {currentSession.deviceInfo.browser}{' '}
                  {currentSession.deviceInfo.device}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <Wifi className="h-4 w-4 text-muted-foreground" />
                <span>IP: {currentSession.ipAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Location: Madrid, Spain</span>{' '}
                {/* Mocked location for now */}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center">
              Could not load current session.
            </p>
          )}

          {otherSessions.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Other Active Sessions</h3>
              {otherSessions.map(session => (
                <div
                  key={session.id}
                  className="relative p-4 border border-border rounded-lg bg-card"
                >
                  <p className="text-sm text-muted-foreground mb-2">
                    Started {timeAgo(session.lastActiveAt)}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Laptop className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Device: {session.deviceInfo.os} •{' '}
                      {session.deviceInfo.browser} {session.deviceInfo.device}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <span>IP: {session.ipAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Location: Madrid, Spain</span>{' '}
                    {/* Mocked location for now */}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute bottom-3 right-3"
                    onClick={() => revokeSession(session.id)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    End Session
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">
              No other active sessions on your account.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
