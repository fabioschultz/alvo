"use client"

import { AlertTriangle, CheckCircle2, Loader2, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  productConditions,
  productFamilies,
  productKinds,
  productProductions,
  productUnits,
  suggestSku,
  type Product,
  type ProductCondition,
  type ProductDraft,
  type ProductFlowPhase,
  type ProductKind,
  type ProductProduction,
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
  hint,
  required,
}: {
  label: string
  children: React.ReactNode
  htmlFor?: string
  hint?: string
  required?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="block space-y-1.5">
      <span className="text-xs font-medium text-slate-500">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </span>
      {children}
      {hint ? <span className="block text-[11px] text-slate-400">{hint}</span> : null}
    </label>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3 border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
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

  function patch(partial: Partial<ProductDraft>) {
    onChange({ ...draft, ...partial })
  }

  return (
    <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200/70">
      <CardHeader className="border-b border-slate-100 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">
              {mode === "edit" ? "Editar produto" : "Cadastro de produto"}
            </CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Inspirado no fluxo Bling — só o essencial para o Alvo. O chat
              preenche ao lado.
            </p>
          </div>
          <PhaseBadge phase={phase} />
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
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
                {mode === "edit"
                  ? "Alterações salvas"
                  : "Produto salvo no catálogo mock"}
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
                {duplicate.sku}) no catálogo. Ajuste o código/nome ou force o
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

        <Section
          title="Dados básicos"
          description="Nome, código e comercialização — o mínimo para vender e emitir NF."
        >
          <Field label="Nome" htmlFor="product-name" required>
            <Input
              id="product-name"
              value={draft.name}
              disabled={locked}
              placeholder="Ex.: Filme stretch PP 500 mm"
              onChange={(event) => patch({ name: event.target.value })}
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Field
              label="Código (SKU)"
              htmlFor="product-sku"
              required
              hint="Referência interna · máx. 60 caracteres"
            >
              <Input
                id="product-sku"
                value={draft.sku}
                disabled={locked}
                maxLength={60}
                placeholder="Ex.: PP-500-NAT"
                onChange={(event) => patch({ sku: event.target.value })}
              />
            </Field>
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                className="h-9 gap-1.5"
                disabled={locked}
                onClick={() =>
                  patch({ sku: suggestSku(draft.name || draft.family || "SKU") })
                }
              >
                <Sparkles className="size-3.5" />
                Gerar
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Preço de venda" htmlFor="product-sale-price">
              <Input
                id="product-sale-price"
                inputMode="decimal"
                placeholder="0,00"
                value={draft.salePrice}
                disabled={locked}
                onChange={(event) => patch({ salePrice: event.target.value })}
              />
            </Field>
            <Field label="Unidade" htmlFor="product-unit" required>
              <select
                id="product-unit"
                className={selectClass}
                value={draft.unit}
                disabled={locked}
                onChange={(event) =>
                  patch({ unit: event.target.value as ProductUnit })
                }
              >
                {productUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit.toUpperCase()}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Tipo" htmlFor="product-kind">
              <select
                id="product-kind"
                className={selectClass}
                value={draft.kind}
                disabled={locked}
                onChange={(event) =>
                  patch({ kind: event.target.value as ProductKind })
                }
              >
                {productKinds.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Condição" htmlFor="product-condition">
              <select
                id="product-condition"
                className={selectClass}
                value={draft.condition}
                disabled={locked}
                onChange={(event) =>
                  patch({
                    condition: event.target.value as ProductCondition,
                  })
                }
              >
                {productConditions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Família / categoria" htmlFor="product-family">
              <select
                id="product-family"
                className={selectClass}
                value={draft.family}
                disabled={locked}
                onChange={(event) => patch({ family: event.target.value })}
              >
                {productFamilies.map((family) => (
                  <option key={family} value={family}>
                    {family}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        <Section
          title="Características"
          description="Identificação, dimensões e códigos — úteis para frete e NF."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Marca" htmlFor="product-brand">
              <Input
                id="product-brand"
                value={draft.brand}
                disabled={locked}
                placeholder="Ex.: Alvo"
                onChange={(event) => patch({ brand: event.target.value })}
              />
            </Field>
            <Field label="Produção" htmlFor="product-production">
              <select
                id="product-production"
                className={selectClass}
                value={draft.production}
                disabled={locked}
                onChange={(event) =>
                  patch({
                    production: event.target.value as ProductProduction,
                  })
                }
              >
                {productProductions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Peso líquido (kg)" htmlFor="product-net-weight">
              <Input
                id="product-net-weight"
                inputMode="decimal"
                placeholder="12.5"
                value={draft.netWeightKg}
                disabled={locked}
                onChange={(event) => patch({ netWeightKg: event.target.value })}
              />
            </Field>
            <Field label="Peso bruto (kg)" htmlFor="product-gross-weight">
              <Input
                id="product-gross-weight"
                inputMode="decimal"
                placeholder="12.8"
                value={draft.grossWeightKg}
                disabled={locked}
                onChange={(event) =>
                  patch({ grossWeightKg: event.target.value })
                }
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Largura (cm)" htmlFor="product-width">
              <Input
                id="product-width"
                inputMode="decimal"
                value={draft.widthCm}
                disabled={locked}
                onChange={(event) => patch({ widthCm: event.target.value })}
              />
            </Field>
            <Field label="Altura (cm)" htmlFor="product-height">
              <Input
                id="product-height"
                inputMode="decimal"
                value={draft.heightCm}
                disabled={locked}
                onChange={(event) => patch({ heightCm: event.target.value })}
              />
            </Field>
            <Field label="Profundidade (cm)" htmlFor="product-depth">
              <Input
                id="product-depth"
                inputMode="decimal"
                value={draft.depthCm}
                disabled={locked}
                onChange={(event) => patch({ depthCm: event.target.value })}
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="GTIN / EAN"
              htmlFor="product-gtin"
              hint="Código de barras do produto"
            >
              <Input
                id="product-gtin"
                value={draft.gtin}
                disabled={locked}
                placeholder="789..."
                onChange={(event) => patch({ gtin: event.target.value })}
              />
            </Field>
            <Field
              label="NCM"
              htmlFor="product-ncm"
              hint="Classificação fiscal (com o contador)"
            >
              <Input
                id="product-ncm"
                value={draft.ncm}
                disabled={locked}
                placeholder="3920.10.99"
                onChange={(event) => patch({ ncm: event.target.value })}
              />
            </Field>
          </div>

          <Field label="Descrição" htmlFor="product-description">
            <textarea
              id="product-description"
              value={draft.description}
              disabled={locked}
              rows={3}
              placeholder="Descrição curta para pedidos, propostas e catálogo…"
              onChange={(event) => patch({ description: event.target.value })}
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
        </Section>

        <Section
          title="Estoque e custo"
          description="Saldo e custo unitário — sem depósitos múltiplos neste protótipo."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Estoque atual" htmlFor="product-stock">
              <Input
                id="product-stock"
                inputMode="decimal"
                value={draft.stockQty}
                disabled={locked}
                onChange={(event) => patch({ stockQty: event.target.value })}
              />
            </Field>
            <Field label="Estoque mínimo" htmlFor="product-stock-min">
              <Input
                id="product-stock-min"
                inputMode="decimal"
                value={draft.stockMin}
                disabled={locked}
                onChange={(event) => patch({ stockMin: event.target.value })}
              />
            </Field>
            <Field label="Localização" htmlFor="product-location">
              <Input
                id="product-location"
                value={draft.location}
                disabled={locked}
                placeholder="Ex.: A-01-02"
                onChange={(event) => patch({ location: event.target.value })}
              />
            </Field>
          </div>
          <Field label="Preço de custo" htmlFor="product-cost-price">
            <Input
              id="product-cost-price"
              inputMode="decimal"
              placeholder="0,00"
              value={draft.costPrice}
              disabled={locked}
              onChange={(event) => patch({ costPrice: event.target.value })}
            />
          </Field>
        </Section>

        {!showSaved && phase !== "duplicate" ? (
          <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
            <Button
              type="button"
              className="flex-1"
              disabled={locked || !draft.name.trim() || !draft.sku.trim()}
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
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onReset}
          >
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
