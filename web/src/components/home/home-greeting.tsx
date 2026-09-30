import {
  currentUser,
  formatLongDate,
  greetingForHour,
} from "@/lib/mock-data"

type HomeGreetingProps = {
  now?: Date
}

export function HomeGreeting({ now = new Date() }: HomeGreetingProps) {
  const greeting = greetingForHour(now.getHours())
  const dateLabel = formatLongDate(now)

  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]">
        {greeting}, {currentUser.firstName}
      </h1>
      <p className="text-sm capitalize text-zinc-500">{dateLabel}</p>
    </header>
  )
}
