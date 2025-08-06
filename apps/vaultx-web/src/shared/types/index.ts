// Re-export shared types from the shared library
export type { 
  ApiResponse, 
  PaginatedResponse, 
  ValidationError, 
  ValidationApiResponse,
  ApiErrorCode,
  ApiSuccessMessages,
  ApiErrorMessages,
  Status,
  BaseEntity
} from '@vaultx/shared'

// Re-export utility functions
export { 
  createSuccessResponse, 
  createErrorResponse, 
  createPaginatedResponse 
} from '@vaultx/shared'
