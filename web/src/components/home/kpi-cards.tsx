"use client"

import {
  AlertTriangle,
  Factory,
  Settings2,
  TrendingUp,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { kpis, type KpiCard, type KpiTone } from "@/lib/mock-data"

const toneStyles: Record<
  KpiTone,
  { wrap: string; icon: string; spark: string }
> = {
  green: {
    wrap: "bg-emerald-50 text-emerald-600",
    icon: "text-emerald-600",
    spark: "stroke-emerald-500",
  },
  orange: {
    wrap: "bg-orange-50 text-orange-600",
    icon: "text-orange-600",
    spark: "stroke-orange-500",
  },
  blue: {
    wrap: "bg-sky-50 text-sky-600",
    icon: "text-sky-600",
    spark: "stroke-sky-500",
  },
}

const iconMap: Record<
  KpiCard["icon"],
  React.ComponentType<{ className?: string }>
> = {
  factory: Factory,
  alert: AlertTriangle,
  wallet: Wallet,
}

function Sparkline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 24" className={cn("h-8 w-16", className)} aria-hidden>
      <path
        d="M2 18 C10 16, 14 8, 22 10 S34 20, 42 12 S54 4, 62 8"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        className={className}
      />
    </svg>
  )
}

export function KpiCards() {
  return (
    <TooltipProvider delay={200}>
      <section aria-label="Indicadores" className="grid gap-4 md:grid-cols-3">
        {kpis.map((kpi) => {
          const Icon = iconMap[kpi.icon]
          const tone = toneStyles[kpi.tone]

          return (
            <Card
              key={kpi.id}
              className="relative border-0 bg-white shadow-sm ring-1 ring-zinc-200/70"
            >
              <CardContent className="flex items-start justify-between gap-3 pt-1">
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-zinc-500">{kpi.label}</p>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            className="size-6 text-zinc-400 hover:text-foreground"
                            aria-label={`Configurar ${kpi.label}`}
                          >
                            <Settings2 className="size-3.5" />
                          </Button>
                        }
                      />
                      <TooltipContent>Configurar indicador</TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                    {kpi.value}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
                    <TrendingUp className="size-3.5 text-emerald-500" />
                    {kpi.delta}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl",
                      tone.wrap
                    )}
                  >
                    <Icon className={cn("size-5", tone.icon)} />
                  </div>
                  {kpi.tone !== "orange" ? (
                    <Sparkline className={tone.spark} />
                  ) : null}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>
    </TooltipProvider>
  )
}
