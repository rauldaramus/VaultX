"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Lock, KeyRound, Code, Settings, User, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { useAuth } from "@/features/auth/hooks/useAuth"

const navItems = [
  { href: "/home", label: "Dashboard", icon: LayoutDashboard },
  { href: "/secrets", label: "My Secrets", icon: Lock },
  { href: "/security", label: "Security", icon: KeyRound },
  { href: "/api", label: "API", icon: Code },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/") // Redirects to root, which will then redirect to /login
  }

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="overflow-x-hidden opacity-100 border-white border-solid rounded-none border-0"
    >
      <SidebarHeader className="overflow-hidden">
        <div className="flex items-center justify-between p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="overflow-hidden">
                <Link href="/home">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
                      <Lock className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                      <span className="truncate font-semibold">VaultX</span>
                      <span className="truncate text-xs">Secure Secrets</span>
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {/* Trigger visible when expanded */}
          <div className="group-data-[collapsible=icon]:hidden">
            <SidebarTrigger className="-ml-1" />
          </div>
        </div>
        {/* Trigger visible when collapsed - centered */}
        <div className="hidden group-data-[collapsible=icon]:flex justify-center p-2">
          <SidebarTrigger className="h-8 w-8" />
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label} className="overflow-hidden">
                      <Link href={item.href}>
                        <div className="flex items-center gap-2 min-w-0 w-full">
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate flex-1">{item.label}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="overflow-x-hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground overflow-hidden"
                >
                  <div className="flex w-full items-center gap-2 min-w-0">
                    <Avatar className="h-8 w-8 rounded-lg flex-shrink-0">
                      <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                        {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                      <span className="truncate font-semibold">{user?.name || 'User'}</span>
                      <span className="truncate text-xs">{user?.email || 'user@example.com'}</span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <div className="flex items-center w-full min-w-0">
                    <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate flex-1">Log out</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
