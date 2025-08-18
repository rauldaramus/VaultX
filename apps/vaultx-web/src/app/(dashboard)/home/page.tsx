'use client';

import {
  LockKeyhole,
  Eye,
  Clock,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Calendar,
  Shield,
  PlusCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/features/auth/model/auth.store';
import { SimpleBarChart } from '@/features/dashboard/components/SimpleBarChart';
import { SimplePieChart } from '@/features/dashboard/components/SimplePieChart';
import { SimpleTimeline } from '@/features/dashboard/components/SimpleTimeline';
import { useDashboardData } from '@/features/dashboard/hooks/use-dashboard-data';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/shared/components/ui/card';

export default function DashboardHomePage() {
  const { user } = useAuthStore();
  const { stats, recommendations, loading, error } = useDashboardData();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in-up opacity-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-72 bg-muted animate-pulse rounded mt-2" />
          </div>
          <div className="h-10 w-48 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-destructive-foreground bg-destructive/20 p-4 rounded-md">
          <p>Error loading dashboard: {error}</p>
          <p>Please refresh the page to try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up opacity-0">
      {/* Header with button on the right */}
      <div
        className="flex items-center justify-between animate-fade-in-up opacity-0"
        style={{ animationDelay: '0.1s' }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight transition-colors duration-300 hover:text-primary">
            Dashboard
          </h1>
          <p className="text-muted-foreground transition-colors duration-200 hover:text-foreground">
            Welcome, {user?.name || 'User'}. Here&apos;s a summary of your
            activity.
          </p>
        </div>
        <Button
          onClick={() => router.push('/create')}
          className="bg-white text-black border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm transition-all duration-300 px-4 py-2 h-auto hover:scale-105 hover-glow"
        >
          <div className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4 hover:rotate-90" />
            <span className="font-medium">Create New Secret</span>
          </div>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="hover-lift animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.2s' }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground">
              Secrets Created
            </CardTitle>
            <div className="p-2 rounded-full bg-muted transition-all duration-300 hover:bg-primary/20 hover:scale-110">
              <LockKeyhole className="h-4 w-4 text-muted-foreground transition-colors duration-200 hover:text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold transition-all duration-300 hover:scale-105 hover:text-primary">
              {stats?.secretsCreated || 0}
            </div>
            <div className="flex items-center text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground">
              {stats?.trends.secretsCreatedChange &&
              stats.trends.secretsCreatedChange > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500 transition-transform duration-300 hover:scale-125" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-destructive transition-transform duration-300 hover:scale-125" />
              )}
              <span
                className={`font-medium transition-colors duration-200 ${
                  stats?.trends.secretsCreatedChange &&
                  stats.trends.secretsCreatedChange > 0
                    ? 'text-green-500 hover:text-green-400'
                    : 'text-destructive hover:text-red-400'
                }`}
              >
                {stats?.trends.secretsCreatedChange > 0 ? '+' : ''}
                {stats?.trends.secretsCreatedChange || 0}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover-lift animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.3s' }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground">
              Secrets Viewed
            </CardTitle>
            <div className="p-2 rounded-full bg-muted transition-all duration-300 hover:bg-primary/20 hover:scale-110">
              <Eye className="h-4 w-4 text-muted-foreground transition-colors duration-200 hover:text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold transition-all duration-300 hover:scale-105 hover:text-primary">
              {stats?.secretsViewed || 0}
            </div>
            <div className="flex items-center text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground">
              {stats?.trends.secretsViewedChange &&
              stats.trends.secretsViewedChange > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500 transition-transform duration-300 hover:scale-125" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-destructive transition-transform duration-300 hover:scale-125" />
              )}
              <span
                className={`font-medium transition-colors duration-200 ${
                  stats?.trends.secretsViewedChange &&
                  stats.trends.secretsViewedChange > 0
                    ? 'text-green-500 hover:text-green-400'
                    : 'text-destructive hover:text-red-400'
                }`}
              >
                {stats?.trends.secretsViewedChange > 0 ? '+' : ''}
                {stats?.trends.secretsViewedChange || 0}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover-lift animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.4s' }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground">
              Active Secrets
            </CardTitle>
            <div className="p-2 rounded-full bg-muted transition-all duration-300 hover:bg-primary/20 hover:scale-110">
              <Clock className="h-4 w-4 text-muted-foreground transition-colors duration-200 hover:text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold transition-all duration-300 hover:scale-105 hover:text-primary">
              {stats?.activeSecrets || 0}
            </div>
            <div className="flex items-center text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground">
              {stats?.trends.activeSecretsChange &&
              stats.trends.activeSecretsChange > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500 transition-transform duration-300 hover:scale-125" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-destructive transition-transform duration-300 hover:scale-125" />
              )}
              <span
                className={`font-medium transition-colors duration-200 ${
                  stats?.trends.activeSecretsChange &&
                  stats.trends.activeSecretsChange > 0
                    ? 'text-green-500 hover:text-green-400'
                    : 'text-destructive hover:text-red-400'
                }`}
              >
                {stats?.trends.activeSecretsChange > 0 ? '+' : ''}
                {stats?.trends.activeSecretsChange || 0}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover-lift animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.5s' }}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground">
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold transition-all duration-300 hover:scale-105 hover:text-primary">
              {stats?.plan || 'On-Premise'}
            </div>
            <div className="text-xs text-muted-foreground">
              <Link
                href="#"
                className="text-primary hover:underline transition-all duration-200 hover:text-primary/80"
              >
                Access to Full functionality
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card
          className="lg:col-span-4 hover-lift animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.6s' }}
        >
          <CardHeader className="transition-all duration-300 hover:bg-muted/30">
            <CardTitle className="transition-colors duration-200 hover:text-primary">
              Secret Activity
            </CardTitle>
            <CardDescription className="transition-colors duration-200 hover:text-foreground">
              Secrets created and viewed in the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="animate-scale-in opacity-0"
              style={{ animationDelay: '0.8s' }}
            >
              <SimpleBarChart />
            </div>
            <div className="flex items-center justify-center gap-4 text-sm mt-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                (day, index) => (
                  <div
                    key={day}
                    className="w-8 text-center text-muted-foreground transition-all duration-300 hover:text-foreground hover:scale-110 animate-fade-in-up opacity-0"
                    style={{ animationDelay: `${1 + index * 0.1}s` }}
                  >
                    {day}
                  </div>
                )
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between text-xs pt-4 text-muted-foreground">
            <div className="flex items-center transition-colors duration-200 hover:text-foreground">
              <div className="mr-1 h-2 w-2 rounded-full bg-muted transition-all duration-300 hover:scale-125"></div>
              Secrets created
            </div>
            <div className="flex items-center transition-colors duration-200 hover:text-foreground">
              <Calendar className="mr-1 h-3 w-3 transition-transform duration-300 hover:scale-110" />
              Last 7 days
            </div>
          </CardFooter>
        </Card>

        <Card
          className="lg:col-span-3 hover-lift animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.7s' }}
        >
          <CardHeader className="transition-all duration-300 hover:bg-muted/30">
            <CardTitle className="transition-colors duration-200 hover:text-primary">
              Secret Status
            </CardTitle>
            <CardDescription className="transition-colors duration-200 hover:text-foreground">
              Distribution of secrets by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="animate-scale-in opacity-0"
              style={{ animationDelay: '0.9s' }}
            >
              <SimplePieChart />
            </div>
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              {stats?.chartData.statusDistribution.map((item, _index) => (
                <div
                  key={item.status}
                  className="flex items-center transition-all duration-300 hover:scale-105"
                >
                  <div
                    className={`mr-2 h-3 w-3 rounded-full transition-all duration-300 hover:scale-125 ${
                      item.status === 'Active'
                        ? 'bg-green-300'
                        : item.status === 'Viewed'
                        ? 'bg-red-300'
                        : 'bg-yellow-300'
                    }`}
                  ></div>
                  <span className="text-sm transition-colors duration-200 hover:text-foreground">
                    {item.status} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className="hover-lift animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.8s' }}
        >
          <CardHeader className="transition-all duration-300 hover:bg-muted/30">
            <CardTitle className="transition-colors duration-200 hover:text-primary">
              Recent Activity
            </CardTitle>
            <CardDescription className="transition-colors duration-200 hover:text-foreground">
              Latest actions performed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="animate-scale-in opacity-0"
              style={{ animationDelay: '1s' }}
            >
              <SimpleTimeline />
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button
              asChild
              className="w-full bg-white text-black border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm transition-all duration-300 px-4 py-2 h-auto hover:scale-105 hover-glow"
            >
              <Link href="/secrets">
                <span className="flex items-center justify-center w-full font-medium">
                  View All History
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 hover:scale-125" />
                </span>
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card
          className="hover-lift animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.9s' }}
        >
          <CardHeader className="transition-all duration-300 hover:bg-muted/30">
            <CardTitle className="transition-colors duration-200 hover:text-primary">
              Security Recommendations
            </CardTitle>
            <CardDescription className="transition-colors duration-200 hover:text-foreground">
              Improve the security of your secrets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((recommendation, index) => (
                <div
                  key={recommendation.id}
                  className="flex items-start gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-muted/50 animate-fade-in-left opacity-0"
                  style={{ animationDelay: `${1.1 + index * 0.1}s` }}
                >
                  <div className="rounded-full p-2 mt-0.5 bg-muted transition-all duration-300 hover:bg-primary/20 hover:scale-110">
                    {recommendation.icon === 'Shield' && (
                      <Shield className="h-4 w-4 text-muted-foreground transition-colors duration-200 hover:text-primary" />
                    )}
                    {recommendation.icon === 'LockKeyhole' && (
                      <LockKeyhole className="h-4 w-4 text-muted-foreground transition-colors duration-200 hover:text-primary" />
                    )}
                    {recommendation.icon === 'Eye' && (
                      <Eye className="h-4 w-4 text-muted-foreground transition-colors duration-200 hover:text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium transition-colors duration-200 hover:text-foreground">
                      {recommendation.title}
                    </p>
                    <p className="text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground">
                      {recommendation.description}
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs transition-all duration-300 hover:scale-105"
                      asChild
                    >
                      <Link href={recommendation.action.href}>
                        {recommendation.action.label}
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
