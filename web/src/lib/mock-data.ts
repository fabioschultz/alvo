export type NavChild = {
  id: string
  label: string
  href: string
}

export type NavItem = {
  id: string
  label: string
  href: string
  icon:
    | "home"
    | "sales"
    | "purchases"
    | "production"
    | "inventory"
    | "finance"
  children?: NavChild[]
}

export type KpiTone = "green" | "orange" | "blue"

export type KpiCard = {
  id: string
  label: string
  value: string
  delta: string
  tone: KpiTone
  icon: "factory" | "alert" | "wallet"
}

export type InsightPriority = "alta" | "media" | "baixa"

export type InsightAction = {
  id: string
  label: string
  description: string
  intent: "primary" | "secondary" | "quiet"
}

export type InsightMetric = {
  label: string
  value: string
}

export type InsightDetailPoint = {
  label: string
  value: number
}

export type Insight = {
  id: string
  title: string
  description: string
  priority: InsightPriority
  tone: "red" | "amber" | "blue" | "green" | "violet" | "rose"
  icon:
    | "clock"
    | "package"
    | "trend-down"
    | "users"
    | "trending-up"
    | "receipt"
  /** Contexto expandido do modal (padrão: resumo → evidência → ações). */
  detail: {
    summary: string
    metrics: InsightMetric[]
    series: InsightDetailPoint[]
    seriesLabel: string
    actions: InsightAction[]
  }
}

export type CurrentUser = {
  name: string
  firstName: string
  role: string
  initials: string
  workspace: string
}

/** Mock tipado — sem Genkit / ERP reais. Pronto para troca por contratos futuros. */
export const currentUser: CurrentUser = {
  name: "Fabio Schultz",
  firstName: "Fabio",
  role: "Administrador",
  initials: "FM",
  workspace: "Alvo Plásticos",
}

export const navItems: NavItem[] = [
  { id: "home", label: "Início", href: "/", icon: "home" },
  {
    id: "sales",
    label: "Vendas",
    href: "/vendas",
    icon: "sales",
    children: [
      { id: "sales-orders", label: "Pedidos", href: "/vendas" },
      { id: "sales-quotes", label: "Cotações", href: "/vendas" },
      { id: "sales-customers", label: "Clientes", href: "/vendas" },
    ],
  },
  {
    id: "purchases",
    label: "Compras",
    href: "/compras",
    icon: "purchases",
    children: [
      { id: "purchases-requests", label: "Requisições", href: "/compras" },
      { id: "purchases-suppliers", label: "Fornecedores", href: "/compras" },
    ],
  },
  {
    id: "production",
    label: "Produção",
    href: "/producao",
    icon: "production",
    children: [
      { id: "production-orders", label: "Ordens", href: "/producao" },
      { id: "production-capacity", label: "Capacidade", href: "/producao" },
    ],
  },
  {
    id: "inventory",
    label: "Estoque",
    href: "/estoque",
    icon: "inventory",
    children: [
      { id: "inventory-products", label: "Produtos", href: "/estoque/produtos" },
      { id: "inventory-balances", label: "Saldos", href: "/estoque" },
      { id: "inventory-coverage", label: "Cobertura", href: "/estoque" },
    ],
  },
  {
    id: "finance",
    label: "Financeiro",
    href: "/financeiro",
    icon: "finance",
    children: [
      { id: "finance-cash", label: "Caixa", href: "/financeiro" },
      { id: "finance-receivables", label: "Receber", href: "/financeiro" },
      { id: "finance-payables", label: "Pagar", href: "/financeiro" },
    ],
  },
]

export const kpis: KpiCard[] = [
  {
    id: "production-today",
    label: "Produção hoje",
    value: "12,5 t",
    delta: "+12% vs média diária",
    tone: "green",
    icon: "factory",
  },
  {
    id: "orders-at-risk",
    label: "Pedidos em risco",
    value: "2",
    delta: "+1 vs semana passada",
    tone: "orange",
    icon: "alert",
  },
  {
    id: "projected-cash",
    label: "Caixa projetado",
    value: "R$ 184 mil",
    delta: "+8% vs mês anterior",
    tone: "blue",
    icon: "wallet",
  },
]

