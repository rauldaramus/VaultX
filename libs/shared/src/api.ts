// Shared API Response Types for consistent mock responses

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
  timestamp?: string;
  requestId?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationApiResponse extends ApiResponse {
  validationErrors?: ValidationError[];
}

// Standard error codes
export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
}

// Standard success messages
export const ApiSuccessMessages = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  RETRIEVED: 'Resource retrieved successfully',
} as const;

// Standard error messages
export const ApiErrorMessages = {
  VALIDATION_ERROR: 'Validation failed',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',
  CONFLICT: 'Resource already exists',
  INTERNAL_ERROR: 'Internal server error',
  RATE_LIMITED: 'Rate limit exceeded',
} as const;

// Utility functions for creating standardized responses
export const createSuccessResponse = <T>(
  data: T,
  message?: string,
  statusCode = 200
): ApiResponse<T> => ({
  success: true,
  data,
  message,
  statusCode,
  timestamp: new Date().toISOString(),
  requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
});

export const createErrorResponse = (
  error: string,
  statusCode = 500,
  validationErrors?: ValidationError[]
): ValidationApiResponse => ({
  success: false,
  error,
  statusCode,
  timestamp: new Date().toISOString(),
  requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  validationErrors,
});

export const createPaginatedResponse = <T>(
  data: T[],
  pagination: PaginatedResponse<T>['pagination'],
  message?: string
): PaginatedResponse<T> => ({
  success: true,
  data,
  message,
  statusCode: 200,
  timestamp: new Date().toISOString(),
  requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  pagination,
});
