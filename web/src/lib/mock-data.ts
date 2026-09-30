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
  { id: "sales", label: "Vendas", href: "/vendas", icon: "sales" },
  { id: "purchases", label: "Compras", href: "/compras", icon: "purchases" },
  {
    id: "production",
    label: "Produção",
    href: "/producao",
    icon: "production",
  },
  { id: "inventory", label: "Estoque", href: "/estoque", icon: "inventory" },
  {
    id: "finance",
    label: "Financeiro",
    href: "/financeiro",
    icon: "finance",
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
  },
  {
    id: "pp-stock",
    title: "Estoque de PP abaixo do ideal",
    description: "Cobertura estimada em 4 dias úteis.",
    priority: "alta",
    tone: "amber",
    icon: "package",
  },
  {
    id: "hdpe-margin",
    title: "Margem do PEAD caiu",
    description: "Queda de 2,4 pp vs média dos últimos 30 dias.",
    priority: "media",
    tone: "blue",
    icon: "trend-down",
  },
  {
    id: "repurchase",
    title: "Clientes com chance de recompra",
    description: "5 contas com padrão de pedido recorrente.",
    priority: "media",
    tone: "green",
    icon: "users",
  },
  {
    id: "increase-production",
    title: "Aumentar produção esta semana",
    description: "Capacidade ociosa detectada nas linhas 2 e 3.",
    priority: "baixa",
    tone: "violet",
    icon: "trending-up",
  },
  {
    id: "overdue-receipts",
    title: "Recebimentos em atraso",
    description: "R$ 42 mil vencidos há mais de 7 dias.",
    priority: "alta",
    tone: "rose",
    icon: "receipt",
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