export const insights: Insight[] = [
  {
    id: "late-orders",
    title: "Risco de atraso em pedidos",
    description: "2 pedidos com prazo apertado nesta semana.",
    priority: "alta",
    tone: "red",
    icon: "clock",
    detail: {
      summary:
        "Dois pedidos industriais estão com folga de produção abaixo de 24h. Sem ação, o risco de atraso sobe para sexta-feira.",
      metrics: [
        { label: "Pedidos em risco", value: "2" },
        { label: "Folga média", value: "18 h" },
        { label: "Impacto estimado", value: "R$ 86 mil" },
      ],
      seriesLabel: "Horas de folga (últimos 7 dias)",
      series: [
        { label: "Qui", value: 46 },
        { label: "Sex", value: 38 },
        { label: "Sáb", value: 34 },
        { label: "Dom", value: 30 },
        { label: "Seg", value: 24 },
        { label: "Ter", value: 20 },
        { label: "Qua", value: 18 },
      ],
      actions: [
        {
          id: "open-orders",
          label: "Abrir pedidos",
          description: "Ver OP-1042 e OP-1051 com prazo crítico.",
          intent: "primary",
        },
        {
          id: "resequence",
          label: "Reordenar fila",
          description: "Sugerir priorização nas linhas 1 e 2.",
          intent: "secondary",
        },
        {
          id: "ask-ai",
          label: "Perguntar ao Alvo AI",
          description: "Gerar plano de recuperação para a semana.",
          intent: "quiet",
        },
      ],
    },
  },
  {
    id: "pp-stock",
    title: "Estoque de PP abaixo do ideal",
    description: "Cobertura estimada em 4 dias úteis.",
    priority: "alta",
    tone: "amber",
    icon: "package",
    detail: {
      summary:
        "O saldo de polipropileno cobre cerca de 4 dias úteis na demanda atual. O lead time médio de compra é de 6 dias.",
      metrics: [
        { label: "Cobertura", value: "4 dias" },
        { label: "Saldo", value: "18,2 t" },
        { label: "Lead time", value: "6 dias" },
      ],
      seriesLabel: "Cobertura em dias (últimos 7)",
      series: [
        { label: "Qui", value: 9 },
        { label: "Sex", value: 8 },
        { label: "Sáb", value: 7 },
        { label: "Dom", value: 7 },
        { label: "Seg", value: 6 },
        { label: "Ter", value: 5 },
        { label: "Qua", value: 4 },
      ],
      actions: [
        {
          id: "create-po",
          label: "Criar compra",
          description: "Rascunho de pedido para 25 t de PP.",
          intent: "primary",
        },
        {
          id: "suppliers",
          label: "Ver fornecedores",
          description: "Comparar prazo e preço dos top 3.",
          intent: "secondary",
        },
        {
          id: "ask-ai-pp",
          label: "Perguntar ao Alvo AI",
          description: "Simular cenários de ruptura.",
          intent: "quiet",
        },
      ],
    },
  },
  {
    id: "hdpe-margin",
    title: "Margem do PEAD caiu",
    description: "Queda de 2,4 pp vs média dos últimos 30 dias.",
    priority: "media",
    tone: "blue",
    icon: "trend-down",
    detail: {
      summary:
        "A margem bruta do PEAD caiu 2,4 pontos percentuais. O custo da resina subiu mais rápido que o reajuste de preço.",
      metrics: [
        { label: "Margem atual", value: "18,1%" },
        { label: "Média 30d", value: "20,5%" },
        { label: "Custo resina", value: "+6,2%" },
      ],
      seriesLabel: "Margem % (últimos 7 dias)",
      series: [
        { label: "Qui", value: 21 },
        { label: "Sex", value: 20 },
        { label: "Sáb", value: 20 },
        { label: "Dom", value: 19 },
        { label: "Seg", value: 19 },
        { label: "Ter", value: 18 },
        { label: "Qua", value: 18 },
      ],
      actions: [
        {
          id: "review-price",
          label: "Revisar preço",
          description: "Sugestão de reajuste por família de produto.",
          intent: "primary",
        },
        {
          id: "cost-breakdown",
          label: "Ver custos",
          description: "Abrir composição de custo do PEAD.",
          intent: "secondary",
        },
        {
          id: "ask-ai-margin",
          label: "Perguntar ao Alvo AI",
          description: "Explicar drivers da queda de margem.",
          intent: "quiet",
        },
      ],
    },
  },
  {
    id: "repurchase",
    title: "Clientes com chance de recompra",
    description: "5 contas com padrão de pedido recorrente.",
    priority: "media",
    tone: "green",
    icon: "users",
    detail: {
      summary:
        "Cinco clientes recorrentes estão na janela histórica de recompra. Contato proativo tende a antecipar pedidos.",
      metrics: [
        { label: "Contas", value: "5" },
        { label: "Potencial", value: "R$ 120 mil" },
        { label: "Janela", value: "7 dias" },
      ],
      seriesLabel: "Probabilidade de recompra (%)",
      series: [
        { label: "A", value: 82 },
        { label: "B", value: 76 },
        { label: "C", value: 71 },
        { label: "D", value: 68 },
        { label: "E", value: 64 },
      ],
      actions: [
        {
          id: "outreach",
          label: "Montar abordagem",
          description: "Roteiro comercial para as 5 contas.",
          intent: "primary",
        },
        {
          id: "open-accounts",
          label: "Ver clientes",
          description: "Abrir lista priorizada por potencial.",
          intent: "secondary",
        },
        {
          id: "ask-ai-repurchase",
          label: "Perguntar ao Alvo AI",
          description: "Sugestões de oferta por conta.",
          intent: "quiet",
        },
      ],
    },
  },
  {
    id: "increase-production",
    title: "Aumentar produção esta semana",
    description: "Capacidade ociosa detectada nas linhas 2 e 3.",
    priority: "baixa",
    tone: "violet",
    icon: "trending-up",
    detail: {
      summary:
        "Há ociosidade estimada de 14% nas linhas 2 e 3. Antecipar ordens de menor criticidade melhora o uso da planta.",
      metrics: [
        { label: "Ociosidade", value: "14%" },
        { label: "Linhas", value: "2 e 3" },
        { label: "Ganho", value: "+3,1 t" },
      ],
      seriesLabel: "Utilização % por dia",
      series: [
        { label: "Qui", value: 78 },
        { label: "Sex", value: 81 },
        { label: "Sáb", value: 64 },
        { label: "Dom", value: 52 },
        { label: "Seg", value: 86 },
        { label: "Ter", value: 84 },
        { label: "Qua", value: 82 },
      ],
      actions: [
        {
          id: "pull-forward",
          label: "Antecipar OPs",
          description: "Trazer 3 ordens da próxima semana.",
          intent: "primary",
        },
        {
          id: "capacity",
          label: "Ver capacidade",
          description: "Abrir mapa de carga das linhas.",
          intent: "secondary",
        },
        {
          id: "ask-ai-capacity",
          label: "Perguntar ao Alvo AI",
          description: "Otimizar sequência sem atrasar críticos.",
          intent: "quiet",
        },
      ],
    },
  },
  {
    id: "overdue-receipts",
    title: "Recebimentos em atraso",
    description: "R$ 42 mil vencidos há mais de 7 dias.",
    priority: "alta",
    tone: "rose",
    icon: "receipt",
    detail: {
      summary:
        "Há R$ 42 mil em títulos vencidos há mais de 7 dias, concentrados em 3 clientes. Cobrança ativa reduz risco de caixa.",
      metrics: [
        { label: "Em atraso", value: "R$ 42 mil" },
        { label: "Títulos", value: "7" },
        { label: "Clientes", value: "3" },
      ],
      seriesLabel: "Valor vencido (R$ mil)",
      series: [
        { label: "Qui", value: 28 },
        { label: "Sex", value: 31 },
        { label: "Sáb", value: 31 },
        { label: "Dom", value: 31 },
        { label: "Seg", value: 36 },
        { label: "Ter", value: 39 },
        { label: "Qua", value: 42 },
      ],
      actions: [
        {
          id: "collect",
          label: "Iniciar cobrança",
          description: "Fila priorizada dos 7 títulos.",
          intent: "primary",
        },
        {
          id: "open-aging",
          label: "Ver aging",
          description: "Abrir aging por cliente e faixa.",
          intent: "secondary",
        },
        {
          id: "ask-ai-cash",
          label: "Perguntar ao Alvo AI",
          description: "Impacto no caixa projetado da semana.",
          intent: "quiet",
        },
      ],
    },
  },
]

