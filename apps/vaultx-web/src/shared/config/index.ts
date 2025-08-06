export const APP_CONFIG = {
  name: "VaultX",
  description: "Secure secret management platform",
  version: "1.0.0",
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
    timeout: 10000,
  },
  auth: {
    tokenKey: "vaultx_token",
    refreshTokenKey: "vaultx_refresh_token",
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  },
} as const

export const ROUTES = {
  public: {
    home: "/",
    login: "/login",
  },
  dashboard: {
    home: "/home",
    secrets: "/secrets",
    security: "/security",
    api: "/api",
    demo: "/demo",
    settings: "/settings",
  },
} as const
