"use client"

import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  productFamilies,
  productUnits,
  type Product,
  type ProductDraft,
  type ProductFlowPhase,
  type ProductUnit,
} from "@/lib/mock-data"

type ProductFormProps = {
  mode: "create" | "edit"
  phase: ProductFlowPhase
  draft: ProductDraft
  duplicate: Product | null
  onChange: (next: ProductDraft) => void
  onConfirm: () => void
  onForceSave: () => void
  onReset: () => void
  onDismissDuplicate: () => void
}

function Field({
  label,
  children,
  htmlFor,
}: {
  label: string
  children: React.ReactNode
  htmlFor?: string
}) {
  return (
    <label htmlFor={htmlFor} className="block space-y-1.5">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      {children}
    </label>
  )
}

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"

export function ProductForm({
  mode,
  phase,
  draft,
  duplicate,
  onChange,
  onConfirm,
  onForceSave,
  onReset,
  onDismissDuplicate,
}: ProductFormProps) {
  const locked = phase === "extracting" || phase === "saved"
  const showSaved = phase === "saved"

  return (
    <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200/70">
      <CardHeader className="border-b border-slate-100 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">
              {mode === "edit" ? "Editar produto" : "Cadastro de produto"}
            </CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Formulário padrão — o chat ao lado pode preencher os campos.
            </p>
          </div>
          <PhaseBadge phase={phase} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {phase === "extracting" ? (
          <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-3 py-3 text-blue-800">
            <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
            <p className="text-sm">Alvo AI preenchendo o formulário…</p>
          </div>
        ) : null}

        {showSaved ? (
          <div className="flex items-start gap-3 rounded-xl bg-teal-50 px-3 py-3 text-teal-800">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
            <div>
              <p className="text-sm font-medium">
                {mode === "edit" ? "Alterações salvas" : "Produto salvo no catálogo mock"}
              </p>
              <p className="mt-0.5 text-xs text-teal-700/90">
                {draft.name} · {draft.sku}
              </p>
            </div>
          </div>
        ) : null}

        {phase === "duplicate" && duplicate ? (
          <div
            role="alert"
            className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-amber-950"
          >
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <div className="min-w-0 space-y-2">
              <p className="text-sm font-medium">Possível duplicata</p>
              <p className="text-xs leading-relaxed text-amber-900/80">
                Já existe{" "}
                <span className="font-medium">{duplicate.name}</span> (
                {duplicate.sku}) no catálogo. Ajuste o SKU/nome ou force o
                salvamento.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="bg-white"
                  onClick={onDismissDuplicate}
                >
                  Continuar editando
                </Button>
                <Button type="button" size="sm" onClick={onForceSave}>
                  Salvar mesmo assim
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          <Field label="Nome" htmlFor="product-name">
            <Input
              id="product-name"
              value={draft.name}
              disabled={locked}
              placeholder="Ex.: Filme stretch PP 500 mm"
              onChange={(event) =>
                onChange({ ...draft, name: event.target.value })
              }
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="SKU" htmlFor="product-sku">
              <Input
                id="product-sku"
                value={draft.sku}
                disabled={locked}
                placeholder="Ex.: PP-500-NAT"
                onChange={(event) =>
                  onChange({ ...draft, sku: event.target.value })
                }
              />
            </Field>
            <Field label="Família" htmlFor="product-family">
              <select
                id="product-family"
                className={selectClass}
                value={draft.family}
                disabled={locked}
                onChange={(event) =>
                  onChange({ ...draft, family: event.target.value })
                }
              >
                {productFamilies.map((family) => (
                  <option key={family} value={family}>
                    {family}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Unidade" htmlFor="product-unit">
              <select
                id="product-unit"
                className={selectClass}
                value={draft.unit}
                disabled={locked}
                onChange={(event) =>
                  onChange({
                    ...draft,
                    unit: event.target.value as ProductUnit,
                  })
                }
              >
                {productUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Peso (kg)" htmlFor="product-weight">
              <Input
                id="product-weight"
                inputMode="decimal"
                placeholder="ex.: 12.5"
                value={draft.weightKg}
                disabled={locked}
                onChange={(event) =>
                  onChange({ ...draft, weightKg: event.target.value })
                }
              />
            </Field>
          </div>
          <Field label="Descrição" htmlFor="product-description">
            <textarea
              id="product-description"
              value={draft.description}
              disabled={locked}
              rows={4}
              placeholder="Detalhes do produto…"
              onChange={(event) =>
                onChange({ ...draft, description: event.target.value })
              }
              className={cn(
                selectClass,
                "h-auto min-h-[5rem] resize-y py-2 leading-relaxed"
              )}
            />
          </Field>
          {draft.notes ? (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              {draft.notes}
            </p>
          ) : null}
        </div>

        {!showSaved && phase !== "duplicate" ? (
          <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
            <Button
              type="button"
              className="flex-1"
              disabled={locked || !draft.name.trim()}
              onClick={onConfirm}
            >
              {mode === "edit" ? "Salvar alterações" : "Salvar produto"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={locked}
              onClick={onReset}
            >
              Limpar
            </Button>
          </div>
        ) : null}

        {showSaved ? (
          <Button type="button" variant="outline" className="w-full" onClick={onReset}>
            {mode === "edit" ? "Continuar editando" : "Cadastrar outro produto"}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}

function PhaseBadge({ phase }: { phase: ProductFlowPhase }) {
  const map: Record<ProductFlowPhase, { label: string; className: string }> = {
    empty: { label: "Manual", className: "bg-slate-100 text-slate-600" },
    extracting: { label: "Extraindo", className: "bg-blue-50 text-blue-700" },
    draft: { label: "Em edição", className: "bg-indigo-50 text-indigo-700" },
    duplicate: {
      label: "Duplicata",
      className: "bg-amber-50 text-amber-800",
    },
    saved: { label: "Salvo", className: "bg-teal-50 text-teal-800" },
  }
  const item = map[phase]
  return (
    <Badge variant="secondary" className={cn("rounded-full", item.className)}>
      {item.label}
    </Badge>
  )
}
