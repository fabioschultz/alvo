"use client"

import {
  Bell,
  ChevronDown,
  CreditCard,
  FileText,
  ListChecks,
  Plus,
  Search,
  Settings,
  Wallet,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { currentUser, shortcuts } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const shortcutIcon = {
  file: FileText,
  list: ListChecks,
  card: CreditCard,
  currency: Wallet,
  plus: Plus,
} as const

export function AppTopbar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border/80 bg-white px-6">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
        <Input
          type="search"
          placeholder="Buscar produtos, clientes, pedidos..."
          className="h-10 rounded-xl border-zinc-200 bg-zinc-50/80 pl-9 text-sm shadow-none"
          aria-label="Buscar"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <div className="mr-2 hidden items-center gap-1 lg:flex">
          <span className="mr-1 text-xs font-medium tracking-wide text-zinc-400 uppercase">
            Atalhos
          </span>
          {shortcuts.map((item) => {
            const Icon = shortcutIcon[item.icon]
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="icon"
                className="size-9 text-zinc-500"
                aria-label={item.label}
                type="button"
              >
                <Icon className="size-4" />
              </Button>
            )
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-zinc-500"
          aria-label="Notificações"
          type="button"
        >
          <Bell className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-zinc-500"
          aria-label="Configurações"
          type="button"
        >
          <Settings className="size-4" />
        </Button>

        <button
          type="button"
          className={cn(
            "ml-1 flex items-center gap-2 rounded-full border border-zinc-200 py-1 pr-2 pl-1",
            "hover:bg-zinc-50 transition-colors"
          )}
          aria-label={`Conta ${currentUser.workspace}`}
        >
          <Avatar>
            <AvatarFallback className="bg-zinc-900 text-[11px] font-semibold text-white">
              {currentUser.initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium text-foreground sm:inline">
            {currentUser.workspace}
          </span>
          <ChevronDown className="size-3.5 text-zinc-400" />
        </button>
      </div>
    </header>
  )
}
