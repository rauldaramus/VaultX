'use client';

import {
  ArrowUp,
  ArrowDown,
  Lock,
  Eye,
  Clock,
  ShieldCheck,
} from 'lucide-react';

import { useDashboardData } from '../hooks/use-dashboard-data';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

export function StatsCards() {
  const { stats, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="bg-gray-900 border-gray-800">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-6 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: 'Secrets Created',
      value: stats?.secretsCreated?.toString() || '0',
      change: stats?.trends.secretsCreatedChange
        ? `${stats.trends.secretsCreatedChange > 0 ? '+' : ''}${
            stats.trends.secretsCreatedChange
          }%`
        : null,
      icon: Lock,
    },
    {
      title: 'Secrets Viewed',
      value: stats?.secretsViewed?.toString() || '0',
      change: stats?.trends.secretsViewedChange
        ? `${stats.trends.secretsViewedChange > 0 ? '+' : ''}${
            stats.trends.secretsViewedChange
          }%`
        : null,
      icon: Eye,
    },
    {
      title: 'Active Secrets',
      value: stats?.activeSecrets?.toString() || '0',
      change: stats?.trends.activeSecretsChange
        ? `${stats.trends.activeSecretsChange > 0 ? '+' : ''}${
            stats.trends.activeSecretsChange
          }%`
        : null,
      icon: Clock,
    },
    {
      title: 'Current Plan',
      value: stats?.plan || 'On-Premise',
      description: 'Access to Full functionality',
      icon: ShieldCheck,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className="bg-gray-900 border-gray-800 hover-lift animate-fade-in-up opacity-0"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 transition-colors duration-200 group-hover:text-gray-300">
              {stat.title}
            </CardTitle>
            <div className="p-2 rounded-full bg-gray-800/50 transition-all duration-300 hover:bg-gray-700/50 hover:scale-110">
              <stat.icon className="h-4 w-4 text-gray-400 transition-colors duration-200 hover:text-gray-300" />
            </div>
          </CardHeader>
          <CardContent className="group">
            <div className="text-2xl font-bold transition-all duration-300 hover:scale-105">
              {stat.value}
            </div>
            {stat.change ? (
              <p className="text-xs text-gray-400 flex items-center transition-all duration-200 hover:text-gray-300">
                <div className="transition-transform duration-300 hover:scale-110">
                  {stat.change.startsWith('+') ? (
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <span
                  className={`transition-colors duration-200 ${
                    stat.change.startsWith('+')
                      ? 'text-green-500 hover:text-green-400'
                      : 'text-red-500 hover:text-red-400'
                  }`}
                >
                  {stat.change}
                </span>
                &nbsp;from last month
              </p>
            ) : (
              <p className="text-xs text-gray-400 transition-colors duration-200 hover:text-gray-300">
                {stat.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
