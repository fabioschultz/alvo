"use client"

import { useEffect, useState } from "react"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppTopbar } from "@/components/layout/app-topbar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    if (!mobileNavOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileNavOpen])

  function toggleNav() {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
      setDesktopCollapsed((current) => !current)
      return
    }
    setMobileNavOpen((current) => !current)
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50 text-foreground">
      {mobileNavOpen ? (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/35 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <AppSidebar
        desktopCollapsed={desktopCollapsed}
        mobileOpen={mobileNavOpen}
        onNavigate={() => setMobileNavOpen(false)}
        onClose={() => {
          setMobileNavOpen(false)
          setDesktopCollapsed(true)
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar onToggleNav={toggleNav} />
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  )
}
