"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./useAuth"

export function useAuthHelpers() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuth()

  const redirectToLogin = useCallback(() => {
    router.push("/login")
  }, [router])

  const redirectToDashboard = useCallback(() => {
    router.push("/home")
  }, [router])

  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      redirectToLogin()
      return false
    }
    return true
  }, [isAuthenticated, redirectToLogin])

  const handleLogoutAndRedirect = useCallback(async () => {
    await logout()
    redirectToLogin()
  }, [logout, redirectToLogin])

  return {
    redirectToLogin,
    redirectToDashboard,
    requireAuth,
    handleLogoutAndRedirect,
  }
}
