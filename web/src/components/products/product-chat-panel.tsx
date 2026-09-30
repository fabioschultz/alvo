"use client"

import { useEffect, useRef } from "react"
import { Bot, User } from "lucide-react"

import { ProductComposer } from "@/components/products/product-composer"
import { cn } from "@/lib/utils"

export type ProductChatMessage = {
  id: string
  role: "user" | "assistant"
  text: string
}

type ProductChatPanelProps = {
  messages: ProductChatMessage[]
  disabled?: boolean
  onSubmitPrompt: (
    prompt: string,
    attachmentName: string | null
  ) => void | Promise<void>
}

export function ProductChatPanel({
  messages,
  disabled = false,
  onSubmitPrompt,
}: ProductChatPanelProps) {
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = threadRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages])

  return (
    <section
      aria-label="Copiloto Alvo AI"
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/70"
    >
      <div className="shrink-0 border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-medium text-foreground">Alvo AI</p>
        <p className="text-xs text-slate-500">
          Descreva o produto — eu preencho o formulário ao lado.
        </p>
      </div>

      <div
        ref={threadRef}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-2.5",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" ? (
              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Bot className="size-3.5" aria-hidden />
              </div>
            ) : null}
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                message.role === "user"
                  ? "bg-blue-700 text-white"
                  : "bg-slate-50 text-slate-700 ring-1 ring-slate-100"
              )}
            >
              {message.text}
            </div>
            {message.role === "user" ? (
              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <User className="size-3.5" aria-hidden />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="shrink-0 border-t border-slate-100 p-3">
        <ProductComposer
          disabled={disabled}
          placeholder="Descreva o produto…"
          onSubmitPrompt={onSubmitPrompt}
        />
      </div>
    </section>
  )
}
