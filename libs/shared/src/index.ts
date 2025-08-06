// Re-export shared types and utilities
export * from './api'
export * from './lib/utils'

// Entity types
export * from './types/entities/user.types'
export * from './types/entities/secret.types'

// Feature types
export * from './types/features/auth.types'
export * from './types/features/dashboard.types'
export * from './types/features/api-management.types'
export * from './types/features/user-settings.types'

// Base types
export type Status = "idle" | "loading" | "success" | "error"

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}