export const shortcuts = [
  { id: "orders", label: "Pedidos", icon: "file" as const },
  { id: "quotes", label: "Cotações", icon: "list" as const },
  { id: "payments", label: "Pagamentos", icon: "card" as const },
  { id: "cash", label: "Caixa", icon: "currency" as const },
  { id: "new", label: "Novo", icon: "plus" as const },
]

/** Cadastro de produtos — mocks tipados (sem Genkit / Firestore). */
export type ProductStatus = "ativo" | "rascunho" | "inativo"

export type ProductUnit = "kg" | "un" | "m" | "rolo" | "t" | "pc" | "cx"

export type ProductKind = "produto" | "servico"

export type ProductCondition = "novo" | "usado" | "recondicionado" | "nao_especificado"

export type ProductProduction = "propria" | "terceiros"

export type Product = {
  id: string
  name: string
  sku: string
  family: string
  unit: ProductUnit
  kind: ProductKind
  condition: ProductCondition
  brand: string
  production: ProductProduction
  salePrice: number | null
  costPrice: number | null
  netWeightKg: number | null
  grossWeightKg: number | null
  widthCm: number | null
  heightCm: number | null
  depthCm: number | null
  gtin: string
  ncm: string
  stockQty: number | null
  stockMin: number | null
  location: string
  description: string
  /** @deprecated use netWeightKg — mantido p/ colunas antigas */
  weightKg: number | null
  status: ProductStatus
  stockHint: string
  updatedAt: string
}

