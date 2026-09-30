import { formatLongDate, kpis } from "@/lib/mock-data"

type HomeGreetingProps = {
  now?: Date
}

export function HomeGreeting({ now = new Date() }: HomeGreetingProps) {
  const dateLabel = formatLongDate(now)

  return (
    <header className="space-y-1">
      <p className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
        Cockpit operacional
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]">
        Seu dia na Alvo
      </h1>
      <p className="text-sm text-zinc-500">
        {kpis.length} indicadores principais
        <span className="mx-1.5 text-zinc-300">·</span>
        <span className="capitalize">{dateLabel}</span>
      </p>
    </header>
  )
}
