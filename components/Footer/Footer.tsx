import { AtSign, Github, Linkedin, Mail, Phone } from 'lucide-react'
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
            Building useful web and mobile products—and ready for the team
            behind the next one.
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
            href="https://www.linkedin.com/in/rafiferdos"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="rounded-full border border-border p-2.5 transition hover:text-primary"
          >
            <Linkedin className="size-4" />
          </a>
          <a
            href="https://x.com/rafiferdos"
            target="_blank"
            rel="noreferrer"
            aria-label="X"
            className="rounded-full border border-border p-2.5 transition hover:text-primary"
          >
            <AtSign className="size-4" />
          </a>
          <a
            href="tel:+8801921479294"
            aria-label="Phone"
            className="rounded-full border border-border p-2.5 transition hover:text-primary"
          >
            <Phone className="size-4" />
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
