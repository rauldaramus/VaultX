"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Progress } from "@/shared/components/ui/progress"
import { useApiData } from "../hooks/use-api-data"

export function ApiUsage() {
  const { usage, loading, error } = useApiData()

  if (loading) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <div className="space-y-2">
            <div className="h-6 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/5" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-2 bg-muted animate-pulse rounded" />
            <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded w-32" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="text-destructive-foreground bg-destructive/20 p-4 rounded-md">
            <p>Error loading API usage: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!usage) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">No usage data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>API Usage</CardTitle>
        <CardDescription>API usage statistics.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Requests this month</span>
            <span className="text-sm text-muted-foreground">
              {usage.requestsThisMonth} / {usage.requestLimit}
            </span>
          </div>
          <Progress 
            value={usage.usagePercentage} 
            className="w-full [&>div]:bg-white text-white text-white" 
          />
          <p className="text-xs text-muted-foreground mt-1">
            {usage.remainingRequests} remaining requests • Restart: {new Date(usage.resetDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <h4 className="font-medium mb-2">Breakdown of usage</h4>
          <div className="space-y-2">
            {usage.usageBreakdown.map((item) => (
              <div key={item.action} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{item.action}</span>
                  <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
                </div>
                <span className="text-sm font-mono">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
