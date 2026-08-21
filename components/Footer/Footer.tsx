import { Github, Mail } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border/70 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:flex-row sm:text-left">
        <div>
          <Link href="/" className="text-lg font-semibold tracking-[-.04em]">
            Rafi Ferdos<span className="text-primary">.</span>
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">
            Web, mobile and realtime products—owned end to end.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/rafiferdos"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="rounded-full border border-border p-2.5 transition hover:text-primary"
          >
            <Github className="size-4" />
          </a>
          <a
            href="mailto:rafiferdos@gmail.com"
            aria-label="Email"
            className="rounded-full border border-border p-2.5 transition hover:text-primary"
          >
            <Mail className="size-4" />
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Rafi Ferdos
        </p>
      </div>
    </footer>
  )
}
