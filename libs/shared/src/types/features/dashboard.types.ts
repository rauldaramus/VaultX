import type React from "react"

export interface DashboardStats {
  secretsCreated: number
  secretsViewed: number
  activeSecrets: number
  plan: string
  trends: {
    secretsCreatedChange: number
    secretsViewedChange: number
    activeSecretsChange: number
  }
  chartData: {
    secretActivity: Array<{ day: string; secrets: number }>
    statusDistribution: Array<{ status: string; count: number; percentage: number }>
  }
}

export interface ActivityLog {
  id: string
  action: string
  description: string
  timestamp: string
  type: "create" | "view" | "expire" | "update" | "delete"
  icon: string
}

export interface SecurityRecommendation {
  id: string
  title: string
  description: string
  type: "security" | "secrets" | "review"
  priority: "high" | "medium" | "low"
  action: {
    label: string
    href: string
  }
  icon: string
  // Legacy fields for backward compatibility
  actionText?: string
}