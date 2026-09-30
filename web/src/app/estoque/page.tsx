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
          Saldos e cobertura entram numa etapa seguinte. O cadastro de produtos
          com Alvo AI já está disponível para iteração visual.
        </p>
        <Button
          className="mt-4 w-fit"
          render={<Link href="/estoque/produtos" />}
        >
          Ir para Produtos
        </Button>
      </div>
    </div>
  )
}
