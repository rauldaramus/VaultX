import Link from "next/link"

export function DashboardFooter() {
  return (
    <footer className="border-t px-4 py-3 text-xs text-muted-foreground">
      <div className="flex items-center justify-between">
        <span>© VaultX 2025 All rights reserved.</span>
        <div className="flex items-center gap-3">
          <Link href="#" className="hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            API
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  )
}
