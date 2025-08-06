"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/shared/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { cn } from "@/shared/lib/utils"

// Route configuration for breadcrumb labels and icons
const routeConfig = {
  "/home": { label: "Dashboard", icon: Home },
  "/secrets": { label: "My Secrets" },
  "/secrets/create": { label: "Create Secret" },
  "/secrets/[id]": { label: "Secret Details" },
  "/secrets/[id]/edit": { label: "Edit Secret" },
  "/security": { label: "Security" },
  "/security/settings": { label: "Settings" },
  "/security/audit": { label: "Audit Log" },
  "/api": { label: "API Management" },
  "/api/tokens": { label: "API Tokens" },
  "/api/usage": { label: "Usage Analytics" },
  "/demo": { label: "Demo Experience" },
  "/demo/playground": { label: "Playground" },
  "/settings": { label: "Settings" },
  "/settings/account": { label: "Account" },
  "/settings/security": { label: "Security Settings" },
  "/settings/billing": { label: "Billing" },
  "/settings/team": { label: "Team Management" },
} as const

type BreadcrumbItemType = {
  label: string
  href: string
  isActive: boolean
  icon?: React.ComponentType<{ className?: string }>
}

function generateBreadcrumbItems(pathname: string): BreadcrumbItemType[] {
  const segments = pathname.split("/").filter(Boolean)
  const items: BreadcrumbItemType[] = []

  // Always start with Dashboard as root
  items.push({
    label: "Dashboard",
    href: "/home",
    isActive: pathname === "/home",
    icon: Home,
  })

  // Build breadcrumb items from path segments
  let currentPath = ""

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1

    // Skip the first segment if it's 'home' since we already added Dashboard
    if (segment === "home" && index === 0) return

    // Get route configuration
    const routeKey = currentPath
    let label = segment

    // Check for exact match first
    if (routeConfig[routeKey as keyof typeof routeConfig]) {
      label = routeConfig[routeKey as keyof typeof routeConfig].label
    } else {
      // Check for dynamic route patterns
      const dynamicRouteKey = currentPath.replace(/\/[^/]+$/, "/[id]")
      if (routeConfig[dynamicRouteKey as keyof typeof routeConfig]) {
        label = routeConfig[dynamicRouteKey as keyof typeof routeConfig].label
      } else {
        // Fallback: capitalize and format segment
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

  return items
}

interface DynamicBreadcrumbProps {
  className?: string
  maxItems?: number
}

export function DynamicBreadcrumb({ className, maxItems = 3 }: DynamicBreadcrumbProps) {
  const pathname = usePathname()
  const items = generateBreadcrumbItems(pathname)

  // Handle collapsed breadcrumbs for mobile/long paths
  const shouldCollapse = items.length > maxItems
  const visibleItems = shouldCollapse
    ? [items[0], ...items.slice(-2)] // Show first item and last 2 items
    : items
  const hiddenItems = shouldCollapse
    ? items.slice(1, -2) // Hidden items between first and last 2
    : []

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {visibleItems.map((item, index) => {
          const isFirst = index === 0
          const isLast = item.isActive
          const showEllipsis = shouldCollapse && index === 1 && hiddenItems.length > 0

          return (
            <div key={item.href} className="flex items-center">
              {/* Show ellipsis dropdown for collapsed items */}
              {showEllipsis && (
                <>
                  <BreadcrumbItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center">
                        <BreadcrumbEllipsis className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {hiddenItems.map((hiddenItem) => (
                          <DropdownMenuItem key={hiddenItem.href} asChild>
                            <Link href={hiddenItem.href} className="cursor-pointer">
                              <span>{hiddenItem.label}</span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}

              {/* Regular breadcrumb item */}
              {!showEllipsis && (
                <BreadcrumbItem className={cn(isFirst && "hidden sm:block")}>
                  {isLast ? (
                    <BreadcrumbPage className="flex items-center gap-1.5">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span className="truncate">{item.label}</span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={item.href}
                        className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                      >
                        <span className="flex items-center gap-1.5">
                          {item.icon && <item.icon className="h-4 w-4" />}
                          <span className="truncate">{item.label}</span>
                        </span>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              )}

              {/* Separator */}
              {!isLast && (
                <BreadcrumbSeparator className={cn(isFirst && "hidden sm:block")}>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
