"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ArrowLeft, Bot, User } from "lucide-react"

import { ProductComposer } from "@/components/products/product-composer"
import { ProductDraftPanel } from "@/components/products/product-draft-panel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  draftToProduct,
  extractProductDraft,
  findDuplicateProduct,
  type Product,
  type ProductDraft,
  type ProductFlowPhase,
} from "@/lib/mock-data"
import { addProduct, useProducts } from "@/lib/products-store"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  text: string
}

const emptyDraft: ProductDraft = {
  name: "",
  sku: "",
  family: "Filme stretch",
  unit: "kg",
  weightKg: "",
  description: "",
  notes: "",
}

export function NewProductFlow() {
  const router = useRouter()
  const catalog = useProducts()
  const [phase, setPhase] = useState<ProductFlowPhase>("empty")
  const [draft, setDraft] = useState<ProductDraft | null>(null)
  const [duplicate, setDuplicate] = useState<Product | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Descreva o produto em linguagem natural — ou anexe foto/PDF. Eu monto o rascunho para você revisar.",
    },
  ])
  const threadRef = useRef<HTMLDivElement>(null)
  const extractTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (extractTimer.current) clearTimeout(extractTimer.current)
    }
  }, [])

  useEffect(() => {
    const el = threadRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, phase])

  function resetFlow() {
    if (extractTimer.current) clearTimeout(extractTimer.current)
    setPhase("empty")
    setDraft(null)
    setDuplicate(null)
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        text: "Pronto para o próximo. Descreva o produto ou anexe um arquivo.",
      },
    ])
  }

  async function handlePrompt(prompt: string, attachmentName: string | null) {
    if (phase === "extracting") return

    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: attachmentName
          ? `${prompt}\n\n(Anexo: ${attachmentName})`
          : prompt,
      },
      {
        id: `assist-wait-${Date.now()}`,
        role: "assistant",
        text: "Analisando a descrição e montando o rascunho…",
      },
    ])
    setPhase("extracting")
    setDuplicate(null)

    await new Promise<void>((resolve) => {
      extractTimer.current = setTimeout(() => {
        const next = extractProductDraft(prompt, attachmentName)
        setDraft(next)
        setPhase("draft")
        setMessages((current) => [
          ...current,
          {
            id: `assist-done-${Date.now()}`,
            role: "assistant",
            text: `Sugeri “${next.name}” (${next.sku}). Revise o painel ao lado e confirme.`,
          },
        ])
        resolve()
      }, 1100)
    })
  }

  function confirmSave(force = false) {
    if (!draft) return

    const match = findDuplicateProduct(draft, catalog)
    if (match && !force) {
      setDuplicate(match)
      setPhase("duplicate")
      setMessages((current) => [
        ...current,
        {
          id: `dup-${Date.now()}`,
          role: "assistant",
          text: `Encontrei um possível duplicado: ${match.name} (${match.sku}). Ajuste o rascunho ou confirme mesmo assim.`,
        },
      ])
      return
    }

    const product = draftToProduct(draft, `prod-${Date.now()}`)
    addProduct(product)
    setPhase("saved")
    setDuplicate(null)
    setMessages((current) => [
      ...current,
      {
        id: `saved-${Date.now()}`,
        role: "assistant",
        text: `Pronto — “${product.name}” entrou no catálogo mock.`,
      },
    ])
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-slate-200/80 bg-white px-4 py-3 md:px-6">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            aria-label="Voltar ao catálogo"
            render={<Link href="/estoque/produtos" />}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-400">
              Estoque · Produtos
            </p>
            <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
              Novo produto com Alvo AI
            </h1>
          </div>
          {phase === "saved" ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => router.push("/estoque/produtos")}
            >
              Ver catálogo
            </Button>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-5 md:px-6 md:py-5">
          <section className="flex min-h-[22rem] flex-col rounded-xl bg-white shadow-sm ring-1 ring-slate-200/70 md:min-h-[28rem]">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-medium text-foreground">Conversa</p>
              <p className="text-xs text-slate-500">
                Entrada livre · extração simulada
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
          </section>

          <ProductDraftPanel
            phase={phase}
            draft={draft ?? emptyDraft}
            duplicate={duplicate}
            onChange={setDraft}
            onConfirm={() => confirmSave(false)}
            onForceSave={() => confirmSave(true)}
            onReset={resetFlow}
            onDismissDuplicate={() => {
              setPhase("draft")
              setDuplicate(null)
            }}
          />
        </div>
      </div>

      <div className="shrink-0 border-t border-slate-200/80 bg-slate-50/95 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <ProductComposer
            disabled={phase === "extracting" || phase === "saved"}
            onSubmitPrompt={handlePrompt}
          />
        </div>
      </div>
    </div>
  )
}