export type ProductDraft = {
  name: string
  sku: string
  family: string
  unit: ProductUnit
  kind: ProductKind
  condition: ProductCondition
  brand: string
  production: ProductProduction
  salePrice: string
  costPrice: string
  netWeightKg: string
  grossWeightKg: string
  widthCm: string
  heightCm: string
  depthCm: string
  gtin: string
  ncm: string
  stockQty: string
  stockMin: string
  location: string
  description: string
  notes: string
}

export type ProductFlowPhase =
  | "empty"
  | "extracting"
  | "draft"
  | "duplicate"
  | "saved"

export const productFamilies = [
  "Filme stretch",
  "Sacos industriais",
  "Granulado",
  "Embalagem técnica",
] as const

export const productUnits: ProductUnit[] = ["kg", "un", "pc", "cx", "m", "rolo", "t"]

export const productKinds: { value: ProductKind; label: string }[] = [
  { value: "produto", label: "Produto" },
  { value: "servico", label: "Serviço" },
]

export const productConditions: { value: ProductCondition; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "usado", label: "Usado" },
  { value: "recondicionado", label: "Recondicionado" },
  { value: "nao_especificado", label: "Não especificado" },
]

export const productProductions: { value: ProductProduction; label: string }[] =
  [
    { value: "propria", label: "Própria" },
    { value: "terceiros", label: "Terceiros" },
  ]

export const emptyProductDraft: ProductDraft = {
  name: "",
  sku: "",
  family: "Filme stretch",
  unit: "un",
  kind: "produto",
  condition: "novo",
  brand: "",
  production: "propria",
  salePrice: "",
  costPrice: "",
  netWeightKg: "",
  grossWeightKg: "",
  widthCm: "",
  heightCm: "",
  depthCm: "",
  gtin: "",
  ncm: "",
  stockQty: "",
  stockMin: "",
  location: "",
  description: "",
  notes: "",
}

