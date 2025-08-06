import type { UserApiModel, TokensApiModel, SessionApiModel, DeviceInfoApiModel } from "../models/auth.model"

// Mock Users Data
export const mockUsers: UserApiModel[] = [
  {
    id: "user_1",
    email: "test@example.com",
    name: "Test User",
    role: "user",
    avatar: "https://avatar.vercel.sh/test@example.com",
    emailVerified: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-12-25T14:20:00Z",
    lastLoginAt: "2024-12-25T14:20:00Z",
    preferences: {
      theme: "dark",
      language: "en",
      timezone: "UTC",
      notifications: {
        email: true,
        push: false,
        security: true,
      },
      twoFactorEnabled: false,
    },
  },
  {
    id: "user_2",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    avatar: "https://avatar.vercel.sh/admin@example.com",
    emailVerified: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-25T12:00:00Z",
    lastLoginAt: "2024-12-25T12:00:00Z",
    preferences: {
      theme: "system",
      language: "en",
      timezone: "UTC",
      notifications: {
        email: true,
        push: true,
        security: true,
      },
      twoFactorEnabled: true,
    },
  },
  {
    id: "user_3",
    email: "john.doe@example.com",
    name: "John Doe",
    role: "user",
    avatar: "https://avatar.vercel.sh/john.doe@example.com",
    emailVerified: false,
    createdAt: "2024-12-20T08:15:00Z",
    updatedAt: "2024-12-20T08:15:00Z",
    preferences: {
      theme: "light",
      language: "en",
      timezone: "America/New_York",
      notifications: {
        email: false,
        push: false,
        security: false,
      },
      twoFactorEnabled: false,
    },
  },
]

// Mock Tokens Data
export const mockTokens: TokensApiModel = {
  accessToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTcwMzUyMDAwMCwiZXhwIjoxNzAzNTIzNjAwfQ.mock-signature",
  refreshToken: "rt_1234567890abcdef",
  tokenType: "Bearer",
  expiresIn: 3600, // 1 hour
  scope: ["read", "write", "secrets:manage"],
}

// Mock Admin Tokens Data
export const mockAdminTokens: TokensApiModel = {
  accessToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzIiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzAzNTIwMDAwLCJleHAiOjE3MDM1MjM2MDB9.mock-admin-signature",
  refreshToken: "rt_admin_0987654321fedcba",
  tokenType: "Bearer",
  expiresIn: 3600,
  scope: ["read", "write", "secrets:manage", "admin:all"],
}

// Mock Device Info Data
export const mockDeviceInfo: DeviceInfoApiModel[] = [
  {
    browser: "Chrome",
    os: "Windows 10",
    device: "Desktop",
    isMobile: false,
  },
  {
    browser: "Safari",
    os: "iOS 17.2",
    device: "iPhone 15 Pro",
    isMobile: true,
  },
  {
    browser: "Firefox",
    os: "macOS Sonoma",
    device: "MacBook Pro",
    isMobile: false,
  },
]

// Mock Sessions Data
export const mockSessions: SessionApiModel[] = [
  {
    id: "session_1",
    userId: "user_1",
    deviceInfo: mockDeviceInfo[0],
    ipAddress: "192.168.1.100",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    createdAt: "2024-12-25T14:20:00Z",
    lastActiveAt: "2024-12-25T15:30:00Z",
    expiresAt: "2024-12-26T14:20:00Z",
    isActive: true,
    isCurrent: true, // Mark as current session
  },
  {
    id: "session_2",
    userId: "user_1",
    deviceInfo: mockDeviceInfo[1],
    ipAddress: "10.0.0.50",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
    createdAt: "2024-12-24T09:15:00Z",
    lastActiveAt: "2024-12-24T18:45:00Z",
    expiresAt: "2024-12-25T09:15:00Z",
    isActive: false,
    isCurrent: false,
  },
  {
    id: "session_3",
    userId: "user_1",
    deviceInfo: mockDeviceInfo[2],
    ipAddress: "203.0.113.45",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/115.0",
    createdAt: "2024-12-23T10:00:00Z",
    lastActiveAt: "2024-12-23T11:00:00Z",
    expiresAt: "2024-12-24T10:00:00Z",
    isActive: false,
    isCurrent: false,
  },
]

// Mock Credentials for Testing
export const mockCredentials = {
  validUser: {
    email: "test@example.com",
    password: "password123",
  },
  validAdmin: {
    email: "admin@example.com",
    password: "admin123",
  },
  invalidUser: {
    email: "invalid@example.com",
    password: "wrongpassword",
  },
}

// Mock API Delays (in milliseconds)
export const mockApiDelays = {
  login: 1200,
  register: 1500,
  logout: 500,
  refreshToken: 800,
  resetPassword: 1000,
  changePassword: 1200,
  getCurrentUser: 600,
  updateProfile: 1000,
}

// Mock Error Messages
export const mockErrorMessages = {
  invalidCredentials: "Invalid email or password",
  userNotFound: "User not found",
  emailAlreadyExists: "Email already exists",
  weakPassword: "Password must be at least 8 characters long",
  invalidToken: "Invalid or expired token",
  sessionExpired: "Session has expired",
  twoFactorRequired: "Two-factor authentication required",
  accountLocked: "Account has been locked due to multiple failed attempts",
  emailNotVerified: "Please verify your email address",
  networkError: "Network error occurred",
  serverError: "Internal server error",
}

// Mock Success Messages
export const mockSuccessMessages = {
  loginSuccess: "Successfully logged in",
  registerSuccess: "Account created successfully",
  logoutSuccess: "Successfully logged out",
  passwordChanged: "Password changed successfully",
  passwordResetSent: "Password reset email sent",
  profileUpdated: "Profile updated successfully",
  emailVerified: "Email verified successfully",
}

// Mock Validation Rules
export const mockValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: "Password must contain at least 8 characters with uppercase, lowercase, number and special character",
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: "Name must be between 2 and 50 characters",
  },
}
