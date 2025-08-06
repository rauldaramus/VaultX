"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { CreateSecretForm } from "@/features/secrets/components/CreateSecretForm"
import { Button } from "@/shared/components/ui/button"

function CreatePageHeader() {
  return (
    <header className="flex h-16 items-center border-b bg-background px-4 md:px-6">
      <div className="flex items-center justify-between w-full">
        <Link href="/home" className="flex items-center gap-2">
          <Lock className="h-6 w-6" />
          <span className="text-lg font-semibold">VaultX</span>
        </Link>
        <Button asChild variant="outline">
          <Link href="/home" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      </div>
    </header>
  )
}

function CreatePageFooter() {
  return (
    <footer className="border-t bg-background p-4 text-center text-sm text-muted-foreground">
      © VaultX 2025. All rights reserved.
    </footer>
  )
}

export default function CreateSecretPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <CreatePageHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="mx-auto max-w-2xl">
            <CreateSecretForm />
          </div>
        </div>
      </main>
      <CreatePageFooter />
    </div>
  )
}
