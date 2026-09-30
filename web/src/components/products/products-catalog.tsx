"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import {
  Columns3,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { removeProduct, useProducts } from "@/lib/products-store"
import { cn } from "@/lib/utils"
import type { Product, ProductStatus } from "@/lib/mock-data"
import { formatMoneyBRL } from "@/lib/mock-data"

const statusStyles: Record<ProductStatus, string> = {
  ativo: "bg-teal-50 text-teal-800",
  rascunho: "bg-amber-50 text-amber-800",
  inativo: "bg-slate-100 text-slate-600",
}

type ColumnId =
  | "name"
  | "sku"
  | "category"
  | "brand"
  | "unit"
  | "salePrice"
  | "weight"
  | "stock"
  | "status"
  | "updatedAt"

const COLUMN_DEFS: { id: ColumnId; label: string; defaultVisible: boolean }[] =
  [
    { id: "name", label: "Produto", defaultVisible: true },
    { id: "sku", label: "SKU", defaultVisible: true },
    { id: "category", label: "Categoria", defaultVisible: true },
    { id: "brand", label: "Marca", defaultVisible: false },
    { id: "unit", label: "Unidade", defaultVisible: true },
    { id: "salePrice", label: "Preço", defaultVisible: true },
    { id: "weight", label: "Peso líq.", defaultVisible: false },
    { id: "stock", label: "Estoque", defaultVisible: true },
    { id: "status", label: "Status", defaultVisible: true },
    { id: "updatedAt", label: "Atualizado", defaultVisible: false },
  ]

const STORAGE_KEY = "alvo.products.visibleColumns"
const columnListeners = new Set<() => void>()

function defaultVisibleColumns(): ColumnId[] {
  return COLUMN_DEFS.filter((col) => col.defaultVisible).map((col) => col.id)
}

function readVisibleColumns(): ColumnId[] {
  if (typeof window === "undefined") return defaultVisibleColumns()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultVisibleColumns()
    const parsed = JSON.parse(raw) as string[]
    const valid = COLUMN_DEFS.map((col) => col.id)
    const next = parsed.filter((id): id is ColumnId =>
      valid.includes(id as ColumnId)
    )
    return next.includes("name") ? next : ["name", ...next]
  } catch {
    return defaultVisibleColumns()
  }
}

