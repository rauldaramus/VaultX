import type { Secret } from '@vaultx/shared';
import { QrCode, BarChart2, Share2, Lock, Eye, Clock } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';

export function SecretItem({ secret }: { secret: Secret }) {
  return (
    <Card className="hover-lift animate-fade-in-up opacity-0 transition-all duration-300 hover:border-gray-600">
      <CardHeader className="transition-all duration-300 hover:bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-full transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: 'hsl(var(--muted))' }}
            >
              {secret.status === 'Expired' ? (
                <Clock className="h-5 w-5 text-muted-foreground transition-colors duration-200 hover:text-foreground" />
              ) : secret.isViewed ? (
                <Eye className="h-5 w-5 text-muted-foreground transition-colors duration-200 hover:text-foreground" />
              ) : (
                <Lock className="h-5 w-5 text-green-400 transition-all duration-300 hover:scale-110 animate-pulse-slow" />
              )}
            </div>
            <div>
              <CardTitle className="text-card-foreground transition-colors duration-200 hover:text-primary">
                {secret.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground">
                Created on {secret.createdAt}
                {secret.expiresAt && ` • Expires on ${secret.expiresAt}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                'text-xs font-semibold px-2.5 py-0.5 rounded-full transition-all duration-300 hover:scale-105',
                secret.status === 'Active' && !secret.isViewed
                  ? 'bg-green-400/20 text-green-300 hover:bg-green-400/30'
                  : secret.status === 'Expired'
                  ? 'bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30'
                  : secret.isViewed
                  ? 'bg-red-400/20 text-red-300 hover:bg-red-400/30'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {secret.status === 'Expired'
                ? 'Expired'
                : secret.isViewed
                ? 'Viewed'
                : secret.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      {(secret.isViewed || secret.status === 'Expired') && (
        <CardContent className="transition-all duration-300">
          <p className="text-muted-foreground transition-colors duration-200 hover:text-foreground">
            This secret was viewed on {secret.viewedAt} and is no longer
            available.
          </p>
        </CardContent>
      )}
      {!secret.isViewed && secret.status === 'Active' && (
        <CardFooter className="flex gap-2 transition-all duration-300">
          <Button className="bg-white text-black border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm transition-all duration-300 hover:scale-105 hover-glow font-medium">
            <Share2 className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
            Share
          </Button>
          <Button className="bg-white text-black border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm transition-all duration-300 hover:scale-105 hover-glow font-medium">
            <QrCode className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
            QR Code
          </Button>
          <Button className="bg-white text-black border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm transition-all duration-300 hover:scale-105 hover-glow font-medium">
            <BarChart2 className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
            Access Statistics
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