export const initialProducts: Product[] = [
  {
    id: "prod-001",
    name: "Filme stretch PP 500 mm natural",
    sku: "PP-500-NAT",
    family: "Filme stretch",
    unit: "rolo",
    kind: "produto",
    condition: "novo",
    brand: "Alvo",
    production: "propria",
    salePrice: 89.9,
    costPrice: 52.4,
    netWeightKg: 12.5,
    grossWeightKg: 12.8,
    widthCm: 50,
    heightCm: 30,
    depthCm: 30,
    gtin: "7891000100101",
    ncm: "3920.10.99",
    stockQty: 84,
    stockMin: 20,
    location: "A-01-02",
    description: "Filme stretch em PP, largura 500 mm, bobina natural.",
    weightKg: 12.5,
    status: "ativo",
    stockHint: "84 rolos",
    updatedAt: "2026-09-28",
  },
  {
    id: "prod-002",
    name: "Granulado PEAD reciclado preto",
    sku: "PEAD-REC-PT",
    family: "Granulado",
    unit: "t",
    kind: "produto",
    condition: "novo",
    brand: "Alvo Recicla",
    production: "propria",
    salePrice: 4200,
    costPrice: 3100,
    netWeightKg: 1000,
    grossWeightKg: 1000,
    widthCm: null,
    heightCm: null,
    depthCm: null,
    gtin: "",
    ncm: "3901.20.29",
    stockQty: 6.4,
    stockMin: 3,
    location: "Silo 2",
    description: "Granulado PEAD reciclado, cor preta, uso industrial.",
    weightKg: 1000,
    status: "ativo",
    stockHint: "6,4 t",
    updatedAt: "2026-09-27",
  },
  {
    id: "prod-003",
    name: "Saco tubular 40×60 brilhante",
    sku: "SAC-40X60-BR",
    family: "Sacos industriais",
    unit: "un",
    kind: "produto",
    condition: "novo",
    brand: "Alvo",
    production: "propria",
    salePrice: 0.48,
    costPrice: 0.22,
    netWeightKg: 0.042,
    grossWeightKg: 0.045,
    widthCm: 40,
    heightCm: 60,
    depthCm: 0.1,
    gtin: "7891000100200",
    ncm: "3923.21.90",
    stockQty: 12400,
    stockMin: 2000,
    location: "B-03-11",
    description: "Saco tubular 40×60 cm, acabamento brilhante.",
    weightKg: 0.042,
    status: "ativo",
    stockHint: "12.400 un",
    updatedAt: "2026-09-26",
  },
  {
    id: "prod-004",
    name: "Filme técnico barreira 3 camadas",
    sku: "TEC-3L-120",
    family: "Embalagem técnica",
    unit: "kg",
    kind: "produto",
    condition: "novo",
    brand: "",
    production: "terceiros",
    salePrice: null,
    costPrice: null,
    netWeightKg: null,
    grossWeightKg: null,
    widthCm: null,
    heightCm: null,
    depthCm: null,
    gtin: "",
    ncm: "",
    stockQty: null,
    stockMin: null,
    location: "",
    description: "Filme barreira 3 camadas, espessura 120 µm (rascunho).",
    weightKg: null,
    status: "rascunho",
    stockHint: "—",
    updatedAt: "2026-09-25",
  },
]

/**
 * Heurística mock: interpreta o texto do usuário e monta um rascunho.
 * Quando o texto sugere o SKU já existente PP-500-NAT, o fluxo dispara conflito.
 */
export function extractProductDraft(
  prompt: string,
  attachmentName?: string | null
): ProductDraft {
  const text = prompt.toLowerCase()
  const fromAttachment = Boolean(attachmentName)
  const baseNotes = fromAttachment
    ? `Campos inferidos a partir de ${attachmentName}.`
    : "Campos sugeridos pelo Alvo AI (mock)."

  if (
    text.includes("pp-500") ||
    text.includes("pp 500") ||
    (text.includes("stretch") && text.includes("500"))
  ) {
    return {
      ...emptyProductDraft,
      name: "Filme stretch PP 500 mm natural",
      sku: "PP-500-NAT",
      family: "Filme stretch",
      unit: "rolo",
      brand: "Alvo",
      salePrice: "89.90",
      costPrice: "52.40",
      netWeightKg: "12.5",
      grossWeightKg: "12.8",
      widthCm: "50",
      heightCm: "30",
      depthCm: "30",
      gtin: "7891000100101",
      ncm: "3920.10.99",
      stockQty: "84",
      stockMin: "20",
      location: "A-01-02",
      description:
        "Filme stretch em PP, largura 500 mm, bobina natural — extraído do pedido.",
      notes: fromAttachment
        ? baseNotes
        : "SKU coincide com produto já cadastrado (mock de duplicata).",
    }
  }

  if (text.includes("pead") || text.includes("granulado")) {
    return {
      ...emptyProductDraft,
      name: "Granulado PEAD natural extrusão",
      sku: "PEAD-NAT-EX",
      family: "Granulado",
      unit: "t",
      brand: "Alvo Recicla",
      salePrice: "4200",
      costPrice: "3100",
      netWeightKg: "1000",
      grossWeightKg: "1000",
      ncm: "3901.20.29",
      stockQty: "2",
      stockMin: "1",
      location: "Silo 1",
      description: "Granulado PEAD natural para extrusão, uso industrial.",
      notes: baseNotes,
    }
  }

  if (text.includes("saco") || text.includes("tubular")) {
    return {
      ...emptyProductDraft,
      name: "Saco tubular 50×70 fosco",
      sku: "SAC-50X70-FO",
      family: "Sacos industriais",
      unit: "un",
      brand: "Alvo",
      salePrice: "0.55",
      costPrice: "0.25",
      netWeightKg: "0.055",
      grossWeightKg: "0.058",
      widthCm: "50",
      heightCm: "70",
      depthCm: "0.1",
      ncm: "3923.21.90",
      stockQty: "5000",
      stockMin: "1000",
      location: "B-02-08",
      description: "Saco tubular 50×70 cm, acabamento fosco.",
      notes: "Dimensões e acabamento inferidos do texto (mock).",
    }
  }

  const short =
    prompt.trim().length > 48 ? `${prompt.trim().slice(0, 48).trim()}…` : prompt.trim()

  return {
    ...emptyProductDraft,
    name: short || "Novo produto",
    sku: suggestSku(short || "NOVO"),
    family: "Embalagem técnica",
    unit: "kg",
    description: prompt.trim() || "Descrição pendente de revisão.",
    notes: fromAttachment
      ? `Anexo ${attachmentName} considerado na extração (UI only).`
      : "Rascunho genérico — revise nome, código e preços antes de salvar.",
  }
}

