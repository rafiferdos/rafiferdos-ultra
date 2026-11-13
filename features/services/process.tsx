const steps = [
  { title: 'Talk', text: 'We agree what you need and who it is for.' },
  { title: 'Plan', text: 'I own the requirements and the architecture decisions.' },
  { title: 'Build', text: 'Frontend, backend and mobile from one person, with code review before it ships.' },
  { title: 'Launch', text: 'I deploy it and own the release.' }
]

export function Process() {
  return (
    <section aria-labelledby="process-title" className="px-gutter pb-section">
      <h2 id="process-title" data-reveal className="t-label pb-6">
        (How it goes)
      </h2>
      <ol className="grid gap-10 border-t border-site-line pt-8 md:grid-cols-4 md:gap-8">
        {steps.map((step, index) => (
          <li key={step.title} data-reveal>
            <span className="t-index">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="t-h3 mt-4">{step.title}</h3>
            <p className="text-lead mt-3 text-site-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
