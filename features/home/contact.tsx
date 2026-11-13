import { ContactCta } from '@/features/home/contact-cta'

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-16 px-gutter pb-16 pt-section">
      <h2 id="contact-title" className="t-h1 pb-8">
        Got something in mind?
      </h2>
      <ContactCta />
    </section>
  )
}
