'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

import { useDashboardData } from '../hooks/use-dashboard-data';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

const COLORS = ['#4f46e5', '#ef4444'];

export function StatusDonutChart() {
  const { stats, loading } = useDashboardData();

  const data =
    stats?.chartData.statusDistribution.map(item => ({
      name: item.status,
      value: item.percentage,
    })) || [];

  const activePercentage =
    data.find(item => item.name === 'Active')?.value || 0;
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle>Secret Status</CardTitle>
        <p className="text-sm text-gray-400">
          Distribution of secrets by status
        </p>
      </CardHeader>
      <CardContent>
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
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend iconType="circle" />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                fontSize="24"
                fontWeight="bold"
              >
                {activePercentage}%
              </text>
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#9ca3af"
                fontSize="14"
              >
                Active
              </text>
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
