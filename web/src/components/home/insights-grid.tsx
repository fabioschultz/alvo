"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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

  return (
    <section aria-labelledby="insights-heading" className="space-y-3">
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm ring-1 ring-zinc-100 md:p-5">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2
              id="insights-heading"
              className="text-base font-semibold tracking-tight text-foreground"
            >
              Insights de hoje
            </h2>
            <p className="text-sm text-zinc-500">
              Clique em um card para abrir o detalhe com evidências e ações.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {insights.map((insight) => {
            const Icon = insightIconMap[insight.icon]
            return (
              <button
                key={insight.id}
                type="button"
                onClick={() => setSelected(insight)}
                className="rounded-xl text-left transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card className="h-full border-0 bg-zinc-50/80 shadow-none ring-1 ring-zinc-200/80 transition-shadow hover:shadow-md">
                  <CardContent className="flex items-start gap-3 pt-1">
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl",
                        toneClass[insight.tone]
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold leading-snug text-foreground">
                          {insight.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={cn(
                            "shrink-0 rounded-full border px-2 py-0 text-[11px] font-medium",
                            priorityClass[insight.priority]
                          )}
                        >
                          {priorityLabel[insight.priority]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm leading-snug text-zinc-500">
                        {insight.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
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
