"use client"

import {
  ArrowUpRight,
  Clock3,
  Package,
  Receipt,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  type Insight,
  type InsightAction,
  type InsightPriority,
} from "@/lib/mock-data"

const priorityLabel: Record<InsightPriority, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
}

const priorityClass: Record<InsightPriority, string> = {
  alta: "bg-rose-50 text-rose-700 border-rose-100",
  media: "bg-amber-50 text-amber-700 border-amber-100",
  baixa: "bg-emerald-50 text-emerald-700 border-emerald-100",
}

const toneClass: Record<Insight["tone"], string> = {
  red: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-sky-50 text-sky-600",
  green: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
  rose: "bg-rose-50 text-rose-600",
}

export const insightIconMap: Record<
  Insight["icon"],
  React.ComponentType<{ className?: string }>
> = {
  clock: Clock3,
  package: Package,
  "trend-down": TrendingDown,
  users: Users,
  "trending-up": TrendingUp,
  receipt: Receipt,
}

function DetailChart({
  series,
  label,
}: {
  series: Insight["detail"]["series"]
  label: string
}) {
  const max = Math.max(...series.map((point) => point.value), 1)
  const height = 140
  const width = 420
  const padX = 16
  const padY = 12
  const step = series.length > 1 ? (width - padX * 2) / (series.length - 1) : 0

  const points = series
    .map((point, index) => {
      const x = padX + index * step
      const y = height - padY - (point.value / max) * (height - padY * 2)
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3">
      <p className="mb-2 text-xs font-medium text-zinc-500">{label}</p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-36 w-full"
        role="img"
        aria-label={label}
      >
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="text-sky-600"
        />
        {series.map((point, index) => {
          const x = padX + index * step
          const y = height - padY - (point.value / max) * (height - padY * 2)
          return (
            <g key={`${point.label}-${index}`}>
              <circle cx={x} cy={y} r="3.5" className="fill-sky-600" />
              <text
                x={x}
                y={height - 2}
                textAnchor="middle"
                className="fill-zinc-400 text-[10px]"
              >
                {point.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function ActionCard({ action }: { action: InsightAction }) {
  const styles =
    action.intent === "primary"
      ? "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800"
      : action.intent === "secondary"
        ? "border-zinc-200 bg-white hover:bg-zinc-50"
        : "border-dashed border-zinc-300 bg-zinc-50/80 hover:bg-zinc-100"

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-start gap-2 rounded-xl border p-3 text-left transition-colors",
        styles
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{action.label}</p>
        <p
          className={cn(
            "mt-0.5 text-xs leading-snug",
            action.intent === "primary" ? "text-zinc-300" : "text-zinc-500"
          )}
        >
          {action.description}
        </p>
      </div>
      <ArrowUpRight className="mt-0.5 size-4 shrink-0 opacity-70" />
    </button>
  )
}

type InsightDetailDialogProps = {
  insight: Insight | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InsightDetailDialog({
  insight,
  open,
  onOpenChange,
}: InsightDetailDialogProps) {
  if (!insight) return null

  const Icon = insightIconMap[insight.icon]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3 pr-8">
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl",
                toneClass[insight.tone]
              )}
            >
              <Icon className="size-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-lg">{insight.title}</DialogTitle>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full border px-2 py-0 text-[11px] font-medium",
                    priorityClass[insight.priority]
                  )}
                >
                  {priorityLabel[insight.priority]}
                </Badge>
              </div>
              <DialogDescription>{insight.detail.summary}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-3">
          {insight.detail.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5"
            >
              <p className="text-xs text-zinc-500">{metric.label}</p>
              <p className="mt-1 text-base font-semibold tracking-tight">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <DetailChart
          series={insight.detail.series}
          label={insight.detail.seriesLabel}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              Próximas ações
            </h3>
            <p className="text-xs text-zinc-400">Até 3 cards por insight</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {insight.detail.actions.slice(0, 3).map((action) => (
              <ActionCard key={action.id} action={action} />
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { priorityClass, priorityLabel, toneClass }
