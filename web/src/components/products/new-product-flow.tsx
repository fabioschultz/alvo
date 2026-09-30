"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"
import { ArrowLeft } from "lucide-react"

import {
  ProductChatPanel,
  type ProductChatMessage,
} from "@/components/products/product-chat-panel"
import { ProductForm } from "@/components/products/product-form"
import { Button } from "@/components/ui/button"
import {
  draftToProduct,
  extractProductDraft,
  findDuplicateProduct,
  type Product,
  type ProductDraft,
  type ProductFlowPhase,
} from "@/lib/mock-data"
import {
  addProduct,
  getProductById,
  updateProduct,
  useProducts,
} from "@/lib/products-store"

const emptyDraft: ProductDraft = {
  name: "",
  sku: "",
  family: "Filme stretch",
  unit: "kg",
  weightKg: "",
  description: "",
  notes: "",
}

function productToDraft(product: Product): ProductDraft {
  return {
    name: product.name,
    sku: product.sku,
    family: product.family,
    unit: product.unit,
    weightKg: product.weightKg != null ? String(product.weightKg) : "",
    description: product.description,
    notes: "",
  }
}

function NewProductFlowInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("id")
  const catalog = useProducts()
  const editing = editId ? getProductById(editId) : undefined
  const mode = editing ? "edit" : "create"

  const [phase, setPhase] = useState<ProductFlowPhase>("empty")
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft)
  const [duplicate, setDuplicate] = useState<Product | null>(null)
  const [messages, setMessages] = useState<ProductChatMessage[]>([])
  const extractTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const loadedEditId = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (extractTimer.current) clearTimeout(extractTimer.current)
    }
  }, [])

  useEffect(() => {
    if (editing && loadedEditId.current !== editing.id) {
      loadedEditId.current = editing.id
      setDraft(productToDraft(editing))
      setPhase("draft")
      setDuplicate(null)
      setMessages([
        {
          id: `edit-${editing.id}`,
          role: "assistant",
          text: `Editando “${editing.name}”. Peça ajustes aqui ou altere o formulário diretamente.`,
        },
      ])
      return
    }

    if (!editing && loadedEditId.current !== null) {
      loadedEditId.current = null
      setDraft(emptyDraft)
      setPhase("empty")
      setDuplicate(null)
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          text: "Preencha o formulário ao lado — ou me descreva o produto que eu monto os campos pra você.",
        },
      ])
    }

    if (!editing && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          text: "Preencha o formulário ao lado — ou me descreva o produto que eu monto os campos pra você.",
        },
      ])
    }
  }, [editing, messages.length])

  function resetFlow() {
    if (extractTimer.current) clearTimeout(extractTimer.current)
    if (editing) {
      setDraft(productToDraft(editing))
      setPhase("draft")
      setDuplicate(null)
      setMessages((current) => [
        ...current,
        {
          id: `reset-${Date.now()}`,
          role: "assistant",
          text: "Voltei aos dados originais do produto.",
        },
      ])
      return
    }
    setPhase("empty")
    setDraft(emptyDraft)
    setDuplicate(null)
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        text: "Formulário limpo. Pode preencher manualmente ou descrever o produto aqui.",
      },
    ])
  }

  function handleDraftChange(next: ProductDraft) {
    setDraft(next)
    if (phase === "empty" || phase === "saved") setPhase("draft")
    if (phase === "duplicate") setDuplicate(null)
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
        text: "Analisando e preenchendo o formulário…",
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
            text: `Preenchi “${next.name}” (${next.sku}). Revise o formulário e salve.`,
          },
        ])
        resolve()
      }, 1100)
    })
  }

  function confirmSave(force = false) {
    const match = findDuplicateProduct(
      draft,
      catalog.filter((item) => item.id !== editing?.id)
    )
    if (match && !force) {
      setDuplicate(match)
      setPhase("duplicate")
      setMessages((current) => [
        ...current,
        {
          id: `dup-${Date.now()}`,
          role: "assistant",
          text: `Possível duplicado: ${match.name} (${match.sku}). Ajuste ou confirme mesmo assim.`,
        },
      ])
      return
    }

    if (editing) {
      const product = draftToProduct(draft, editing.id)
      product.status = editing.status
      product.stockHint = editing.stockHint
      updateProduct(product)
    } else {
      addProduct(draftToProduct(draft, `prod-${Date.now()}`))
    }

    setPhase("saved")
    setDuplicate(null)
    setMessages((current) => [
      ...current,
      {
        id: `saved-${Date.now()}`,
        role: "assistant",
        text: editing
          ? `Alterações de “${draft.name}” salvas no catálogo mock.`
          : `“${draft.name}” entrou no catálogo mock.`,
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
              {mode === "edit" ? "Editar produto" : "Novo produto"}
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

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="mx-auto grid h-full w-full max-w-6xl grid-rows-[minmax(0,1fr)_minmax(16rem,0.85fr)] gap-4 overflow-hidden p-4 md:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] md:grid-rows-1 md:gap-5 md:px-6 md:py-5">
          <div className="min-h-0 overflow-y-auto">
            <ProductForm
              mode={mode}
              phase={phase === "empty" ? "draft" : phase}
              draft={draft}
              duplicate={duplicate}
              onChange={handleDraftChange}
              onConfirm={() => confirmSave(false)}
              onForceSave={() => confirmSave(true)}
              onReset={resetFlow}
              onDismissDuplicate={() => {
                setPhase("draft")
                setDuplicate(null)
              }}
            />
          </div>

          <div className="min-h-0">
            <ProductChatPanel
              messages={messages}
              disabled={phase === "extracting" || phase === "saved"}
              onSubmitPrompt={handlePrompt}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function NewProductFlow() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-sm text-slate-500">
          Carregando…
        </div>
      }
    >
      <NewProductFlowInner />
    </Suspense>
  )
}