function writeVisibleColumns(next: ColumnId[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  columnListeners.forEach((listener) => listener())
}

function subscribeColumns(listener: () => void) {
  columnListeners.add(listener)
  return () => columnListeners.delete(listener)
}

function cellValue(product: Product, column: ColumnId): React.ReactNode {
  switch (column) {
    case "name":
      return (
        <div>
          <p className="font-medium text-foreground">{product.name}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">
            {product.description}
          </p>
        </div>
      )
    case "sku":
      return (
        <span className="font-mono text-xs text-slate-600">{product.sku}</span>
      )
    case "category":
      return (
        <span className="text-slate-600">
          {product.categoryPath || "—"}
        </span>
      )
    case "brand":
      return (
        <span className="text-slate-600">{product.brand || "—"}</span>
      )
    case "unit":
      return <span className="text-slate-600">{product.unit}</span>
    case "salePrice":
      return (
        <span className="tabular-nums text-slate-700">
          {formatMoneyBRL(product.salePrice)}
        </span>
      )
    case "weight":
      return (
        <span className="text-slate-600">
          {product.netWeightKg != null ? `${product.netWeightKg} kg` : "—"}
        </span>
      )
    case "stock":
      return <span className="text-slate-600">{product.stockHint}</span>
    case "status":
      return (
        <Badge
          variant="secondary"
          className={cn(
            "rounded-full capitalize",
            statusStyles[product.status]
          )}
        >
          {product.status}
        </Badge>
      )
    case "updatedAt":
      return <span className="text-slate-600">{product.updatedAt}</span>
    default:
      return null
  }
}

export function ProductsCatalog() {
  const products = useProducts()
  const [query, setQuery] = useState("")
  const visibleColumns = useSyncExternalStore(
    subscribeColumns,
    readVisibleColumns,
    defaultVisibleColumns
  )
  const [columnsOpen, setColumnsOpen] = useState(false)
  const columnsRef = useRef<HTMLDivElement>(null)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)

  useEffect(() => {
    if (!columnsOpen) return
    function onPointerDown(event: MouseEvent) {
      if (!columnsRef.current?.contains(event.target as Node)) {
        setColumnsOpen(false)
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setColumnsOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [columnsOpen])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.categoryPath.toLowerCase().includes(q)
    )
  }, [products, query])

  const activeColumns = COLUMN_DEFS.filter((col) =>
    visibleColumns.includes(col.id)
  )

  function toggleColumn(id: ColumnId) {
    if (id === "name") return
    const next = visibleColumns.includes(id)
      ? visibleColumns.filter((item) => item !== id)
      : [...visibleColumns, id]
    writeVisibleColumns(next)
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 md:gap-5 md:px-6 md:py-6">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Estoque · Produtos
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                Catálogo de produtos
              </h1>
              <p className="mt-1 max-w-xl text-sm text-slate-500">
                Lista mock com colunas configuráveis e ações. Sem persistência
                real.
              </p>
            </div>
            <Button
              render={<Link href="/estoque/produtos/novo" />}
              className="gap-1.5 self-start sm:self-auto"
            >
              <Plus className="size-4" />
              Novo produto
            </Button>
          </header>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder="Buscar por nome, SKU ou família…"
                aria-label="Buscar produtos"
                className="h-9 rounded-lg border-slate-200 bg-white pl-8 text-sm shadow-none"
              />
            </div>

            <div className="relative self-start" ref={columnsRef}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                aria-expanded={columnsOpen}
                aria-haspopup="dialog"
                onClick={() => setColumnsOpen((open) => !open)}
              >
                <Columns3 className="size-3.5" />
                Colunas
              </Button>
              {columnsOpen ? (
                <div
                  role="dialog"
                  aria-label="Escolher colunas"
                  className="absolute top-full right-0 z-20 mt-1.5 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
                >
                  <p className="px-2 py-1.5 text-xs font-medium text-slate-400">
                    Exibir na tabela
                  </p>
                  <ul className="space-y-0.5">
                    {COLUMN_DEFS.map((col) => {
                      const checked = visibleColumns.includes(col.id)
                      const locked = col.id === "name"
                      return (
                        <li key={col.id}>
                          <label
                            className={cn(
                              "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50",
                              locked && "cursor-default opacity-70"
                            )}
                          >
                            <input
                              type="checkbox"
                              className="size-3.5 rounded border-slate-300"
                              checked={checked}
                              disabled={locked}
                              onChange={() => toggleColumn(col.id)}
                            />
                            <span>{col.label}</span>
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200/70">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-medium tracking-wide text-slate-400 uppercase">
                      {activeColumns.map((col) => (
                        <th key={col.id} className="px-4 py-3 font-medium">
                          {col.label}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-right font-medium">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70"
                      >
                        {activeColumns.map((col) => (
                          <td key={col.id} className="px-4 py-3 align-middle">
                            {cellValue(product, col.id)}
                          </td>
                        ))}
                        <td className="px-4 py-3 align-middle">
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Editar ${product.name}`}
                              render={
                                <Link
                                  href={`/estoque/produtos/novo?id=${product.id}`}
                                />
                              }
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="text-slate-500 hover:text-destructive"
                              aria-label={`Excluir ${product.name}`}
                              onClick={() => setPendingDelete(product)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
                  <p className="text-sm text-slate-500">
                    {query
                      ? `Nenhum produto encontrado para “${query}”.`
                      : "Nenhum produto no catálogo."}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    render={<Link href="/estoque/produtos/novo" />}
                  >
                    <Plus className="size-3.5" />
                    Novo produto
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>Excluir produto?</DialogTitle>
            <DialogDescription>
              {pendingDelete
                ? `“${pendingDelete.name}” (${pendingDelete.sku}) será removido do catálogo mock desta sessão.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingDelete(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (pendingDelete) removeProduct(pendingDelete.id)
                setPendingDelete(null)
              }}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
