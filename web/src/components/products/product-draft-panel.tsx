"use client"

import { AlertTriangle, CheckCircle2, Loader2, Package } from "lucide-react"

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

type ProductDraftPanelProps = {
  phase: ProductFlowPhase
  draft: ProductDraft | null
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
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      {children}
    </label>
  )
}

const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"

export function ProductDraftPanel({
  phase,
  draft,
  duplicate,
  onChange,
  onConfirm,
  onForceSave,
  onReset,
  onDismissDuplicate,
}: ProductDraftPanelProps) {
  const editable = phase === "draft" || phase === "duplicate"

  return (
    <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200/70">
      <CardHeader className="border-b border-slate-100 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Rascunho do produto</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Revise os campos antes de confirmar o cadastro.
            </p>
          </div>
          <PhaseBadge phase={phase} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {phase === "empty" ? (
          <EmptyState />
        ) : null}

        {phase === "extracting" ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Loader2 className="size-8 animate-spin text-blue-600" aria-hidden />
            <div>
              <p className="text-sm font-medium text-foreground">
                Extraindo dados do produto…
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Simulação — em produção isso virá do Genkit.
              </p>
            </div>
          </div>
        ) : null}

        {phase === "saved" && draft ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl bg-teal-50 px-3 py-3 text-teal-800">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
              <div>
                <p className="text-sm font-medium">Produto salvo no catálogo mock</p>
                <p className="mt-0.5 text-xs text-teal-700/90">
                  {draft.name} · {draft.sku}
                </p>
              </div>
            </div>
            <Button type="button" variant="outline" className="w-full" onClick={onReset}>
              Cadastrar outro produto
            </Button>
          </div>
        ) : null}

        {(phase === "draft" || phase === "duplicate") && draft ? (
          <div className="space-y-3">
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

            <Field label="Nome">
              <Input
                value={draft.name}
                disabled={!editable}
                onChange={(event) =>
                  onChange({ ...draft, name: event.target.value })
                }
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="SKU">
                <Input
                  value={draft.sku}
                  disabled={!editable}
                  onChange={(event) =>
                    onChange({ ...draft, sku: event.target.value })
                  }
                />
              </Field>
              <Field label="Família">
                <select
                  className={selectClass}
                  value={draft.family}
                  disabled={!editable}
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
              <Field label="Unidade">
                <select
                  className={selectClass}
                  value={draft.unit}
                  disabled={!editable}
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
              <Field label="Peso (kg)">
                <Input
                  inputMode="decimal"
                  placeholder="ex.: 12.5"
                  value={draft.weightKg}
                  disabled={!editable}
                  onChange={(event) =>
                    onChange({ ...draft, weightKg: event.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="Descrição">
              <textarea
                value={draft.description}
                disabled={!editable}
                rows={3}
                onChange={(event) =>
                  onChange({ ...draft, description: event.target.value })
                }
                className={cn(
                  selectClass,
                  "h-auto min-h-[4.5rem] resize-y py-2 leading-relaxed"
                )}
              />
            </Field>
            {draft.notes ? (
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                {draft.notes}
              </p>
            ) : null}

            {phase === "draft" ? (
              <div className="flex flex-col gap-2 pt-1 sm:flex-row">
                <Button type="button" className="flex-1" onClick={onConfirm}>
                  Confirmar cadastro
                </Button>
                <Button type="button" variant="outline" onClick={onReset}>
                  Limpar
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function PhaseBadge({ phase }: { phase: ProductFlowPhase }) {
  const map: Record<
    ProductFlowPhase,
    { label: string; className: string }
  > = {
    empty: { label: "Vazio", className: "bg-slate-100 text-slate-600" },
    extracting: { label: "Extraindo", className: "bg-blue-50 text-blue-700" },
    draft: { label: "Rascunho", className: "bg-indigo-50 text-indigo-700" },
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
        <Package className="size-6" aria-hidden />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">
          Ainda sem rascunho
        </p>
        <p className="mt-1 max-w-[16rem] text-xs leading-relaxed text-slate-500">
          Descreva o produto no composer ou anexe foto/PDF. O Alvo AI (mock)
          preenche os campos.
        </p>
      </div>
    </div>
  )
}
