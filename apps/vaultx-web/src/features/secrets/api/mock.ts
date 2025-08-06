import type { Secret, CreateSecretRequest, UpdateSecretRequest } from "@vaultx/shared"
import { createSuccessResponse, createErrorResponse, type ApiResponse } from "@vaultx/shared"

// Simulate API delay
const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Mock data storage (simulate database)
let mockSecrets: Secret[] = [
  {
    id: "secret_1",
    title: "Production Database API Key",
    content: "sk_live_51H7...",
    type: "text",
    status: "Active",
    tags: ["production", "database", "api"],
    createdAt: "2024-12-20T10:30:00Z",
    updatedAt: "2024-12-20T10:30:00Z",
    expiresAt: "2025-01-20T10:30:00Z",
    isViewed: true,
    viewCount: 3,
    lastViewedAt: "2024-12-24T15:20:00Z",
    createdBy: "user_1",
    isProtected: false,
    maxViews: null,
    allowedIPs: [],
    metadata: {
      environment: "production",
      service: "main-api",
    },
  },
  {
    id: "secret_2", 
    title: "JWT Authentication Secret",
    content: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    type: "text",
    status: "Active",
    tags: ["jwt", "auth", "production"],
    createdAt: "2024-12-18T14:15:00Z",
    updatedAt: "2024-12-18T14:15:00Z",
    expiresAt: "2025-06-18T14:15:00Z",
    isViewed: false,
    viewCount: 0,
    lastViewedAt: null,
    createdBy: "user_1",
    isProtected: true,
    maxViews: 5,
    allowedIPs: ["192.168.1.0/24"],
    metadata: {
      environment: "production",
      service: "auth-service",
    },
  },
  {
    id: "secret_3",
    title: "Development Database Connection",
    content: "postgresql://user:password@localhost:5432/devdb",
    type: "text", 
    status: "Expired",
    tags: ["development", "database"],
    createdAt: "2024-11-15T09:00:00Z",
    updatedAt: "2024-11-15T09:00:00Z",
    expiresAt: "2024-12-15T09:00:00Z",
    isViewed: true,
    viewCount: 12,
    lastViewedAt: "2024-12-10T11:30:00Z",
    createdBy: "user_1",
    isProtected: false,
    maxViews: null,
    allowedIPs: [],
    metadata: {
      environment: "development",
      service: "main-api",
    },
  },
  {
    id: "secret_4",
    title: "SSL Certificate Private Key",
    content: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...",
    type: "file",
    status: "Active",
    tags: ["ssl", "certificate", "security"],
    createdAt: "2024-12-22T16:45:00Z",
    updatedAt: "2024-12-22T16:45:00Z", 
    expiresAt: "2025-12-22T16:45:00Z",
    isViewed: false,
    viewCount: 0,
    lastViewedAt: null,
    createdBy: "user_1",
    isProtected: true,
    maxViews: 3,
    allowedIPs: ["10.0.0.0/8"],
    metadata: {
      environment: "production",
      service: "web-server",
      fileType: "pem",
      fileName: "server.key",
    },
  },
  {
    id: "secret_5",
    title: "Temporary API Token",
    content: "tmp_abc123xyz789",
    type: "text",
    status: "Active",
    tags: ["temporary", "api", "testing"],
    createdAt: "2024-12-25T08:00:00Z",
    updatedAt: "2024-12-25T08:00:00Z",
    expiresAt: "2024-12-26T08:00:00Z",
    isViewed: true,
    viewCount: 1,
    lastViewedAt: "2024-12-25T10:15:00Z",
    createdBy: "user_1",
    isProtected: false,
    maxViews: 10,
    allowedIPs: [],
    metadata: {
      environment: "testing",
      service: "temp-service",
    },
  },
]

