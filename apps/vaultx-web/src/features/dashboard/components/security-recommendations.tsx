import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
  ShieldCheck,
  KeyRound,
  RefreshCw,
  Shield,
  LockKeyhole,
  Eye,
} from 'lucide-react';
import { useDashboardData } from '../hooks/use-dashboard-data';

const iconMap = {
  security: Shield,
  secrets: LockKeyhole,
  review: Eye,
};

export function SecurityRecommendations() {
  const { recommendations, loading } = useDashboardData();
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle>Security Recommendations</CardTitle>
        <p className="text-sm text-gray-400">Improve your secrets security</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-9 h-9 bg-muted animate-pulse rounded-full mt-1" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-full" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No recommendations available
          </div>
        ) : (
          recommendations.map((rec, index) => {
            const IconComponent =
              iconMap[rec.type as keyof typeof iconMap] || Shield;
            return (
              <div key={rec.id} className="flex items-start gap-4">
                <div className="p-2 bg-gray-800 rounded-full mt-1">
                  <IconComponent className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{rec.title}</p>
                  <p className="text-sm text-gray-400">{rec.description}</p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-indigo-400 hover:text-indigo-300"
                  >
                    {rec.action.label}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
