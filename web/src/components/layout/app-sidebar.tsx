"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Factory,
  Home,
  Package,
  ShoppingBag,
  ShoppingCart,
  Wallet,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { currentUser, navItems, type NavItem } from "@/lib/mock-data"

const iconMap: Record<NavItem["icon"], React.ComponentType<{ className?: string }>> = {
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

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-border/80 bg-white">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <AlvoLogo className="text-foreground" />
        <div className="leading-tight">
          <p className="text-[15px] font-semibold tracking-tight text-foreground">
            alvo <span className="font-medium text-foreground/70">AI</span>
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 pt-2">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon]
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-zinc-100 text-foreground"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-foreground"
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border/80 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar>
            <AvatarFallback className="bg-zinc-900 text-[11px] font-semibold text-white">
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
