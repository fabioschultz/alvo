"use client"

import { useMemo, useState } from "react"
import { ChevronRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  InsightDetailDialog,
  insightIconMap,
  priorityClass,
  priorityLabel,
  toneClass,
} from "@/components/home/insight-detail-dialog"
import { cn } from "@/lib/utils"
import { insights, type Insight } from "@/lib/mock-data"

export function InsightsGrid() {
  const [selected, setSelected] = useState<Insight | null>(null)

  const highPriorityCount = useMemo(
    () => insights.filter((insight) => insight.priority === "alta").length,
    []
  )

  return (
    <section aria-labelledby="insights-heading">
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm ring-1 ring-zinc-100 md:p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2
              id="insights-heading"
              className="text-base font-semibold tracking-tight text-foreground"
            >
              Insights de hoje
              <span className="ml-1.5 font-medium text-zinc-400">
                · {insights.length}
              </span>
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              {highPriorityCount} alta prioridade
            </p>
          </div>
        </div>

        <div className="grid gap-1.5 sm:grid-cols-2">
          {insights.map((insight) => {
            const Icon = insightIconMap[insight.icon]
            return (
              <button
                key={insight.id}
                type="button"
                onClick={() => setSelected(insight)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left",
                  "bg-zinc-50/80 ring-1 ring-zinc-200/70 transition-colors",
                  "hover:bg-zinc-100/90 hover:ring-zinc-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    toneClass[insight.tone]
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {insight.title}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 rounded-full border px-2 py-0 text-[11px] font-medium",
                    priorityClass[insight.priority]
                  )}
                >
                  {priorityLabel[insight.priority]}
                </Badge>
                <ChevronRight className="size-4 shrink-0 text-zinc-300 transition-colors group-hover:text-zinc-500" />
              </button>
            )
          })}
        </div>
      </div>

      <InsightDetailDialog
        insight={selected}
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />
    </section>
  )
}
