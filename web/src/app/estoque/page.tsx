import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function EstoquePage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col justify-center gap-3 px-4 py-12 md:px-6 md:py-16">
        <p className="text-sm font-medium text-slate-400">Estoque</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Visão geral
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-slate-500">
          Produtos e categorias já estão no protótipo. Saldos e cobertura entram
          numa etapa seguinte.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button render={<Link href="/estoque/produtos" />}>
            Produtos
          </Button>
          <Button
            variant="outline"
            render={<Link href="/estoque/categorias" />}
          >
            Categorias
          </Button>
        </div>
      </div>
    </div>
  )
}
