import {
  Clock3,
  Package,
  Receipt,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  insights,
  type Insight,
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

const iconMap: Record<
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

export function InsightsGrid() {
  return (
    <section aria-labelledby="insights-heading" className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2
          id="insights-heading"
          className="text-base font-semibold tracking-tight text-foreground"
        >
          Insights de hoje
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {insights.map((insight) => {
          const Icon = iconMap[insight.icon]
          return (
            <Card
              key={insight.id}
              className="border-0 bg-white shadow-sm ring-1 ring-zinc-200/70 transition-shadow hover:shadow-md"
            >
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
          )
        })}
      </div>
    </section>
  )
}
