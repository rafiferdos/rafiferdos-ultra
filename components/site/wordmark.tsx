import Link from 'next/link'

export function Wordmark() {
  return (
    <Link href="/" aria-label="Rafi Ferdos, home" className="nav-trim inline-block text-xl leading-none">
      <span className="font-extrabold uppercase font-stretch-[75%]">Rafi</span>
      <span className="wordmark-chip font-light italic font-stretch-[125%]">f</span>
      <span className="font-light italic font-stretch-[125%]">erdos</span>
    </Link>
  )
}
