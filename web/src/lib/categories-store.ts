"use client"

import { useSyncExternalStore } from "react"

export type Category = {
  id: string
  name: string
  parentId: string | null
  active: boolean
}

/** Seed demo (plásticos) — o cliente pode editar/apagar no protótipo. */
export const initialCategories: Category[] = [
  { id: "cat-filme", name: "Filme", parentId: null, active: true },
  {
    id: "cat-filme-stretch",
    name: "Stretch",
    parentId: "cat-filme",
    active: true,
  },
  {
    id: "cat-filme-stretch-pp",
    name: "PP",
    parentId: "cat-filme-stretch",
    active: true,
  },
  {
    id: "cat-filme-stretch-pe",
    name: "PE",
    parentId: "cat-filme-stretch",
    active: true,
  },
  {
    id: "cat-filme-tecnico",
    name: "Técnico",
    parentId: "cat-filme",
    active: true,
  },
  { id: "cat-sacos", name: "Sacos", parentId: null, active: true },
  {
    id: "cat-sacos-tubular",
    name: "Tubular",
    parentId: "cat-sacos",
    active: true,
  },
  {
    id: "cat-sacos-industrial",
    name: "Industrial",
    parentId: "cat-sacos",
    active: true,
  },
  { id: "cat-granulado", name: "Granulado", parentId: null, active: true },
  {
    id: "cat-granulado-pead",
    name: "PEAD",
    parentId: "cat-granulado",
    active: true,
  },
  {
    id: "cat-granulado-pp",
    name: "PP",
    parentId: "cat-granulado",
    active: true,
  },
  { id: "cat-embalagem", name: "Embalagem", parentId: null, active: true },
  {
    id: "cat-embalagem-tecnica",
    name: "Técnica",
    parentId: "cat-embalagem",
    active: true,
  },
]

let categories: Category[] = [...initialCategories]
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function getCategoriesSnapshot(): Category[] {
  return categories
}

export function subscribeCategories(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useCategories() {
  return useSyncExternalStore(
    subscribeCategories,
    getCategoriesSnapshot,
    getCategoriesSnapshot
  )
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((item) => item.id === id)
}

export function getCategoryChildren(parentId: string | null): Category[] {
  return categories
    .filter((item) => item.parentId === parentId)
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
}

export function getCategoryPath(
  id: string | null | undefined,
  list: Category[] = categories
): string {
  if (!id) return ""
  const parts: string[] = []
  let current = list.find((item) => item.id === id)
  const guard = new Set<string>()
  while (current && !guard.has(current.id)) {
    guard.add(current.id)
    parts.unshift(current.name)
    current = current.parentId
      ? list.find((item) => item.id === current!.parentId)
      : undefined
  }
  return parts.join(" · ")
}

export function getCategoryDepth(
  id: string,
  list: Category[] = categories
): number {
  let depth = 0
  let current = list.find((item) => item.id === id)
  const guard = new Set<string>()
  while (current?.parentId && !guard.has(current.id)) {
    guard.add(current.id)
    depth += 1
    current = list.find((item) => item.id === current!.parentId)
  }
  return depth
}

export function isDescendantOf(
  categoryId: string,
  ancestorId: string,
  list: Category[] = categories
): boolean {
  let current = list.find((item) => item.id === categoryId)
  const guard = new Set<string>()
  while (current && !guard.has(current.id)) {
    if (current.id === ancestorId) return true
    guard.add(current.id)
    current = current.parentId
      ? list.find((item) => item.id === current!.parentId)
      : undefined
  }
  return false
}

export function addCategory(input: {
  name: string
  parentId: string | null
}): Category {
  const category: Category = {
    id: `cat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: input.name.trim() || "Nova categoria",
    parentId: input.parentId,
    active: true,
  }
  categories = [...categories, category]
  emit()
  return category
}

export function updateCategory(
  id: string,
  patch: Partial<Pick<Category, "name" | "parentId" | "active">>
): void {
  categories = categories.map((item) => {
    if (item.id !== id) return item
    const next = { ...item, ...patch }
    if (patch.name != null) next.name = patch.name.trim() || item.name
    // Avoid cycles: parent cannot be self or descendant
    if (
      patch.parentId &&
      (patch.parentId === id || isDescendantOf(patch.parentId, id))
    ) {
      next.parentId = item.parentId
    }
    return next
  })
  emit()
}

export function removeCategory(id: string): { ok: boolean; reason?: string } {
  const hasChildren = categories.some((item) => item.parentId === id)
  if (hasChildren) {
    return {
      ok: false,
      reason: "Remova ou mova as subcategorias antes de excluir.",
    }
  }
  categories = categories.filter((item) => item.id !== id)
  emit()
  return { ok: true }
}

export type CategoryTreeNode = Category & { children: CategoryTreeNode[] }

export function buildCategoryTree(
  list: Category[] = categories,
  options?: { includeInactive?: boolean }
): CategoryTreeNode[] {
  const includeInactive = options?.includeInactive ?? true
  const byParent = new Map<string | null, Category[]>()
  for (const item of list) {
    if (!includeInactive && !item.active) continue
    const key = item.parentId
    const bucket = byParent.get(key) ?? []
    bucket.push(item)
    byParent.set(key, bucket)
  }

  function walk(parentId: string | null): CategoryTreeNode[] {
    const nodes = byParent.get(parentId) ?? []
    return nodes
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
      .map((node) => ({
        ...node,
        children: walk(node.id),
      }))
  }

  return walk(null)
}

export function flattenCategoryOptions(
  list: Category[] = categories,
  options?: { activeOnly?: boolean }
): { id: string; label: string; depth: number; active: boolean }[] {
  const activeOnly = options?.activeOnly ?? true
  const tree = buildCategoryTree(list, { includeInactive: !activeOnly })
  const rows: { id: string; label: string; depth: number; active: boolean }[] =
    []

  function walk(nodes: CategoryTreeNode[], depth: number) {
    for (const node of nodes) {
      if (activeOnly && !node.active) continue
      rows.push({
        id: node.id,
        label: node.name,
        depth,
        active: node.active,
      })
      walk(node.children, depth + 1)
    }
  }

  walk(tree, 0)
  return rows
}
