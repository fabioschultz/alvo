import { ChatComposer } from "@/components/home/chat-composer"
import { HomeGreeting } from "@/components/home/home-greeting"
import { InsightsGrid } from "@/components/home/insights-grid"
import { KpiCards } from "@/components/home/kpi-cards"

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col gap-6 px-6 py-6 pb-8">
      <HomeGreeting />
      <KpiCards />
      <InsightsGrid />
      <div className="mt-auto">
        <ChatComposer />
      </div>
    </div>
  )
}
