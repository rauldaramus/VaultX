"use client"

import { usePathname } from "next/navigation"
import { useMemo } from "react"

interface BreadcrumbItem {
  label: string
  href: string
  isActive: boolean
}

// Extended route configuration with metadata
const routeMetadata = {
  "/home": {
    label: "Dashboard",
    description: "Overview of your vault activity",
    category: "main",
  },
  "/secrets": {
    label: "My Secrets",
    description: "Manage your encrypted secrets",
    category: "secrets",
  },
  "/secrets/create": {
    label: "Create Secret",
    description: "Add a new secret to your vault",
    category: "secrets",
  },
  "/secrets/[id]": {
    label: "Secret Details",
    description: "View and manage secret",
    category: "secrets",
  },
  "/secrets/[id]/edit": {
    label: "Edit Secret",
    description: "Modify secret information",
    category: "secrets",
  },
  "/security": {
    label: "Security",
    description: "Security settings and monitoring",
    category: "security",
  },
  "/security/settings": {
    label: "Security Settings",
    description: "Configure security preferences",
    category: "security",
  },
  "/security/audit": {
    label: "Audit Log",
    description: "View security audit trail",
    category: "security",
  },
  "/api": {
    label: "API Management",
    description: "Manage API access and tokens",
    category: "api",
  },
  "/api/tokens": {
    label: "API Tokens",
    description: "Create and manage API tokens",
    category: "api",
  },
  "/api/usage": {
    label: "Usage Analytics",
    description: "View API usage statistics",
    category: "api",
  },
  "/demo": {
    label: "Demo Experience",
    description: "Interactive demo and tutorials",
    category: "demo",
  },
  "/demo/playground": {
    label: "Playground",
    description: "Test features in a safe environment",
    category: "demo",
  },
  "/settings": {
    label: "Settings",
    description: "Account and application settings",
    category: "settings",
  },
  "/settings/account": {
    label: "Account Settings",
    description: "Manage your account information",
    category: "settings",
  },
  "/settings/security": {
    label: "Security Settings",
    description: "Configure security preferences",
    category: "settings",
  },
  "/settings/billing": {
    label: "Billing",
    description: "Manage subscription and billing",
    category: "settings",
  },
  "/settings/team": {
    label: "Team Management",
    description: "Manage team members and permissions",
    category: "settings",
  },
} as const

export function useBreadcrumb() {
  const pathname = usePathname()

  const breadcrumbData = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean)
    const items: BreadcrumbItem[] = []

    // Always include Dashboard as root
    items.push({
      label: "Dashboard",
      href: "/home",
      isActive: pathname === "/home",
    })

    let currentPath = ""

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1

      // Skip home segment since we already added Dashboard
      if (segment === "home" && index === 0) return

      // Get route metadata
      const routeKey = currentPath
      let label = segment
      let description = ""

      // Check for exact match
      if (routeMetadata[routeKey as keyof typeof routeMetadata]) {
        const metadata = routeMetadata[routeKey as keyof typeof routeMetadata]
        label = metadata.label
        description = metadata.description
      } else {
        // Check for dynamic route patterns
        const dynamicRouteKey = currentPath.replace(/\/[^/]+$/, "/[id]")
        if (routeMetadata[dynamicRouteKey as keyof typeof routeMetadata]) {
          const metadata = routeMetadata[dynamicRouteKey as keyof typeof routeMetadata]
          label = metadata.label
          description = metadata.description
        } else {
          // Fallback formatting
          label = segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        }
      }

      items.push({
        label,
        href: currentPath,
        isActive: isLast,
      })
    })

    return {
      items,
      currentPage: items[items.length - 1],
      parentPage: items.length > 1 ? items[items.length - 2] : null,
    }
  }, [pathname])

  return breadcrumbData
}
