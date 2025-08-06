// Types for API Management feature
export interface ApiToken {
  id: string
  name: string // "Main Token" or custom name
  token: string // Partially hidden for UI
  createdAt: string
  lastUsedAt: string | null
  expiresAt: string | null
  isActive: boolean
  permissions: string[]
  usage: {
    requestsToday: number
    requestsThisMonth: number
    lastRequest: string | null
  }
}

export interface ApiUsageStats {
  requestsThisMonth: number
  requestLimit: number
  dailyQuota?: number // Para planes demo
  usagePercentage: number
  remainingRequests: number
  resetDate: string
  usageBreakdown: Array<{ action: string; count: number; percentage: number }>
  dailyUsage: Array<{ date: string; requests: number }>
}

export interface CreateTokenRequest {
  name: string
  permissions?: string[]
  expiresAt?: string | null
  environment?: string
}