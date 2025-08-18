'use client';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import { useDashboardData } from '../hooks/use-dashboard-data';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

export function ActivityChart() {
  const { stats, loading } = useDashboardData();

  const data =
    stats?.chartData.secretActivity.map(item => ({
      name: item.day,
      total: item.secrets,
    })) || [];
  return (
    <Card className="bg-gray-900 border-gray-800 hover-lift animate-fade-in-up opacity-0 animate-stagger-2">
      <CardHeader className="transition-all duration-300 hover:bg-gray-800/30">
        <CardTitle className="transition-colors duration-200 hover:text-gray-200">
          Secret Activity
        </CardTitle>
        <p className="text-sm text-gray-400 transition-colors duration-200 hover:text-gray-300">
          Secrets created and viewed in the last 7 days
        </p>
      </CardHeader>
      <CardContent className="pl-2 transition-all duration-300">
        <div
          className="animate-scale-in opacity-0"
          style={{ animationDelay: '0.5s' }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  className="transition-colors duration-200"
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={value => `${value}`}
                  className="transition-colors duration-200"
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                  }}
                  animationDuration={200}
                />
                <Bar
                  dataKey="total"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                  className="transition-all duration-300 hover:opacity-80"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