// Mock API service for Secrets Management
export const getSecrets = async (filters?: {
  status?: string
  tags?: string[]
  search?: string
}): Promise<ApiResponse<Secret[]>> => {
  await simulateDelay(800)
  
  let filteredSecrets = [...mockSecrets]
  
  // Apply filters
  if (filters?.status && filters.status !== "all") {
    filteredSecrets = filteredSecrets.filter(secret => 
      secret.status.toLowerCase() === filters.status?.toLowerCase()
    )
  }
  
  if (filters?.tags && filters.tags.length > 0) {
    filteredSecrets = filteredSecrets.filter(secret =>
      filters.tags!.some((tag: string) => secret.tags.includes(tag))
    )
  }
  
  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredSecrets = filteredSecrets.filter(secret =>
      secret.title.toLowerCase().includes(searchTerm) ||
      secret.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
    )
  }
  
  return createSuccessResponse(filteredSecrets, "Secrets retrieved successfully")
}

export const getSecretById = async (id: string): Promise<ApiResponse<Secret | null>> => {
  await simulateDelay(400)
  
  const secret = mockSecrets.find(s => s.id === id)
  
  if (!secret) {
    return createErrorResponse("Secret not found", 404)
  }
  
  if (!secret.isViewed) {
    // Mark as viewed and increment view count
    secret.isViewed = true
    secret.viewCount += 1
    secret.lastViewedAt = new Date().toISOString()
  }
  
  return createSuccessResponse(secret, "Secret retrieved successfully")
}

export const createSecret = async (data: CreateSecretRequest): Promise<ApiResponse<Secret>> => {
  await simulateDelay(1000)
  
  const newSecret: Secret = {
    id: `secret_${Date.now()}`,
    title: data.title,
    content: data.content,
    type: data.type || "text",
    status: "Active",
    tags: data.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expiresAt: data.expiresAt || null,
    isViewed: false,
    viewCount: 0,
    lastViewedAt: null,
    createdBy: "user_1", // Current user
    isProtected: data.isProtected || false,
    maxViews: data.maxViews || null,
    allowedIPs: data.allowedIPs || [],
    metadata: data.metadata || {},
  }
  
  mockSecrets.unshift(newSecret) // Add to beginning
  return createSuccessResponse(newSecret, "Secret created successfully", 201)
}

export const updateSecret = async (id: string, data: UpdateSecretRequest): Promise<ApiResponse<Secret | null>> => {
  await simulateDelay(800)
  
  const secretIndex = mockSecrets.findIndex(s => s.id === id)
  if (secretIndex === -1) {
    return createErrorResponse("Secret not found", 404)
  }
  
  const updatedSecret: Secret = {
    ...mockSecrets[secretIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  
  mockSecrets[secretIndex] = updatedSecret
  return createSuccessResponse(updatedSecret, "Secret updated successfully")
}

export const deleteSecret = async (id: string): Promise<ApiResponse<boolean>> => {
  await simulateDelay(600)
  
  const secretIndex = mockSecrets.findIndex(s => s.id === id)
  if (secretIndex === -1) {
    return createErrorResponse("Secret not found", 404)
  }
  
  mockSecrets.splice(secretIndex, 1)
  return createSuccessResponse(true, "Secret deleted successfully")
}

export const getSecretStats = async (): Promise<ApiResponse<{
  total: number
  active: number
  expired: number
  viewed: number
  protected: number
}>> => {
  await simulateDelay(300)
  
  const stats = {
    total: mockSecrets.length,
    active: mockSecrets.filter(s => s.status === "Active").length,
    expired: mockSecrets.filter(s => s.status === "Expired").length,
    viewed: mockSecrets.filter(s => s.isViewed).length,
    protected: mockSecrets.filter(s => s.isProtected).length,
  }
  
  return createSuccessResponse(stats, "Secret statistics retrieved successfully")
}

export const getAllTags = async (): Promise<ApiResponse<string[]>> => {
  await simulateDelay(200)
  
  const allTags = new Set<string>()
  mockSecrets.forEach(secret => {
    secret.tags.forEach((tag: string) => allTags.add(tag))
  })
  
  return createSuccessResponse(Array.from(allTags).sort(), "Tags retrieved successfully")
}
