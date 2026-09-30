import Link from "next/link"

type PlaceholderPageProps = {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col justify-center gap-3 px-4 py-12 md:px-6 md:py-16">
        <p className="text-sm font-medium text-zinc-400">Módulo em construção</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-500">
          {description}
        </p>
        <Link
          href="/"
          className="mt-4 w-fit text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
