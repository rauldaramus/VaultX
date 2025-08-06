"use client"

import { useState, useEffect } from "react"
import { getDashboardStats, getRecentActivity, getSecurityRecommendations } from "../api/mock"
import type { DashboardStats, ActivityLog, SecurityRecommendation } from "@vaultx/shared"

interface DashboardData {
  stats: DashboardStats | null
  activity: ActivityLog[]
  recommendations: SecurityRecommendation[]
  loading: boolean
  error: string | null
}

export const useDashboardData = (): DashboardData => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activity, setActivity] = useState<ActivityLog[]>([])
  const [recommendations, setRecommendations] = useState<SecurityRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all data in parallel
        const [statsResponse, activityResponse, recommendationsResponse] = await Promise.all([
          getDashboardStats(),
          getRecentActivity(),
          getSecurityRecommendations()
        ])

        // Handle stats response
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data)
        } else {
          setError(statsResponse.error || "Failed to fetch dashboard stats")
        }

        // Handle activity response
        if (activityResponse.success && activityResponse.data) {
          setActivity(activityResponse.data)
        } else {
          setError(activityResponse.error || "Failed to fetch recent activity")
        }

        // Handle recommendations response
        if (recommendationsResponse.success && recommendationsResponse.data) {
          setRecommendations(recommendationsResponse.data)
        } else {
          setError(recommendationsResponse.error || "Failed to fetch security recommendations")
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return {
    stats,
    activity,
    recommendations,
    loading,
    error,
  }
}
