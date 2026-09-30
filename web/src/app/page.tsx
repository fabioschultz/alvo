import { ChatComposer } from "@/components/home/chat-composer"
import { HomeGreeting } from "@/components/home/home-greeting"
import { InsightsGrid } from "@/components/home/insights-grid"
import { KpiCards } from "@/components/home/kpi-cards"

export default function HomePage() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6">
          <HomeGreeting />
          <KpiCards />
          <InsightsGrid />
        </div>
      </div>

      <div className="shrink-0 border-t border-slate-200/80 bg-slate-50/95 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <ChatComposer />
        </div>
      </div>
    </div>
  )
}
