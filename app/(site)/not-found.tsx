import { RollLink } from '@/components/site/roll-link'

// Next answers with a 404 status and a noindex tag for this page.
export default function NotFound() {
  return (
    <main id="main" className="min-h-svh px-gutter pb-section pt-28">
      <p className="t-label text-site-muted">(404)</p>
      <h1 className="t-h1 mt-4 max-w-[18ch]">That page is not here.</h1>
      <p className="text-lead mt-6 max-w-[40ch] text-site-muted">
        It may have moved, or the link has a typo. These are the places that do exist.
      </p>
      <ul className="t-label mt-10 flex flex-col items-start gap-3">
        <li>
          <RollLink href="/projects">Projects</RollLink>
        </li>
        <li>
          <RollLink href="/blogs">Writing</RollLink>
        </li>
        <li>
          <RollLink href="/services">Services</RollLink>
        </li>
        <li>
          <RollLink href="/">Home</RollLink>
        </li>
      </ul>
    </main>
  )
}
