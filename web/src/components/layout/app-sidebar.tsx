"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  Factory,
  Home,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  Wallet,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { currentUser, navItems, type NavItem } from "@/lib/mock-data"

const iconMap: Record<
  NavItem["icon"],
  React.ComponentType<{ className?: string }>
> = {
  home: Home,
  sales: ShoppingBag,
  purchases: ShoppingCart,
  production: Factory,
  inventory: Package,
  finance: Wallet,
}

function AlvoLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("size-7", className)}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="1.75" fill="currentColor" />
    </svg>
  )
}

function matchesQuery(label: string, query: string) {
  return label.toLowerCase().includes(query.trim().toLowerCase())
}

type AppSidebarProps = {
  desktopCollapsed?: boolean
  mobileOpen?: boolean
  onNavigate?: () => void
  onClose?: () => void
}

export function AppSidebar({
  desktopCollapsed = false,
  mobileOpen = false,
  onNavigate,
  onClose,
}: AppSidebarProps) {
  const pathname = usePathname()
  const [query, setQuery] = useState("")
  const [openIds, setOpenIds] = useState<string[]>(() =>
    navItems
      .filter(
        (item) =>
          item.children?.some((child) =>
            child.href !== item.href
              ? pathname === child.href ||
                pathname.startsWith(`${child.href}/`)
              : pathname === child.href
          ) ?? false
      )
      .map((item) => item.id)
  )

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return navItems

    return navItems
      .map((item) => {
        const parentMatch = matchesQuery(item.label, q)
        const children =
          item.children?.filter((child) => matchesQuery(child.label, q)) ?? []

        if (parentMatch) return item
        if (children.length > 0) return { ...item, children }
        return null
      })
      .filter(Boolean) as NavItem[]
  }, [query])

  function toggle(id: string) {
    setOpenIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )
  }

  const searching = query.trim().length > 0

  function isChildActive(childHref: string, parentHref: string) {
    if (pathname === childHref) return true
    // Nested routes (ex.: /estoque/produtos/novo), sem ativar irmãos que
    // compartilham o href do pai (ex.: Saldos → /estoque).
    if (
      childHref !== parentHref &&
      pathname.startsWith(`${childHref}/`)
    ) {
      return true
    }
    return false
  }

  function isItemActive(item: NavItem) {
    if (item.children?.length) {
      return item.children.some((child) =>
        isChildActive(child.href, item.href)
      )
    }
    return item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`)
  }

  return (
    <aside
      className={cn(
        "flex h-full w-[min(288px,88vw)] shrink-0 flex-col border-r border-border/80 bg-white",
        "fixed inset-y-0 left-0 z-50 transition-transform duration-200",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        desktopCollapsed
          ? "md:hidden"
          : "md:static md:z-auto md:w-[260px] md:translate-x-0"
      )}
    >
      <div className="flex h-14 items-center gap-2.5 px-4 md:h-16 md:px-5">
        <AlvoLogo className="text-foreground" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-[15px] font-semibold tracking-tight text-foreground">
            alvo <span className="font-medium text-foreground/70">AI</span>
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9"
          aria-label="Esconder menu"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Buscar no menu..."
            aria-label="Buscar no menu"
            className="h-9 rounded-lg border-slate-200 bg-slate-50/80 pl-8 text-sm shadow-none"
          />
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-3">
        {filteredItems.map((item) => {
          const Icon = iconMap[item.icon]
          const hasChildren = Boolean(item.children?.length)
          const active = isItemActive(item)
          const open =
            searching || openIds.includes(item.id) || active

          return (
            <div key={item.id} className="space-y-0.5">
              <div className="flex items-center gap-0.5">
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex min-w-0 flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-blue-50 text-blue-800"
                      : "text-slate-500 hover:bg-blue-50/60 hover:text-blue-900"
                  )}
                >
                  <Icon className="size-[18px] shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
                {hasChildren ? (
                  <button
                    type="button"
                    aria-label={`${open ? "Recolher" : "Expandir"} ${item.label}`}
                    aria-expanded={open}
                    onClick={() => toggle(item.id)}
                    className="rounded-md p-2 text-slate-400 hover:bg-slate-50 hover:text-foreground"
                  >
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform",
                        open ? "rotate-0" : "-rotate-90"
                      )}
                    />
                  </button>
                ) : null}
              </div>

              {hasChildren && open ? (
                <div className="ml-4 space-y-0.5 border-l border-slate-200 pl-3">
                  {item.children!.map((child) => {
                    const childActive = isChildActive(child.href, item.href)
                    return (
                      <Link
                        key={child.id}
                        href={child.href}
                        onClick={onNavigate}
                        className={cn(
                          "block rounded-md px-2 py-1.5 text-sm transition-colors",
                          childActive
                            ? "bg-blue-50 font-medium text-blue-800"
                            : "text-slate-500 hover:bg-slate-50 hover:text-foreground"
                        )}
                      >
                        {child.label}
                      </Link>
                    )
                  })}
                </div>
              ) : null}
            </div>
          )
        })}

        {filteredItems.length === 0 ? (
          <p className="px-3 py-4 text-sm text-slate-400">Nenhum item encontrado.</p>
        ) : null}
      </nav>

      <div className="border-t border-border/80 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar>
            <AvatarFallback className="bg-blue-800 text-[11px] font-semibold text-white">
              {currentUser.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-foreground">
              {currentUser.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {currentUser.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