export function suggestSku(seed: string): string {
  const slug = seed
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 16)
  const suffix = Math.floor(100 + Math.random() * 900)
  return `${slug || "SKU"}-${suffix}`
}

export function findDuplicateProduct(
  draft: Pick<ProductDraft, "sku" | "name">,
  catalog: Product[]
): Product | null {
  const sku = draft.sku.trim().toLowerCase()
  const name = draft.name.trim().toLowerCase()
  return (
    catalog.find(
      (item) =>
        item.sku.toLowerCase() === sku || item.name.toLowerCase() === name
    ) ?? null
  )
}

function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const parsed = Number(trimmed.replace(",", "."))
  return Number.isFinite(parsed) ? parsed : null
}

function formatStockHint(qty: number | null, unit: ProductUnit): string {
  if (qty == null) return "—"
  const formatted = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2,
  }).format(qty)
  return `${formatted} ${unit}`
}

export function draftToProduct(draft: ProductDraft, id: string): Product {
  const netWeight = parseOptionalNumber(draft.netWeightKg)
  const stockQty = parseOptionalNumber(draft.stockQty)

  return {
    id,
    name: draft.name.trim() || "Produto sem nome",
    sku: draft.sku.trim().toUpperCase() || "SEM-SKU",
    family: draft.family,
    unit: draft.unit,
    kind: draft.kind,
    condition: draft.condition,
    brand: draft.brand.trim(),
    production: draft.production,
    salePrice: parseOptionalNumber(draft.salePrice),
    costPrice: parseOptionalNumber(draft.costPrice),
    netWeightKg: netWeight,
    grossWeightKg: parseOptionalNumber(draft.grossWeightKg),
    widthCm: parseOptionalNumber(draft.widthCm),
    heightCm: parseOptionalNumber(draft.heightCm),
    depthCm: parseOptionalNumber(draft.depthCm),
    gtin: draft.gtin.trim(),
    ncm: draft.ncm.trim(),
    stockQty,
    stockMin: parseOptionalNumber(draft.stockMin),
    location: draft.location.trim(),
    description: draft.description.trim(),
    weightKg: netWeight,
    status: "ativo",
    stockHint: formatStockHint(stockQty, draft.unit),
    updatedAt: new Date().toISOString().slice(0, 10),
  }
}

export function productToDraft(product: Product): ProductDraft {
  const num = (value: number | null) => (value != null ? String(value) : "")
  return {
    name: product.name,
    sku: product.sku,
    family: product.family,
    unit: product.unit,
    kind: product.kind,
    condition: product.condition,
    brand: product.brand,
    production: product.production,
    salePrice: num(product.salePrice),
    costPrice: num(product.costPrice),
    netWeightKg: num(product.netWeightKg),
    grossWeightKg: num(product.grossWeightKg),
    widthCm: num(product.widthCm),
    heightCm: num(product.heightCm),
    depthCm: num(product.depthCm),
    gtin: product.gtin,
    ncm: product.ncm,
    stockQty: num(product.stockQty),
    stockMin: num(product.stockMin),
    location: product.location,
    description: product.description,
    notes: "",
  }
}

export function formatMoneyBRL(value: number | null): string {
  if (value == null) return "—"
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function greetingForHour(hour: number): string {
  if (hour < 12) return "Bom dia"
  if (hour < 18) return "Boa tarde"
  return "Boa noite"
}

export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date)
}
