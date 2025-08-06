export * from "./components/activity-chart"
export * from "./components/recent-activity"
export * from "./components/security-recommendations"
export * from "./components/stats-cards"
export * from "./components/status-donut-chart"
export * from "./components/SimpleBarChart"
export * from "./components/SimplePieChart"
export * from "./components/SimpleTimeline"
export * from "./hooks/use-dashboard-data"
export * from "./hooks/use-dashboard-stats"
// Re-export dashboard types from shared library
export type { DashboardStats, ActivityLog, SecurityRecommendation } from '@vaultx/shared'