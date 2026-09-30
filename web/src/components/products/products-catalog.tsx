"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Plus, Search, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useProducts } from "@/lib/products-store"
import { cn } from "@/lib/utils"
import type { ProductStatus } from "@/lib/mock-data"

const statusStyles: Record<ProductStatus, string> = {
  ativo: "bg-teal-50 text-teal-800",
  rascunho: "bg-amber-50 text-amber-800",
  inativo: "bg-slate-100 text-slate-600",
}

export function ProductsCatalog() {
  const products = useProducts()
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.family.toLowerCase().includes(q)
    )
  }, [products, query])

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
                Lista mock para iterar o cadastro conversacional. Sem
                persistência real.
              </p>
            </div>
            <Button
              render={<Link href="/estoque/produtos/novo" />}
              className="gap-1.5 self-start sm:self-auto"
            >
              <Sparkles className="size-4" />
              Novo produto com Alvo AI
            </Button>
          </header>

          <div className="relative max-w-md">
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

          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200/70">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-medium tracking-wide text-slate-400 uppercase">
                      <th className="px-4 py-3 font-medium">Produto</th>
                      <th className="px-4 py-3 font-medium">SKU</th>
                      <th className="px-4 py-3 font-medium">Família</th>
                      <th className="px-4 py-3 font-medium">Unidade</th>
                      <th className="px-4 py-3 font-medium">Estoque</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">
                            {product.name}
                          </p>
                          <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">
                            {product.description}
                          </p>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-600">
                          {product.sku}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {product.family}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {product.unit}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {product.stockHint}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "rounded-full capitalize",
                              statusStyles[product.status]
                            )}
                          >
                            {product.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
                  <p className="text-sm text-slate-500">
                    Nenhum produto encontrado para “{query}”.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    render={<Link href="/estoque/produtos/novo" />}
                  >
                    <Plus className="size-3.5" />
                    Cadastrar com Alvo AI
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
