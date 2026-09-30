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
