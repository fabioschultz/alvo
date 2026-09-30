"use client"

import {
  Bell,
  ChevronDown,
  CreditCard,
  FileText,
  ListChecks,
  Menu,
  Plus,
  Search,
  Settings,
  Wallet,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { currentUser, shortcuts } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const shortcutIcon = {
  file: FileText,
  list: ListChecks,
  card: CreditCard,
  currency: Wallet,
  plus: Plus,
} as const

type AppTopbarProps = {
  onOpenNav?: () => void
}

export function AppTopbar({ onOpenNav }: AppTopbarProps) {
  return (
    <TooltipProvider delay={200}>
      <header className="shrink-0 border-b border-border/80 bg-white">
        <div className="flex h-14 items-center gap-2 px-3 md:h-16 md:gap-4 md:px-6">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 md:hidden"
            aria-label="Abrir menu"
            onClick={onOpenNav}
          >
            <Menu className="size-5" />
          </Button>

          <div className="relative min-w-0 flex-1 md:max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="h-9 rounded-xl border-zinc-200 bg-zinc-50/80 pl-9 text-sm shadow-none md:h-10"
              aria-label="Buscar produtos, clientes, pedidos"
            />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1">
            <div
              className="hidden items-center gap-0.5 rounded-xl border border-zinc-200 bg-zinc-50/60 px-1.5 py-1 md:flex"
              aria-label="Atalhos do ERP"
            >
              <span className="hidden px-1.5 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase lg:inline">
                Atalhos
              </span>
              {shortcuts.map((item) => {
                const Icon = shortcutIcon[item.icon]
                const isCreate = item.id === "new"
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger
                      render={
                        <Button
                          variant={isCreate ? "default" : "ghost"}
                          size="icon"
                          className={cn(
                            "size-8",
                            isCreate
                              ? "rounded-lg"
                              : "text-zinc-600 hover:text-foreground"
                          )}
                          aria-label={item.label}
                          type="button"
                        >
                          <Icon className="size-4" />
                        </Button>
                      }
                    />
                    <TooltipContent side="bottom">{item.label}</TooltipContent>
                  </Tooltip>
                )
              })}
            </div>

            <Button
              variant="default"
              size="icon"
              className="size-9 rounded-xl md:hidden"
              aria-label="Novo"
              type="button"
            >
              <Plus className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hidden size-9 text-zinc-500 sm:inline-flex"
              aria-label="Notificações"
              type="button"
            >
              <Bell className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden size-9 text-zinc-500 md:inline-flex"
              aria-label="Configurações"
              type="button"
            >
              <Settings className="size-4" />
            </Button>

            <button
              type="button"
              className={cn(
                "ml-0.5 flex items-center gap-2 rounded-full border border-zinc-200 py-1 pr-1.5 pl-1 md:pr-2",
                "hover:bg-zinc-50 transition-colors"
              )}
              aria-label={`Conta ${currentUser.workspace}`}
            >
              <Avatar size="sm">
                <AvatarFallback className="bg-zinc-900 text-[10px] font-semibold text-white">
                  {currentUser.initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-foreground lg:inline">
                {currentUser.workspace}
              </span>
              <ChevronDown className="hidden size-3.5 text-zinc-400 sm:block" />
            </button>
          </div>
        </div>

        <div
          className="flex gap-1 overflow-x-auto border-t border-zinc-100 px-3 py-1.5 md:hidden"
          aria-label="Atalhos do ERP"
        >
          {shortcuts.map((item) => {
            const Icon = shortcutIcon[item.icon]
            const isCreate = item.id === "new"
            return (
              <Button
                key={item.id}
                type="button"
                variant={isCreate ? "default" : "outline"}
                size="sm"
                className="h-8 shrink-0 gap-1.5 rounded-full px-3"
                aria-label={item.label}
              >
                <Icon className="size-3.5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            )
          })}
        </div>
      </header>
    </TooltipProvider>
  )
}
