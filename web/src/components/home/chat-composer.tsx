"use client"

import { FormEvent, useRef, useState } from "react"
import { Bot, Mic, Paperclip, SendHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type ChatComposerProps = {
  /** Callback preparado para integração futura (Genkit). */
  onSubmitPrompt?: (prompt: string) => void | Promise<void>
}

export function ChatComposer({ onSubmitPrompt }: ChatComposerProps) {
  const [value, setValue] = useState("")
  const [status, setStatus] = useState<"idle" | "queued">("idle")
  const [attachmentName, setAttachmentName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const prompt = value.trim()
    if (!prompt) return

    setStatus("queued")
    try {
      await onSubmitPrompt?.(prompt)
    } finally {
      setValue("")
      setAttachmentName(null)
      setStatus("idle")
    }
  }

  return (
    <TooltipProvider delay={200}>
      <section aria-label="Composer Alvo AI">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] md:p-2"
        >
          <div className="flex items-center gap-1 md:gap-1.5">
            <div className="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 sm:flex">
              <Bot className="size-5" aria-hidden />
            </div>
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Pergunte ao Alvo AI..."
              aria-label="Pergunte ao Alvo AI"
              className="h-10 min-w-0 flex-1 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0 md:h-11"
              disabled={status === "queued"}
            />

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              aria-hidden
              tabIndex={-1}
              onChange={(event) => {
                const file = event.target.files?.[0]
                setAttachmentName(file ? file.name : null)
              }}
            />

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 rounded-xl text-slate-500 md:size-10"
                    aria-label="Anexar arquivo"
                    disabled={status === "queued"}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="size-4" />
                  </Button>
                }
              />
              <TooltipContent>Anexos</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 rounded-xl text-slate-500 md:size-10"
                    aria-label="Áudio"
                    disabled={status === "queued"}
                    onClick={() =>
                      setValue((current) =>
                        current
                          ? current
                          : "Transcrição de áudio (mock) — integração futura."
                      )
                    }
                  >
                    <Mic className="size-4" />
                  </Button>
                }
              />
              <TooltipContent>Áudio</TooltipContent>
            </Tooltip>

            <Button
              type="submit"
              size="icon"
              className="size-9 shrink-0 rounded-xl md:size-10"
              disabled={!value.trim() || status === "queued"}
              aria-label="Enviar pergunta"
            >
              <SendHorizontal className="size-4" />
            </Button>
          </div>
          <p className="mt-0.5 hidden px-2 pb-1 text-[11px] text-slate-400 sm:block">
            {attachmentName
              ? `Anexo selecionado: ${attachmentName} (mock — upload real depois).`
              : "Protótipo — respostas reais do AI ainda não estão conectadas."}
          </p>
          {attachmentName ? (
            <p className="truncate px-2 pb-1 text-[11px] text-slate-400 sm:hidden">
              Anexo: {attachmentName}
            </p>
          ) : null}
        </form>
      </section>
    </TooltipProvider>
  )
}
