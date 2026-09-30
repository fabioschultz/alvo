"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  FolderPlus,
  FolderTree,
  Plus,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  addCategory,
  buildCategoryTree,
  getCategoryPath,
  removeCategory,
  updateCategory,
  useCategories,
  type Category,
  type CategoryTreeNode,
} from "@/lib/categories-store"
import { cn } from "@/lib/utils"

export function CategoriesManager() {
  const categories = useCategories()
  const tree = useMemo(() => buildCategoryTree(categories), [categories])
  const [selectedId, setSelectedId] = useState<string | null>(
    tree[0]?.id ?? null
  )
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(categories.map((item) => item.id))
  )
  const [error, setError] = useState<string | null>(null)

  const selected = categories.find((item) => item.id === selectedId) ?? null

  function toggleExpand(id: string) {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleAddRoot() {
    const created = addCategory({ name: "Nova categoria", parentId: null })
    setSelectedId(created.id)
    setError(null)
  }

  function handleAddChild(parentId: string) {
    const created = addCategory({ name: "Nova subcategoria", parentId })
    setExpanded((current) => new Set(current).add(parentId))
    setSelectedId(created.id)
    setError(null)
  }

  function handleDelete(id: string) {
    const result = removeCategory(id)
    if (!result.ok) {
      setError(result.reason ?? "Não foi possível excluir.")
      return
    }
    setError(null)
    setSelectedId((current) => (current === id ? null : current))
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 md:gap-5 md:px-6 md:py-6">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Estoque · Categorias
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                Categorias
              </h1>
              <p className="mt-1 max-w-xl text-sm text-slate-500">
                Árvore gerenciada pelo cliente (N níveis). O seed de plásticos é
                só exemplo — edite à vontade.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="gap-1.5"
                render={<Link href="/estoque/produtos" />}
              >
                Ver produtos
              </Button>
              <Button
                type="button"
                className="gap-1.5"
                onClick={handleAddRoot}
              >
                <Plus className="size-4" />
                Nova raiz
              </Button>
            </div>
          </header>

          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
            >
              {error}
            </p>
          ) : null}

          <div className="grid gap-4 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200/70">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FolderTree className="size-4 text-slate-400" />
                  Árvore
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                {tree.length === 0 ? (
                  <p className="px-3 py-8 text-center text-sm text-slate-400">
                    Nenhuma categoria. Crie a primeira raiz.
                  </p>
                ) : (
                  <ul className="space-y-0.5">
                    {tree.map((node) => (
                      <TreeNode
                        key={node.id}
                        node={node}
                        depth={0}
                        selectedId={selectedId}
                        expanded={expanded}
                        onSelect={setSelectedId}
                        onToggle={toggleExpand}
                        onAddChild={handleAddChild}
                      />
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200/70">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base">Detalhe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {!selected ? (
                  <p className="py-10 text-center text-sm text-slate-400">
                    Selecione uma categoria na árvore.
                  </p>
                ) : (
                  <CategoryEditor
                    category={selected}
                    categories={categories}
                    onChange={(patch) => {
                      updateCategory(selected.id, patch)
                      setError(null)
                    }}
                    onAddChild={() => handleAddChild(selected.id)}
                    onDelete={() => handleDelete(selected.id)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function TreeNode({
  node,
  depth,
  selectedId,
  expanded,
  onSelect,
  onToggle,
  onAddChild,
}: {
  node: CategoryTreeNode
  depth: number
  selectedId: string | null
  expanded: Set<string>
  onSelect: (id: string) => void
  onToggle: (id: string) => void
  onAddChild: (id: string) => void
}) {
  const hasChildren = node.children.length > 0
  const isOpen = expanded.has(node.id)
  const selected = selectedId === node.id

  return (
    <li>
      <div
        className={cn(
          "group flex items-center gap-1 rounded-lg pr-1",
          selected ? "bg-blue-50 text-blue-900" : "hover:bg-slate-50"
        )}
        style={{ paddingLeft: 8 + depth * 14 }}
      >
        <button
          type="button"
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-white/80 hover:text-foreground"
          aria-label={hasChildren ? (isOpen ? "Recolher" : "Expandir") : "Folha"}
          disabled={!hasChildren}
          onClick={() => hasChildren && onToggle(node.id)}
        >
          {hasChildren ? (
            isOpen ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )
          ) : (
            <span className="size-1.5 rounded-full bg-slate-300" />
          )}
        </button>
        <button
          type="button"
          className="min-w-0 flex-1 truncate py-2 text-left text-sm font-medium"
          onClick={() => onSelect(node.id)}
        >
          {node.name}
          {!node.active ? (
            <span className="ml-2 text-xs font-normal text-slate-400">
              inativa
            </span>
          ) : null}
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="opacity-0 group-hover:opacity-100"
          aria-label={`Adicionar filho em ${node.name}`}
          onClick={() => onAddChild(node.id)}
        >
          <FolderPlus className="size-3.5" />
        </Button>
      </div>
      {hasChildren && isOpen ? (
        <ul>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expanded={expanded}
              onSelect={onSelect}
              onToggle={onToggle}
              onAddChild={onAddChild}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

function CategoryEditor({
  category,
  categories,
  onChange,
  onAddChild,
  onDelete,
}: {
  category: Category
  categories: Category[]
  onChange: (patch: Partial<Pick<Category, "name" | "parentId" | "active">>) => void
  onAddChild: () => void
  onDelete: () => void
}) {
  const parentOptions = categories.filter(
    (item) =>
      item.id !== category.id &&
      // exclude descendants would need isDescendantOf — updateCategory already guards
      true
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="secondary"
          className={cn(
            "rounded-full",
            category.active
              ? "bg-teal-50 text-teal-800"
              : "bg-slate-100 text-slate-600"
          )}
        >
          {category.active ? "Ativa" : "Inativa"}
        </Badge>
        <p className="text-xs text-slate-400">
          {getCategoryPath(category.id) || category.name}
        </p>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-slate-500">Nome</span>
        <Input
          value={category.name}
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-slate-500">Categoria pai</span>
        <select
          className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          value={category.parentId ?? ""}
          onChange={(event) =>
            onChange({
              parentId: event.target.value ? event.target.value : null,
            })
          }
        >
          <option value="">(raiz)</option>
          {parentOptions.map((item) => (
            <option key={item.id} value={item.id}>
              {getCategoryPath(item.id)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          className="size-3.5 rounded border-slate-300"
          checked={category.active}
          onChange={(event) => onChange({ active: event.target.checked })}
        />
        Categoria ativa (aparece no seletor de produtos)
      </label>

      <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="gap-1.5"
          onClick={onAddChild}
        >
          <FolderPlus className="size-3.5" />
          Novo filho
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="gap-1.5 sm:ml-auto"
          onClick={onDelete}
        >
          <Trash2 className="size-3.5" />
          Excluir
        </Button>
      </div>
    </div>
  )
}
