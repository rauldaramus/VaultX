"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Info, RefreshCw, Copy, BookOpen } from "lucide-react"
import { useApiData } from "../hooks/use-api-data"
import { formatDate } from "@/shared/lib/utils"

export function ApiTokens() {
  const { tokens, loading, error } = useApiData()

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-24 w-full bg-muted animate-pulse rounded-lg" />
        <div className="h-16 w-full bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-destructive-foreground bg-destructive/20 p-4 rounded-md">
        <p>Error: {error}</p>
        <p>Please try again later.</p>
      </div>
    )
  }

  const mainToken = tokens[0] // Assuming the first token is the main one

  return (
    <div className="space-y-6 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>API Tokens</CardTitle>
          <CardDescription>Manage your API tokens to integrate VaultX with your applications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Important Information</AlertTitle>
            <AlertDescription>
              API tokens allow you to access the VaultX API. Keep your tokens secure and don't share them with
              anyone.
            </AlertDescription>
          </Alert>
          {mainToken && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{mainToken.name}</h4>
                  <p className="text-sm text-muted-foreground">Created on {formatDate(mainToken.createdAt)}</p>
                </div>
                <Button className="bg-white text-black border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm transition-all duration-300 hover:scale-105 hover-glow font-medium">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md bg-muted border border-border">
                <span className="font-mono text-sm">{mainToken.token}</span>
                <Button variant="ghost" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              {mainToken.lastUsedAt && (
                <p className="text-xs text-muted-foreground">Last used: {formatDate(mainToken.lastUsedAt)}</p>
              )}
            </>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
